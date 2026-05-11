import OpenAI from "openai";
import { ScoreResult } from "./scoring";

// Lazy initialization to prevent Vercel static build crashes
let openaiInstance: OpenAI | null = null;
const getOpenAI = () => {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
    });
  }
  return openaiInstance;
};

export interface DimensionAnalysis {
  summary: string;
  strengths: string[];
  challenges: string[];
  improvementAdvice: string;
  actionSteps: string[];
}

export interface AIReportData {
  summary: string; // Global summary
  strengths: string[]; // Global strengths
  challenges: string[]; // Global challenges
  improvementAdvice: string; // Global advice
  actionSteps: string[]; // Global action steps
  dimensions: Record<string, DimensionAnalysis>; // Per-dimension analysis
}

export async function generateAIReport(
  userName: string,
  dimensionScores: ScoreResult[],
  overallScore: number
): Promise<AIReportData> {
  const summarizedDimensions = dimensionScores
    .map(
      (d) =>
        `- ${d.dimension}: ${d.score}/${d.maxScore} (${d.classification})`
    )
    .join("\n");

  const prompt = `
    You are an expert educational psychologist and emotional intelligence coach.
    Analyze the following emotional balance assessment results for a student named ${userName}.
    
    Overall Emotional Balance Score: ${overallScore.toFixed(1)}%
    
    Dimension Breakdown:
    ${summarizedDimensions}
    
    Create a detailed, encouraging, and professional emotional report based on the following structure:
    
    1. For EACH of the 5 dimensions, provide:
       - summary: 100–150 words, conversational and student-friendly, explaining what the score means.
       - strengths: 3 descriptive bullet points (1-2 lines each), focusing on positive behaviors.
       - challenges: 3 descriptive bullet points (1-2 lines each), focusing on areas for growth without negative labeling.
       - improvementAdvice: A short, supportive paragraph on gradual improvement.
       - actionSteps: 3 clear, simple, and realistic actionable suggestions for a school student.

    2. An OVERALL Snapshot (Global):
       - summary: A final encouraging note.
       - strengths: 3 strongest overall emotional areas.
       - challenges: 2-3 overall growth areas.
       - improvementAdvice: Recommended focus areas for the next month.
       - actionSteps: 3-4 concrete global action steps.

    IMPORTANT TONE GUIDELINES:
    - Encouraging, balanced, and student-friendly.
    - Simple language, no overly psychological jargon.
    - Professional but conversational.
    - No negative labeling or repetition.
    
    Return the response ONLY as a JSON object with the following structure:
    {
      "summary": "Final encouragement note",
      "strengths": ["Global strength 1", ...],
      "challenges": ["Global challenge 1", ...],
      "improvementAdvice": "Recommended focus areas summary",
      "actionSteps": ["Global action 1", ...],
      "dimensions": {
        "STRESS_HANDLING": { ...DimensionAnalysis },
        "EMOTIONAL_REGULATION": { ...DimensionAnalysis },
        "RESILIENCE_RECOVERY": { ...DimensionAnalysis },
        "EMOTIONAL_AWARENESS": { ...DimensionAnalysis },
        "SOCIAL_EMOTIONAL_COMFORT": { ...DimensionAnalysis }
      }
    }
  `;

  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a specialized AI for emotional intelligence analysis. You generate multi-page, detailed psychological reports for students." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("AI failed to generate a response.");

    return JSON.parse(content) as AIReportData;
  } catch (error) {
    console.error("Error generating AI report:", error);
    // Fallback data
    return {
      summary: "Your emotional balance shows great potential for growth.",
      strengths: ["Self-awareness", "Resilience"],
      challenges: ["Stress management"],
      improvementAdvice: "Focus on mindfulness.",
      actionSteps: ["Practice deep breathing"],
      dimensions: {}
    };
  }
}

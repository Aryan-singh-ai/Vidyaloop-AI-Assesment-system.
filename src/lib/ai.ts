import OpenAI from "openai";
import { ScoreResult } from "./scoring";

// Lazy initialization — prevents crashes during Next.js static build phase
let openaiInstance: OpenAI | null = null;

const getOpenAI = (): OpenAI => {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "dummy-key-for-build") {
      throw new Error("OPENAI_API_KEY is not configured.");
    }
    openaiInstance = new OpenAI({ apiKey });
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
  summary: string;
  strengths: string[];
  challenges: string[];
  improvementAdvice: string;
  actionSteps: string[];
  dimensions: Record<string, DimensionAnalysis>;
}

export async function generateAIReport(
  userName: string,
  dimensionScores: ScoreResult[],
  overallScore: number
): Promise<AIReportData> {
  const summarizedDimensions = dimensionScores
    .map((d) => `- ${d.dimension}: ${d.score}/${d.maxScore} (${d.classification})`)
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
       - summary: A final encouraging note (2-3 sentences).
       - strengths: 3 strongest overall emotional areas.
       - challenges: 2-3 overall growth areas.
       - improvementAdvice: Recommended focus areas for the next month.
       - actionSteps: 3-4 concrete global action steps.

    IMPORTANT TONE GUIDELINES:
    - Encouraging, balanced, and student-friendly.
    - Simple language, no overly psychological jargon.
    - Professional but conversational.
    - No negative labeling or repetition.
    
    Return the response ONLY as a valid JSON object with this exact structure:
    {
      "summary": "Final encouragement note",
      "strengths": ["Global strength 1", "Global strength 2", "Global strength 3"],
      "challenges": ["Global challenge 1", "Global challenge 2"],
      "improvementAdvice": "Recommended focus areas summary",
      "actionSteps": ["Global action 1", "Global action 2", "Global action 3"],
      "dimensions": {
        "STRESS_HANDLING": {
          "summary": "...",
          "strengths": ["...", "...", "..."],
          "challenges": ["...", "...", "..."],
          "improvementAdvice": "...",
          "actionSteps": ["...", "...", "..."]
        },
        "EMOTIONAL_REGULATION": { ... },
        "RESILIENCE_RECOVERY": { ... },
        "EMOTIONAL_AWARENESS": { ... },
        "SOCIAL_EMOTIONAL_COMFORT": { ... }
      }
    }
  `;

  try {
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a specialized AI for emotional intelligence analysis. You generate multi-page, detailed psychological reports for students. Always respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("OpenAI returned an empty response.");

    const parsed = JSON.parse(content) as AIReportData;

    // Validate the shape of the response
    if (!parsed.summary || !parsed.dimensions) {
      throw new Error("AI response is missing required fields.");
    }

    return parsed;
  } catch (error: any) {
    console.error("[AI_REPORT_ERROR]", error?.message || error);
    // Return a well-structured fallback so the report page still renders
    const fallbackDimension: DimensionAnalysis = {
      summary:
        "Your responses in this dimension show meaningful self-awareness. Keep exploring your emotional patterns and remember that growth is a continuous journey.",
      strengths: [
        "You demonstrate a consistent effort to understand your emotions.",
        "Your responses reflect a desire for self-improvement.",
        "You show resilience in the face of everyday challenges.",
      ],
      challenges: [
        "There is room to deepen your understanding of this emotional dimension.",
        "Consider exploring new strategies to manage emotions in this area.",
        "Building habits around this dimension will yield long-term benefits.",
      ],
      improvementAdvice:
        "Take small, consistent steps to build skills in this area. Journaling and mindfulness exercises can be particularly helpful.",
      actionSteps: [
        "Spend 5 minutes each day journaling about your emotional experiences.",
        "Practice one mindfulness technique this week.",
        "Share your feelings with a trusted friend or mentor.",
      ],
    };

    return {
      summary:
        "Your emotional assessment reveals a thoughtful and self-aware individual with great potential for growth. Keep building on your strengths and stay curious about your inner world.",
      strengths: [
        "Strong self-awareness and reflective capacity",
        "Genuine motivation for emotional growth",
        "Ability to persevere through challenges",
      ],
      challenges: [
        "Developing consistent emotional regulation strategies",
        "Building resilience during stressful situations",
      ],
      improvementAdvice:
        "Focus on one emotional dimension at a time over the next month. Small, consistent habits—like journaling, deep breathing, and peer conversations—will yield the greatest long-term improvement.",
      actionSteps: [
        "Start a daily 5-minute reflection journal.",
        "Practice a calming breathing exercise before stressful events.",
        "Identify one mentor or friend to check in with weekly.",
        "Review your assessment scores and set one measurable goal per dimension.",
      ],
      dimensions: {
        STRESS_HANDLING: fallbackDimension,
        EMOTIONAL_REGULATION: fallbackDimension,
        RESILIENCE_RECOVERY: fallbackDimension,
        EMOTIONAL_AWARENESS: fallbackDimension,
        SOCIAL_EMOTIONAL_COMFORT: fallbackDimension,
      },
    };
  }
}

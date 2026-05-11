import { Dimension, QUESTIONS } from "./questions";

export interface ScoreResult {
  dimension: Dimension;
  score: number;
  maxScore: number;
  percentage: number;
  classification: string;
}

export function calculateDimensionScores(responses: { questionId: string; value: number }[]): ScoreResult[] {
  const dimensionTotals: Record<Dimension, number> = {
    STRESS_HANDLING: 0,
    EMOTIONAL_REGULATION: 0,
    RESILIENCE_RECOVERY: 0,
    EMOTIONAL_AWARENESS: 0,
    SOCIAL_EMOTIONAL_COMFORT: 0,
  };

  responses.forEach((resp) => {
    const question = QUESTIONS.find((q) => q.id === resp.questionId);
    if (!question) return;

    let value = resp.value;
    if (question.isReversed) {
      // 1 -> 5, 2 -> 4, 3 -> 3, 4 -> 2, 5 -> 1
      value = 6 - value;
    }

    dimensionTotals[question.dimension] += value;
  });

  return Object.entries(dimensionTotals).map(([dim, score]) => {
    const dimension = dim as Dimension;
    const maxScore = 40; // 8 questions * 5 points
    const percentage = (score / maxScore) * 100;

    return {
      dimension,
      score,
      maxScore,
      percentage,
      classification: getClassification(score),
    };
  });
}

export function getClassification(score: number): string {
  if (score <= 12) return "Emerging";
  if (score <= 22) return "Developing";
  if (score <= 30) return "Strong";
  return "Standout";
}

export function calculateOverallBalance(dimensionScores: ScoreResult[]): number {
  const total = dimensionScores.reduce((acc, curr) => acc + curr.percentage, 0);
  return total / dimensionScores.length;
}

export function getStrongestAndGrowthAreas(dimensionScores: ScoreResult[]) {
  const sorted = [...dimensionScores].sort((a, b) => b.score - a.score);
  return {
    strongest: sorted.slice(0, 2).map(d => d.dimension),
    growth: sorted.slice(-2).map(d => d.dimension),
  };
}

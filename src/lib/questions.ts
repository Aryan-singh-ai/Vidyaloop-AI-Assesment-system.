export type Dimension = 
  | "STRESS_HANDLING"
  | "EMOTIONAL_REGULATION"
  | "RESILIENCE_RECOVERY"
  | "EMOTIONAL_AWARENESS"
  | "SOCIAL_EMOTIONAL_COMFORT";

export interface Question {
  id: string;
  dimension: Dimension;
  text: string;
  isReversed: boolean;
}

export const QUESTIONS: Question[] = [
  // Stress Handling
  { id: "sh1", dimension: "STRESS_HANDLING", text: "I can remain calm even when faced with multiple deadlines at once.", isReversed: false },
  { id: "sh2", dimension: "STRESS_HANDLING", text: "I find it difficult to concentrate when I am under pressure.", isReversed: true },
  { id: "sh3", dimension: "STRESS_HANDLING", text: "I have effective strategies for managing my academic workload.", isReversed: false },
  { id: "sh4", dimension: "STRESS_HANDLING", text: "I often feel overwhelmed by the expectations placed on me.", isReversed: true },
  { id: "sh5", dimension: "STRESS_HANDLING", text: "I can maintain a healthy sleep schedule even during busy weeks.", isReversed: false },
  { id: "sh6", dimension: "STRESS_HANDLING", text: "Minor setbacks often cause me significant anxiety.", isReversed: true },
  { id: "sh7", dimension: "STRESS_HANDLING", text: "I know when to take a break to prevent burnout.", isReversed: false },
  { id: "sh8", dimension: "STRESS_HANDLING", text: "I tend to procrastinate more when I feel stressed.", isReversed: true },

  // Emotional Regulation
  { id: "er1", dimension: "EMOTIONAL_REGULATION", text: "I can accurately identify what I am feeling in the moment.", isReversed: false },
  { id: "er2", dimension: "EMOTIONAL_REGULATION", text: "I often act on impulse when I am angry or upset.", isReversed: true },
  { id: "er3", dimension: "EMOTIONAL_REGULATION", text: "I can shift my mood from negative to positive when necessary.", isReversed: false },
  { id: "er4", dimension: "EMOTIONAL_REGULATION", text: "I find it hard to control my emotions when things go wrong.", isReversed: true },
  { id: "er5", dimension: "EMOTIONAL_REGULATION", text: "I use healthy coping mechanisms to deal with difficult feelings.", isReversed: false },
  { id: "er6", dimension: "EMOTIONAL_REGULATION", text: "I tend to dwell on negative thoughts for a long time.", isReversed: true },
  { id: "er7", dimension: "EMOTIONAL_REGULATION", text: "I am aware of how my emotions affect my decision-making.", isReversed: false },
  { id: "er8", dimension: "EMOTIONAL_REGULATION", text: "I often feel like my emotions are 'driving' me rather than the other way around.", isReversed: true },

  // Resilience & Recovery
  { id: "rr1", dimension: "RESILIENCE_RECOVERY", text: "I bounce back quickly after a disappointing grade or feedback.", isReversed: false },
  { id: "rr2", dimension: "RESILIENCE_RECOVERY", text: "A single failure can make me want to give up on a goal.", isReversed: true },
  { id: "rr3", dimension: "RESILIENCE_RECOVERY", text: "I see challenges as opportunities to learn and grow.", isReversed: false },
  { id: "rr4", dimension: "RESILIENCE_RECOVERY", text: "I struggle to move past social rejections or misunderstandings.", isReversed: true },
  { id: "rr5", dimension: "RESILIENCE_RECOVERY", text: "I am confident in my ability to handle future difficulties.", isReversed: false },
  { id: "rr6", dimension: "RESILIENCE_RECOVERY", text: "I lose my motivation easily when things get hard.", isReversed: true },
  { id: "rr7", dimension: "RESILIENCE_RECOVERY", text: "I have a supportive network I can turn to during tough times.", isReversed: false },
  { id: "rr8", dimension: "RESILIENCE_RECOVERY", text: "I find it hard to find meaning or lessons in my struggles.", isReversed: true },

  // Emotional Awareness
  { id: "ea1", dimension: "EMOTIONAL_AWARENESS", text: "I pay attention to the physical sensations of my emotions (e.g., tension in shoulders).", isReversed: false },
  { id: "ea2", dimension: "EMOTIONAL_AWARENESS", text: "I am often surprised by my own emotional reactions.", isReversed: true },
  { id: "ea3", dimension: "EMOTIONAL_AWARENESS", text: "I can distinguish between similar emotions, like frustration and anger.", isReversed: false },
  { id: "ea4", dimension: "EMOTIONAL_AWARENESS", text: "I find it difficult to put my feelings into words.", isReversed: true },
  { id: "ea5", dimension: "EMOTIONAL_AWARENESS", text: "I regularly reflect on why I felt a certain way during the day.", isReversed: false },
  { id: "ea6", dimension: "EMOTIONAL_AWARENESS", text: "I tend to ignore my feelings until they become overwhelming.", isReversed: true },
  { id: "ea7", dimension: "EMOTIONAL_AWARENESS", text: "I am sensitive to the emotional atmosphere of a room or group.", isReversed: false },
  { id: "ea8", dimension: "EMOTIONAL_AWARENESS", text: "I struggle to understand why others feel the way they do.", isReversed: true },

  // Social & Emotional Comfort
  { id: "sec1", dimension: "SOCIAL_EMOTIONAL_COMFORT", text: "I feel comfortable expressing my needs and boundaries to others.", isReversed: false },
  { id: "sec2", dimension: "SOCIAL_EMOTIONAL_COMFORT", text: "I often feel anxious or self-conscious in social settings.", isReversed: true },
  { id: "sec3", dimension: "SOCIAL_EMOTIONAL_COMFORT", text: "I can empathize with others even when I disagree with them.", isReversed: false },
  { id: "sec4", dimension: "SOCIAL_EMOTIONAL_COMFORT", text: "I find it hard to trust others with my personal feelings.", isReversed: true },
  { id: "sec5", dimension: "SOCIAL_EMOTIONAL_COMFORT", text: "I am able to resolve conflicts with friends or peers constructively.", isReversed: false },
  { id: "sec6", dimension: "SOCIAL_EMOTIONAL_COMFORT", text: "I often feel lonely even when I am around other people.", isReversed: true },
  { id: "sec7", dimension: "SOCIAL_EMOTIONAL_COMFORT", text: "I enjoy collaborating with others on group projects.", isReversed: false },
  { id: "sec8", dimension: "SOCIAL_EMOTIONAL_COMFORT", text: "I tend to withdraw from others when I am feeling emotionally low.", isReversed: true },
];

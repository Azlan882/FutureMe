export type SmokingOption = 'never' | 'occasionally' | 'daily';
export type ExerciseOption = 'rarely' | 'sometimes' | 'regularly';
export type SleepOption = 'less_than_6' | '6_to_7' | '8_plus';
export type DietOption = 'mostly_unhealthy' | 'mixed' | 'mostly_healthy';
export type SunExposureOption = 'low' | 'moderate' | 'high';
export type StressOption = 'low' | 'moderate' | 'high';
export type AlcoholOption = 'never' | 'occasionally' | 'frequently';

export interface LifestyleHabits {
  smoking: SmokingOption;
  exercise: ExerciseOption;
  sleep: SleepOption;
  diet: DietOption;
  sunExposure: SunExposureOption;
  stress: StressOption;
  alcohol: AlcoholOption;
}

export type FutureAge = 5 | 10 | 20 | 30;

export type FlowStep =
  | 'welcome'
  | 'upload'
  | 'questions'
  | 'age'
  | 'generating'
  | 'results';

export interface VisualImpactFactor {
  title: string;
  impactLevel: 'low' | 'moderate' | 'high' | 'beneficial';
  description: string;
  affectedFeature: string;
}

export interface GenerationResult {
  originalImage: string;
  futureImage: string;
  years: FutureAge;
  habits: LifestyleHabits;
  impactFactors: VisualImpactFactor[];
  summaryNote: string;
}

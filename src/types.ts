export interface PreparationPlanInput {
  studentName: string;
  jobRole: string;
  programmingLanguage: string;
  topic: string;
  difficultyLevel: string;
}

export interface HRQuestion {
  id: number;
  question: string;
  tips: string;
}

export interface TechnicalQuestion {
  id: number;
  question: string;
  sampleAnswer: string;
}

export interface CodingQuestion {
  id: number;
  title: string;
  problemDescription: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  starterCode: string;
}

export interface AptitudeQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface RoadmapStep {
  step: number;
  phase: string;
  topic: string;
  description: string;
}

export interface AIResponse {
  hrQuestions: HRQuestion[];
  technicalQuestions: TechnicalQuestion[];
  codingQuestions: CodingQuestion[];
  aptitudeQuestions: AptitudeQuestion[];
  preparationTips: string[];
  learningRoadmap: RoadmapStep[];
}

export interface PreparationRecord {
  id: string;
  studentName: string;
  jobRole: string;
  programmingLanguage: string;
  topic: string;
  difficultyLevel: string;
  aiResponse: AIResponse;
  createdDate: string;
}

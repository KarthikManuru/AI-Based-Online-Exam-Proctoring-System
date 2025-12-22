// Type definitions for the quiz application

export interface AttemptResponse {
  question: string;
  options: string[];
  chosenIndex: number;
  correctIndex: number;
  isCorrect: boolean;
}

export interface Attempt {
  id: string;
  name: string;
  email: string;
  studentId: string;
  questionSet: 'A' | 'B' | 'C' | 'D';
  responses: AttemptResponse[];
  answers: number[];
  score: number;
  totalQuestions: number;
  cheated: boolean;
  cheatCount: number;
  status: 'in-progress' | 'submitted';
  startedAt: Date;
  endedAt: Date | null;
  timeRemaining: number;
}

export interface AdminLog {
  id: string;
  action: string;
  timestamp: Date;
  details: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
}

// TensorFlow.js types
export interface DetectedObject {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

export interface ObjectDetectionModel {
  detect: (input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) => Promise<DetectedObject[]>;
}
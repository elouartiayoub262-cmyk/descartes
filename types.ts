
export interface Question {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
}

export interface UserAnswer {
  questionId: number;
  selectedOption: string;
  isCorrect: boolean;
  explanation?: string;
}

export enum QuizStatus {
  START = 'START',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS'
}

export enum CorrectionMode {
  IMMEDIATE = 'IMMEDIATE',
  FINAL = 'FINAL'
}

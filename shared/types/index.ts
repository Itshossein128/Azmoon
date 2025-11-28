export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  registeredAt: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'آسان' | 'متوسط' | 'سخت';
  duration: number;
  totalQuestions: number;
  passingScore: number;
  price: number;
  imageUrl: string;
  instructor: string;
  participants: number;
  rating: number;
  startDate?: string;
  endDate?: string;
  tags: string[];
  questions: Question[];
}

export interface Question {
  id: string;
  examId: string;
  category?: string;
  text: string;
  type: QuestionType;
  options?: string[]; // Used for multiple-choice, multiple-answer, and matching
  prompts?: string[]; // Used for matching questions (the items to be matched)
  correctAnswer?: number | number[] | string;
  points: number;
  mediaUrl?: string; // URL for image, video, or audio
  gradingCriteria?: string;
}

export interface Result {
  id: string;
  examId: string;
  userId: string;
  status: 'graded' | 'pending_review';
  score?: number;
  totalScore?: number;
  percentage?: number;
  passed?: boolean;
  completedAt: string;
  timeSpent: number;
  answers: UserAnswer[];
  correctAnswers?: number;
  examTitle?: string;
}

export interface UserAnswer {
  questionId: string;
  answer: number | string | string[];
  isCorrect?: boolean;
  points: number;
  score?: number; // Score given by the grader for essay questions
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  isFeatured?: boolean;
}

export type QuestionType = 'multiple-choice' | 'multiple-answer' | 'fill-in-the-blank' | 'essay-with-upload' | 'true-false' | 'essay' | 'matching';

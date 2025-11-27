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
  options?: string[];
  correctAnswer?: number | number[] | string;
  points: number;
  imageUrl?: string;
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
  answers: any[]; // Can hold complex answer structures
  correctAnswers?: number;
  examTitle?: string;
}

export interface UserAnswer {
  questionId: string;
  answer: number | string;
  isCorrect: boolean;
  points: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  isFeatured?: boolean;
}

export type QuestionType = 'multiple-choice' | 'multiple-answer' | 'fill-in-the-blank' | 'essay-with-upload' | 'true-false' | 'essay';

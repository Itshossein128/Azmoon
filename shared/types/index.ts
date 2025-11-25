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
  text: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  options?: string[];
  correctAnswer?: number;
  points: number;
  imageUrl?: string;
}

export interface Result {
  id: string;
  examId: string;
  userId: string;
  score: number;
  totalScore: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  timeSpent: number;
  answers: number[];
  correctAnswers: number;
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

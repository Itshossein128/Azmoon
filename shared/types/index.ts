export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  registeredAt: string;
  balance: number;
  subscriptionType?: 'free' | 'pro' | 'premium';
  subscriptionExpiresAt?: string; // ISO 8601 format
  autoRenew?: boolean;
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

export interface TestCase {
  input: string;
  expectedOutput: string;
  isSample?: boolean; // To show to the user
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
  // For coding questions
  language?: 'javascript' | 'python';
  testCases?: TestCase[];
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

export type QuestionType = 'multiple-choice' | 'multiple-answer' | 'fill-in-the-blank' | 'essay-with-upload' | 'true-false' | 'essay' | 'matching' | 'coding';

export type DiscountType = 'percentage' | 'fixed-amount' | 'combined';

export interface DiscountCode {
  id: string;
  code: string;
  type: DiscountType;
  value: number; // Percentage or fixed amount
  maxValue?: number; // For percentage discounts
  minValueForCombined?: number; // Threshold for combined discounts
  combinedValue?: number; // Fixed amount for combined discounts below threshold
  startDate: string; // ISO 8601 format
  endDate: string; // ISO 8601 format
  totalUses: number;
  usesPerUser: number;
  allowedUsers?: 'all' | 'new' | string[]; // 'all', 'new', or an array of user IDs
  allowedProducts?: 'all' | 'subscriptions' | string[]; // 'all', 'subscriptions', or an array of exam IDs
  minPurchaseAmount?: number;
  isActive: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
}

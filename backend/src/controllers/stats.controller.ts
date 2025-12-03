import { Request, Response } from 'express';
import { mockUsers, mockExams, mockResults } from '../data';

export const getStats = (req: Request, res: Response) => {
  const totalUsers = mockUsers.length;
  const totalExams = mockExams.length;
  const totalCompletedExams = mockResults.length;

  res.json({
    totalUsers,
    totalExams,
    totalCompletedExams,
  });
};

export const getStudentPerformance = (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Mock data for student performance
  const performanceData = {
    studentName: user.name,
    categories: [
      { category: 'ریاضی', score: 85, total: 100, average: 78 },
      { category: 'علوم', score: 92, total: 100, average: 85 },
      { category: 'تاریخ', score: 75, total: 100, average: 80 },
      { category: 'ادبیات', score: 68, total: 100, average: 72 },
      { category: 'زبان انگلیسی', score: 95, total: 100, average: 90 },
    ],
    overallScore: 83,
    completedExams: 12,
    strengths: ['علوم', 'زبان انگلیسی'],
    weaknesses: ['ادبیات'],
  };

  res.json(performanceData);
};

export const getStudentProgress = (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Mock data for student's progress over time
  const progressData = [
    { date: 'فروردین', score: 65 },
    { date: 'اردیبهشت', score: 72 },
    { date: 'خرداد', score: 70 },
    { date: 'تیر', score: 78 },
    { date: 'مرداد', score: 85 },
    { date: 'شهریور', score: 90 },
  ];

  res.json(progressData);
};

export const getQuestionStats = (req: Request, res: Response) => {
  // Mock data for question statistics
  const questionStats = [
    { id: '1', text: 'کدام یک از موارد زیر یک فعل کمکی در زبان انگلیسی است؟', correctPercentage: 88, totalAnswers: 150 },
    { id: '2', text: 'جمله "She ___ to school every day" با کدام فعل کامل می‌شود؟', correctPercentage: 95, totalAnswers: 148 },
    { id: '3', text: 'کلمه "Beautiful" چه نوع کلمه‌ای است؟', correctPercentage: 92, totalAnswers: 145 },
    { id: 'm1', text: 'مشتق تابع f(x) = x^2 چیست؟', correctPercentage: 65, totalAnswers: 98 },
    { id: 'm3', text: 'کدام یک از موارد زیر جزو اعداد اول هستند؟', correctPercentage: 55, totalAnswers: 95 },
    { id: 'p2', text: 'خروجی کد `print(len("hello"))` چیست؟', correctPercentage: 98, totalAnswers: 210 },
    { id: 'p4', text: 'برای چاپ کردن یک متن در پایتون از دستور ____ استفاده می‌شود.', correctPercentage: 80, totalAnswers: 205 },
  ];

  res.json(questionStats);
};

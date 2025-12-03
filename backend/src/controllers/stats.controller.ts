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
      { category: 'ریاضی', score: 85, total: 100 },
      { category: 'علوم', score: 92, total: 100 },
      { category: 'تاریخ', score: 75, total: 100 },
      { category: 'ادبیات', score: 68, total: 100 },
      { category: 'زبان انگلیسی', score: 95, total: 100 },
    ],
    overallScore: 83,
    completedExams: 12,
    strengths: ['علوم', 'زبان انگلیسی'],
    weaknesses: ['ادبیات'],
  };

  res.json(performanceData);
};

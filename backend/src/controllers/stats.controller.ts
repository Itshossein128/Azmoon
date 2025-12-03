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

import { Request, Response } from 'express';
import { mockExams, mockUsers, mockResults } from '../data';

export const getTeacherStudents = (req: Request, res: Response) => {
  const { teacherId } = req.params;
  const teacher = mockUsers.find(u => u.id === teacherId);

  if (!teacher) {
    return res.status(404).send('Teacher not found');
  }

  // Find exams by this teacher
  const teacherExams = mockExams.filter(exam => exam.instructor === teacher.name);
  const teacherExamIds = teacherExams.map(exam => exam.id);

  // Find results for those exams
  const studentResults = mockResults.filter(result => teacherExamIds.includes(result.examId));

  // Get unique student IDs
  const studentIds = [...new Set(studentResults.map(result => result.userId))];

  // Get full user objects for the students and add stats
  const studentsWithStats = mockUsers
    .filter(user => studentIds.includes(user.id))
    .map(student => {
      const studentResults = mockResults.filter(r => r.userId === student.id && teacherExamIds.includes(r.examId));
      const completedExams = studentResults.length;
      const totalScore = studentResults.reduce((acc, r) => acc + r.percentage, 0);
      const averageScore = completedExams > 0 ? totalScore / completedExams : 0;
      return {
        ...student,
        completedExams,
        averageScore,
      };
    });

  res.json(studentsWithStats);
};

export const getStudentResultsForTeacher = (req: Request, res: Response) => {
  const { teacherId, studentId } = req.params;
  const teacher = mockUsers.find(u => u.id === teacherId);

  if (!teacher) {
    return res.status(404).send('Teacher not found');
  }

  // Find exams by this teacher
  const teacherExams = mockExams.filter(exam => exam.instructor === teacher.name);
  const teacherExamIds = teacherExams.map(exam => exam.id);

  const student = mockUsers.find(u => u.id === studentId);
  if (!student) {
    return res.status(404).send('Student not found');
  }

  // Find results for the student that are part of the teacher's exams
  const results = mockResults.filter(result =>
    result.userId === studentId && teacherExamIds.includes(result.examId)
  ).map(result => {
    // Enrich result with exam title
    const exam = teacherExams.find(e => e.id === result.examId);
    return { ...result, examTitle: exam?.title || 'N/A' };
  });

  res.json({ student, results });
};

export const getTeacherExams = (req: Request, res: Response) => {
  const { teacherId } = req.params;
  const teacher = mockUsers.find(u => u.id === teacherId);

  if (!teacher) {
    return res.status(404).send('Teacher not found');
  }

  const teacherExams = mockExams.filter(exam => exam.instructor === teacher.name);
  res.json(teacherExams);
};

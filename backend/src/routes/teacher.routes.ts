import express from 'express';
import { mockUsers, mockExams, mockResults } from '../data';

const router = express.Router();

// Get students for a specific teacher
router.get('/teacher/:teacherId/students', (req, res) => {
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

  // Get full user objects for the students
  const students = mockUsers.filter(user => studentIds.includes(user.id));

  res.json(students);
});

// Get results for a specific student of a specific teacher
router.get('/teacher/:teacherId/students/:studentId/results', (req, res) => {
  const { teacherId, studentId } = req.params;
  const teacher = mockUsers.find(u => u.id === teacherId);

  if (!teacher) {
    return res.status(404).send('Teacher not found');
  }

  // Find exams by this teacher
  const teacherExams = mockExams.filter(exam => exam.instructor === teacher.name);
  const teacherExamIds = teacherExams.map(exam => exam.id);

  // Find results for the student that are part of the teacher's exams
  const studentResults = mockResults.filter(result =>
    result.userId === studentId && teacherExamIds.includes(result.examId)
  ).map(result => {
    // Enrich result with exam title
    const exam = teacherExams.find(e => e.id === result.examId);
    return { ...result, examTitle: exam?.title || 'N/A' };
  });

  res.json(studentResults);
});

export default router;

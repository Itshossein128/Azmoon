import express from 'express';
import { getTeacherStudents, getStudentResultsForTeacher, getTeacherExams } from '../controllers/teacher.controller';

const router = express.Router();

// Get students for a specific teacher
router.get('/teacher/:teacherId/students', getTeacherStudents);

// Get results for a specific student of a specific teacher
router.get('/teacher/:teacherId/students/:studentId/results', getStudentResultsForTeacher);

// Get exams for a specific teacher
router.get('/teacher/:teacherId/exams', getTeacherExams);

export default router;

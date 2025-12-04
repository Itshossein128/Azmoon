import express from 'express';
import { mockExams, mockAllQuestions, mockUsers } from '../data';
import { Exam, Question } from '../../../shared/types';
import crypto from 'crypto';

const router = express.Router();

// Get all exams
router.get('/exams', (req, res) => {
  res.json(mockExams);
});

// Get exams for a specific teacher
router.get('/teacher/:teacherId/exams', (req, res) => {
  const { teacherId } = req.params;
  // In a real app, you'd check the user's ID against the exam's owner.
  // Here, we'll filter based on the instructor's name for simplicity.
  const teacher = mockUsers.find(u => u.id === teacherId);
  if (teacher) {
    const teacherExams = mockExams.filter(exam => exam.instructor === teacher.name);
    res.json(teacherExams);
  } else {
    res.status(404).send('Teacher not found');
  }
});

// Get exam by id
router.get('/exams/:id', (req, res) => {
    const exam = mockExams.find(e => e.id === req.params.id);
    if (exam) {
        res.json(exam);
    } else {
        res.status(404).send('Exam not found');
    }
});

// Create exam
router.post('/exams', (req, res) => {
    const { questions, teacherId, ...examData } = req.body;
    const questionIds = questions.map((q: Partial<Question>) => q.id);
    const fullQuestions = mockAllQuestions.filter(q => questionIds.includes(q.id));

    let instructorName = examData.instructor;
    if (teacherId) {
      const teacher = mockUsers.find(u => u.id === teacherId);
      if (teacher) {
        instructorName = teacher.name;
      }
    }

    const newExam: Exam = {
        id: crypto.randomUUID(),
        ...examData,
        instructor: instructorName,
        questions: fullQuestions,
        totalQuestions: fullQuestions.length,
    };
    mockExams.push(newExam);
    res.status(201).json(newExam);
});

// Update exam
router.put('/exams/:id', (req, res) => {
    const examIndex = mockExams.findIndex(e => e.id === req.params.id);
    if (examIndex !== -1) {
        const { questions, ...examData } = req.body;
        const questionIds = questions.map((q: Partial<Question>) => q.id);
        const fullQuestions = mockAllQuestions.filter(q => questionIds.includes(q.id));

        mockExams[examIndex] = {
            ...mockExams[examIndex],
            ...examData,
            questions: fullQuestions,
            totalQuestions: fullQuestions.length,
        };
        res.json(mockExams[examIndex]);
    } else {
        res.status(404).send('Exam not found');
    }
});

// Delete exam
router.delete('/exams/:id', (req, res) => {
    const examIndex = mockExams.findIndex(e => e.id === req.params.id);
    if (examIndex !== -1) {
        const deletedExam = mockExams.splice(examIndex, 1);
        res.json(deletedExam);
    } else {
        res.status(404).send('Exam not found');
    }
});

// Get questions for an exam
router.get('/exams/:id/questions', (req, res) => {
    const exam = mockExams.find(e => e.id === req.params.id);
    if (exam) {
        res.json(exam.questions);
    } else {
        res.status(404).send('Exam not found');
    }
});

// Add a question to an exam
router.post('/exams/:id/questions', (req, res) => {
    const exam = mockExams.find(e => e.id === req.params.id);
    if (exam) {
        const newQuestion: Question = {
            id: crypto.randomUUID(),
            examId: req.params.id,
            ...req.body
        };
        if (!exam.questions) {
            exam.questions = [];
        }
        exam.questions.push(newQuestion);
        res.status(201).json(newQuestion);
    } else {
        res.status(404).send('Exam not found');
    }
});

export default router;

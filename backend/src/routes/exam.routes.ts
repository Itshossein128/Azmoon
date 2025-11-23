import express from 'express';
import { mockExams, mockUsers } from '../data';
import { Exam, Question } from '../../../shared/types';

const router = express.Router();

// Get all exams
router.get('/exams', (req, res) => {
  res.json(mockExams);
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
    const newExam: Exam = {
        id: new Date().toISOString(),
        ...req.body
    };
    mockExams.push(newExam);
    res.status(201).json(newExam);
});

// Update exam
router.put('/exams/:id', (req, res) => {
    const examIndex = mockExams.findIndex(e => e.id === req.params.id);
    if (examIndex !== -1) {
        mockExams[examIndex] = { ...mockExams[examIndex], ...req.body };
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
            id: new Date().toISOString(),
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

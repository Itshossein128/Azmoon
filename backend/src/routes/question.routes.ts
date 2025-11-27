import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { mockAllQuestions } from '../data'; // Assuming mockAllQuestions is exported from data.ts
import { Question } from '../../../shared/types';
import crypto from 'crypto';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all questions
router.get('/questions', (req, res) => {
  res.json(mockAllQuestions);
});

// Create question
router.post('/questions', (req, res) => {
    const newQuestion: Question = {
        id: crypto.randomUUID(),
        ...req.body
    };
    mockAllQuestions.push(newQuestion);
    res.status(201).json(newQuestion);
});

// Update question
router.put('/questions/:id', (req, res) => {
    const questionIndex = mockAllQuestions.findIndex(q => q.id === req.params.id);
    if (questionIndex !== -1) {
        mockAllQuestions[questionIndex] = { ...mockAllQuestions[questionIndex], ...req.body };
        res.json(mockAllQuestions[questionIndex]);
    } else {
        res.status(404).send('Question not found');
    }
});

// Delete question
router.delete('/questions/:id', (req, res) => {
    const questionIndex = mockAllQuestions.findIndex(q => q.id === req.params.id);
    if (questionIndex !== -1) {
        const deletedQuestion = mockAllQuestions.splice(questionIndex, 1);
        res.json(deletedQuestion);
    } else {
        res.status(404).send('Question not found');
    }
});

// Bulk upload questions
router.post('/questions/upload', upload.single('questionFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // ... (rest of the upload logic)
    res.status(201).json({ message: `File processed.` });
});

export default router;

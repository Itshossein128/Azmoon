import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { mockAllQuestions } from '../data';
import { Question } from '../../../shared/types';
import crypto from 'crypto';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all questions
router.get('/questions', (req, res) => {
  res.json(mockAllQuestions);
});

// Get question by id
router.get('/questions/:id', (req, res) => {
    const question = mockAllQuestions.find(q => q.id === req.params.id);
    if (question) {
        res.json(question);
    } else {
        res.status(404).send('Question not found');
    }
});

// Bulk upload questions
router.post('/questions/upload', upload.single('questionFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const newQuestions: Question[] = [];
    const fileBuffer = req.file.buffer;
    const fileExtension = req.file.originalname.split('.').pop()?.toLowerCase();

    const processRow = (row: any) => {
        const options = [row.option1, row.option2, row.option3, row.option4].filter(Boolean);
        const correctAnswerIndex = parseInt(row.correctAnswer, 10);

        if (row.text && options.length === 4 && !isNaN(correctAnswerIndex)) {
            const newQuestion: Question = {
                id: crypto.randomUUID(),
                examId: '', // Questions from bank don't belong to a specific exam initially
                text: row.text,
                type: 'multiple-choice',
                points: parseInt(row.points, 10) || 1,
                options: options,
                correctAnswer: correctAnswerIndex,
            };
            newQuestions.push(newQuestion);
        }
    };

    if (fileExtension === 'csv') {
        const stream = Readable.from(fileBuffer);
        stream
            .pipe(csv())
            .on('data', (data) => processRow(data))
            .on('end', () => {
                mockAllQuestions.push(...newQuestions);
                res.status(201).json({ message: `${newQuestions.length} questions uploaded successfully.` });
            });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        jsonData.forEach(processRow);
        mockAllQuestions.push(...newQuestions);
        res.status(201).json({ message: `${newQuestions.length} questions uploaded successfully.` });
    } else {
        return res.status(400).send('Unsupported file format.');
    }
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

export default router;

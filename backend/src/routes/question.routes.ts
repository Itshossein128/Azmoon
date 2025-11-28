import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { mockAllQuestions } from '../data'; // Assuming mockAllQuestions is exported from data.ts
import { Question } from '../../../shared/types';
import crypto from 'crypto';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });


// Get all questions
router.get('/questions', (req, res) => {
  res.json(mockAllQuestions);
});

// Create question
router.post('/questions', upload.single('mediaFile'), (req, res) => {
    const questionData = { ...req.body };
    // Manually parse fields that we expect to be JSON
    ['options', 'prompts', 'correctAnswer', 'tags'].forEach(key => {
        if (questionData[key]) {
            try {
                questionData[key] = JSON.parse(questionData[key]);
            } catch {}
        }
    });

    // Ensure points is a number
    if (questionData.points) {
        questionData.points = parseInt(questionData.points, 10);
    }

    const newQuestion: Partial<Question> = {
        id: crypto.randomUUID(),
        ...questionData
    };

    if (req.file) {
        newQuestion.mediaUrl = `/uploads/${req.file.filename}`;
    }

    mockAllQuestions.push(newQuestion as Question);
    res.status(201).json(newQuestion);
});

// Update question
router.put('/questions/:id', upload.single('mediaFile'), (req, res) => {
    const questionIndex = mockAllQuestions.findIndex(q => q.id === req.params.id);
    if (questionIndex !== -1) {
        const questionData = { ...req.body };
        ['options', 'prompts', 'correctAnswer', 'tags'].forEach(key => {
            if (questionData[key]) {
                try {
                    questionData[key] = JSON.parse(questionData[key]);
                } catch {}
            }
        });

        // Ensure points is a number
        if (questionData.points) {
            questionData.points = parseInt(questionData.points, 10);
        }

        const updatedQuestion = { ...mockAllQuestions[questionIndex], ...questionData };

        if (req.file) {
            // Optional: delete old file if it exists
            const oldFilePath = mockAllQuestions[questionIndex].mediaUrl;
            if (oldFilePath) {
                fs.unlink(path.join(__dirname, '../..', oldFilePath), () => {});
            }
            updatedQuestion.mediaUrl = `/uploads/${req.file.filename}`;
        }

        mockAllQuestions[questionIndex] = updatedQuestion;
        res.json(updatedQuestion);
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

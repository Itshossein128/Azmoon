import express from 'express';
import multer from 'multer';
import { mockResults, mockExams } from '../data';
import { Result, Exam } from '../../../shared/types';
import crypto from 'crypto';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all results
router.get('/results', (req, res) => {
  res.json(mockResults);
});

// Get result by id
router.get('/results/:id', (req, res) => {
    const result = mockResults.find(r => r.id === req.params.id);
    if (result) {
        const exam = mockExams.find(e => e.id === result.examId);
        // Return both result and exam details
        res.json({ result, exam });
    } else {
        res.status(404).send('Result not found');
    }
});

// Get results for a user
router.get('/users/:userId/results', (req, res) => {
    const userResults = mockResults.filter(r => r.userId === req.params.userId);
    const resultsWithExamTitles = userResults.map(result => {
        const exam = mockExams.find(e => e.id === result.examId);
        return {
            ...result,
            examTitle: exam ? exam.title : 'آزمون حذف شده'
        };
    });
    res.json(resultsWithExamTitles);
});

// Create a new result and calculate score on the server
router.post('/results', upload.any(), (req, res) => {
    const { examId, userId, timeLeft } = req.body;
    const answers = JSON.parse(req.body.answers);
    const exam = mockExams.find(e => e.id === examId);

    if (!exam) {
        return res.status(404).send('Exam not found');
    }

    // Here you could also process req.files to save them
    // For now, we just acknowledge them.

    let score = 0;
    let correctAnswers = 0;
    exam.questions.forEach(q => {
        const userAnswer = answers[q.id];
        const correctAnswer = q.correctAnswer;

        if (userAnswer === undefined) return;

        let isCorrect = false;
        if (q.type === 'multiple-answer') {
            if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
                const sortedUserAnswer = [...userAnswer].sort();
                const sortedCorrectAnswer = [...correctAnswer].sort();
                if (JSON.stringify(sortedUserAnswer) === JSON.stringify(sortedCorrectAnswer)) {
                    isCorrect = true;
                }
            }
        } else if (q.type === 'fill-in-the-blank') {
            if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
                if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
                    isCorrect = true;
                }
            }
        } else { // multiple-choice, true-false, etc.
            if (userAnswer === correctAnswer) {
                isCorrect = true;
            }
        }

        if (isCorrect) {
            score += q.points;
            correctAnswers++;
        }
    });

    const totalPossibleScore = exam.questions.reduce((total, q) => total + q.points, 0);
    const percentage = totalPossibleScore > 0 ? (score / totalPossibleScore) * 100 : 0;
    const passed = percentage >= exam.passingScore;
    const timeSpent = exam.duration - Math.floor(timeLeft / 60);

    const newResult: Result = {
        id: crypto.randomUUID(),
        examId,
        userId,
        score,
        totalScore: totalPossibleScore,
        percentage,
        passed,
        completedAt: new Date().toLocaleDateString('fa-IR'),
        timeSpent,
        answers: Object.values(answers),
        correctAnswers,
    };

    mockResults.push(newResult);
    res.status(201).json(newResult);
});

export default router;

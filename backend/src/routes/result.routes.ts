import express from 'express';
import { mockResults, mockExams } from '../data';
import { Result, Exam } from '../../../shared/types';
import crypto from 'crypto';

const router = express.Router();

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
router.post('/results', (req, res) => {
    const { examId, userId, answers, timeLeft } = req.body;
    const exam = mockExams.find(e => e.id === examId);

    if (!exam) {
        return res.status(404).send('Exam not found');
    }

    let score = 0;
    let correctAnswers = 0;
    exam.questions.forEach(q => {
        if (answers[q.id] === q.correctAnswer) {
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

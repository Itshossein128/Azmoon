import express from 'express';
import multer from 'multer';
import { mockResults, mockExams, mockUsers } from '../data';
import { Result, Exam } from '../../../shared/types';
import crypto from 'crypto';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all results
router.get('/results', (req, res) => {
  res.json(mockResults);
});

// Get pending results for grading
router.get('/results/pending', (req, res) => {
    const pendingResults = mockResults.filter(r => r.status === 'pending_review');
    const detailedResults = pendingResults.map(result => {
        const exam = mockExams.find(e => e.id === result.examId);
        const user = mockUsers.find(u => u.id === result.userId);
        return {
            ...result,
            examTitle: exam ? exam.title : 'N/A',
            userName: user ? user.name : 'N/A',
        };
    });
    res.json(detailedResults);
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

    const hasEssayQuestion = exam.questions.some(q => q.type === 'essay-with-upload' || q.type === 'essay');

    if (hasEssayQuestion) {
        // Just save the result for review, no scoring
        const newResult: Result = {
            id: crypto.randomUUID(),
            examId,
            userId,
            status: 'pending_review',
            completedAt: new Date().toLocaleDateString('fa-IR'),
            timeSpent: exam.duration - Math.floor(timeLeft / 60),
            answers: answers, // Storing raw answers for manual review
        };
        mockResults.push(newResult);
        return res.status(201).json(newResult);
    }

    // --- Automatic Scoring for exams without essays ---
    let score = 0;
    let correctAnswers = 0;
    exam.questions.forEach(q => {
        const userAnswer = answers[q.id];
        const correctAnswer = q.correctAnswer;

        if (userAnswer === undefined) return;

        let isCorrect = false;
        // (scoring logic remains the same as before)
        if (q.type === 'multiple-answer') {
            if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
                if (JSON.stringify([...userAnswer].sort()) === JSON.stringify([...correctAnswer].sort())) isCorrect = true;
            }
        } else if (q.type === 'fill-in-the-blank') {
            if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
                if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) isCorrect = true;
            }
        } else {
            if (userAnswer === correctAnswer) isCorrect = true;
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
        status: 'graded',
        score,
        totalScore: totalPossibleScore,
        percentage,
        passed,
        completedAt: new Date().toLocaleDateString('fa-IR'),
        timeSpent,
        answers: answers,
        correctAnswers,
    };

    mockResults.push(newResult);
    res.status(201).json(newResult);
});

// Grade a submission
router.post('/results/:id/grade', (req, res) => {
    const { id } = req.params;
    const { essayScores } = req.body;

    const resultIndex = mockResults.findIndex(r => r.id === id);
    if (resultIndex === -1) {
        return res.status(404).send('Result not found');
    }

    const result = mockResults[resultIndex];
    const exam = mockExams.find(e => e.id === result.examId);
    if (!exam) {
        return res.status(404).send('Exam not found');
    }

    // Calculate auto-graded score (non-essay questions)
    let autoScore = 0;
    let correctAnswersCount = 0;
    exam.questions.forEach(q => {
        if (q.type !== 'essay-with-upload' && q.type !== 'essay') {
            // Re-run scoring logic for non-essay questions
            const userAnswer = result.answers[q.id];
            const correctAnswer = q.correctAnswer;
            let isCorrect = false;
            if (q.type === 'multiple-answer' && Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
                if (JSON.stringify([...userAnswer].sort()) === JSON.stringify([...correctAnswer].sort())) isCorrect = true;
            } else if (q.type === 'fill-in-the-blank' && typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
                if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) isCorrect = true;
            } else if (userAnswer === correctAnswer) {
                isCorrect = true;
            }
            if (isCorrect) {
                autoScore += q.points;
                correctAnswersCount++;
            }
        }
    });

    // Add manual scores from essay questions
    let manualScore = 0;
    for(const questionId in essayScores) {
        manualScore += essayScores[questionId];
    }

    const finalScore = autoScore + manualScore;
    const totalPossibleScore = exam.questions.reduce((total, q) => total + q.points, 0);
    const percentage = totalPossibleScore > 0 ? (finalScore / totalPossibleScore) * 100 : 0;
    const passed = percentage >= exam.passingScore;

    // Update the result
    mockResults[resultIndex] = {
        ...result,
        score: finalScore,
        totalScore: totalPossibleScore,
        percentage,
        passed,
        correctAnswers: correctAnswersCount, // Note: This only counts auto-graded questions
        status: 'graded',
    };

    res.status(200).json(mockResults[resultIndex]);
});

export default router;

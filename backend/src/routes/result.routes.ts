import express from 'express';
import multer from 'multer';
import { mockResults, mockExams, mockUsers } from '../data';
import { Result, Exam, Question } from '../../../shared/types';
import crypto from 'crypto';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// A temporary directory for user code files
const codeDir = path.join(__dirname, '../../code_results');
if (!fs.existsSync(codeDir)) {
    fs.mkdirSync(codeDir, { recursive: true });
}

const runCodeInSandbox = (filePath: string, language: string, testInput: string): Promise<{ output: string; error?: string }> => {
    return new Promise((resolve) => {
        const command = language === 'javascript' ? 'node' : 'python';
        const child = spawn(command, [filePath]);
        let output = '';
        let error = '';
        const timeout = 5000; // 5 seconds

        const timer = setTimeout(() => {
            child.kill();
            error = 'Execution timed out.';
            resolve({ output, error });
        }, timeout);

        child.stdin.write(testInput);
        child.stdin.end();

        child.stdout.on('data', (data) => {
            output += data.toString();
        });

        child.stderr.on('data', (data) => {
            error += data.toString();
        });

        child.on('close', () => {
            clearTimeout(timer);
            resolve({ output: output.trim(), error: error.trim() });
        });
    });
};


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
        const user = mockUsers.find(u => u.id === result.userId);
        // Return result, exam, and user details
        res.json({ result, exam, user: { name: user?.name || 'کاربر ناشناس' } });
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
router.post('/results', upload.any(), async (req, res) => {
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
    for (const q of exam.questions) {
        const userAnswer = answers[q.id];
        const correctAnswer = q.correctAnswer;

        if (userAnswer === undefined) continue;

        let isCorrect = false;

        if (q.type === 'coding') {
            const fileExtension = q.language === 'javascript' ? '.js' : '.py';
            const fileName = `${crypto.randomUUID()}${fileExtension}`;
            const filePath = path.join(codeDir, fileName);
            let passedCount = 0;

            try {
                fs.writeFileSync(filePath, userAnswer as string);
                for (const tc of (q.testCases || [])) {
                    const { output, error } = await runCodeInSandbox(filePath, q.language || 'javascript', tc.input);
                    if (!error && output === tc.expectedOutput.trim()) {
                        passedCount++;
                    }
                }
            } finally {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }

            if (passedCount > 0) {
                score += (passedCount / (q.testCases?.length || 1)) * q.points;
            }
            if (passedCount === (q.testCases?.length || 0)) {
                isCorrect = true;
            }
        } else if (q.type === 'multiple-answer') {
            if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
                if (JSON.stringify([...userAnswer].sort()) === JSON.stringify([...correctAnswer].sort())) isCorrect = true;
            }
        } else if (q.type === 'matching') {
            if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
                if (JSON.stringify(userAnswer) === JSON.stringify(correctAnswer)) isCorrect = true;
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
    const { gradedAnswers } = req.body; // Expects { "questionId": { "score": number, "isCorrect": boolean } }

    const resultIndex = mockResults.findIndex(r => r.id === id);
    if (resultIndex === -1) {
        return res.status(404).send('Result not found');
    }

    const result = mockResults[resultIndex];
    const exam = mockExams.find(e => e.id === result.examId);
    if (!exam) {
        return res.status(404).send('Exam not found');
    }

    let autoScore = 0;
    let autoCorrectCount = 0;

    // Ensure answers is an array before processing
    if (!Array.isArray(result.answers)) {
        result.answers = [];
    }

    // Process auto-graded questions first
    result.answers.forEach(answer => {
        const question = exam.questions.find(q => q.id === answer.questionId);
        if (!question || question.type === 'essay' || question.type === 'essay-with-upload') {
            return;
        }
        if (answer.isCorrect) {
            autoScore += question.points;
            autoCorrectCount++;
        }
    });

    let manualScore = 0;
    let manualCorrectCount = 0;

    // Process manually graded answers
    for (const questionId in gradedAnswers) {
        const gradedAnswer = gradedAnswers[questionId];
        manualScore += gradedAnswer.score;
        if (gradedAnswer.isCorrect) {
            manualCorrectCount++;
        }

        // Update the isCorrect status and score in the original answers array
        const answerIndex = result.answers.findIndex(a => a.questionId === questionId);
        if (answerIndex !== -1) {
            result.answers[answerIndex].isCorrect = gradedAnswer.isCorrect;
            result.answers[answerIndex].score = gradedAnswer.score;
        } else {
            // If the user didn't answer this essay question, add it to the answers array now
            result.answers.push({
                questionId,
                answer: '', // No text answer was provided
                isCorrect: gradedAnswer.isCorrect,
                score: gradedAnswer.score,
                points: exam.questions.find(q => q.id === questionId)?.points || 0
            });
        }
    }

    const finalScore = autoScore + manualScore;
    const totalCorrect = autoCorrectCount + manualCorrectCount;
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
        correctAnswers: totalCorrect,
        status: 'graded',
        answers: result.answers, // Persist the updated answers
    };

    res.status(200).json(mockResults[resultIndex]);
});

export default router;

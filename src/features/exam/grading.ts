import { Exam, Question, Result, User } from '../../../shared/types';

export function calculateResult(exam: Exam, user: User, answers: { [key: string]: number }, timeLeft: number): Result {
  let score = 0;
  let correctAnswers = 0;
  const userAnswers: number[] = [];

  exam.questions.forEach((q: Question) => {
    const answerIndex = answers[q.id];
    userAnswers.push(answerIndex);
    if (answerIndex !== undefined && answerIndex === q.correctAnswer) {
      score += q.points;
      correctAnswers++;
    }
  });

  const totalScore = exam.questions.reduce((acc: number, q: Question) => acc + q.points, 0);
  const percentage = Math.round((score / totalScore) * 100);
  const passed = percentage >= exam.passingScore;

  const newResult: Result = {
    id: new Date().toISOString(),
    examId: exam.id,
    userId: user.id,
    score,
    totalScore,
    percentage,
    passed,
    completedAt: new Date().toISOString(),
    timeSpent: Math.floor((exam.duration * 60 - timeLeft) / 60),
    answers: userAnswers,
    correctAnswers,
  };

  return newResult;
}

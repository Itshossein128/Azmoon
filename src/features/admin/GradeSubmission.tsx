import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Result, Exam, Question, User } from '../../../shared/types';
import { API_URL } from '../../config/api';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

interface GradedAnswer {
    score: number;
    isCorrect: boolean;
}

export default function GradeSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<{ result: Result; exam: Exam; user: Partial<User> } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gradedAnswers, setGradedAnswers] = useState<{ [questionId: string]: GradedAnswer }>({});

  const essayQuestions = submission?.exam.questions.filter(q => q.type === 'essay-with-upload' || q.type === 'essay') || [];

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/results/${id}`);
        setSubmission(response.data);
        setError(null);
      } catch (err) {
        setError('خطا در دریافت اطلاعات آزمون');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchSubmission();
    }
  }, [id]);

  useEffect(() => {
      if (submission) {
          const initialGrades = essayQuestions.reduce((acc, q) => {
              const answer = submission.result.answers.find(a => a.questionId === q.id);
              acc[q.id] = {
                  score: answer?.score ?? 0,
                  isCorrect: answer?.isCorrect ?? false,
              };
              return acc;
          }, {} as { [questionId: string]: GradedAnswer });
          setGradedAnswers(initialGrades);
      }
  }, [submission]);

  const handleGradeChange = (questionId: string, scoreStr: string, isCorrect: boolean) => {
      const score = Math.max(0, Math.min(Number(scoreStr), essayQuestions.find(q => q.id === questionId)?.points || 0));
      setGradedAnswers(prev => ({
          ...prev,
          [questionId]: { score: isCorrect ? score : 0, isCorrect }
      }));
  };

  const handleSubmitGrades = async (e: FormEvent) => {
    e.preventDefault();
    try {
        const toastId = toast.loading('در حال ثبت نمرات...');
        await axios.post(`${API_URL}/results/${id}/grade`, { gradedAnswers });
        toast.success('نمرات با موفقیت ثبت شد', { id: toastId });
        navigate('/admin/grading');
    } catch(err) {
        toast.error('خطا در ثبت نمرات');
        console.error(err);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert message={error} type="error" />;
  if (!submission) return <Alert message="اطلاعات آزمون یافت نشد" type="info" />;

  const { result, exam, user } = submission;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">تصحیح آزمون: {exam.title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">کاربر: {user?.name || result.userId}</p>

      <form onSubmit={handleSubmitGrades} className="space-y-8">
        {essayQuestions.map((q) => {
          const answer = result.answers.find(a => a.questionId === q.id);
          const currentGrade = gradedAnswers[q.id] || { score: 0, isCorrect: false };
          return (
            <div key={q.id} className="border-t pt-6">
              <h3 className="text-lg font-semibold">{q.text} (حداکثر {q.points} نمره)</h3>
              {q.gradingCriteria && <p className="text-sm text-gray-500 mt-1 mb-4">معیارهای ارزیابی: {q.gradingCriteria}</p>}

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mt-4">
                <p className="font-semibold mb-2">پاسخ کاربر:</p>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{typeof answer?.answer === 'string' ? answer.answer : 'پاسخ متنی ثبت نشده است.'}</p>
                {/* File download link needs implementation */}
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2">
                    <Input
                        label="نمره"
                        type="number"
                        max={q.points}
                        min={0}
                        value={currentGrade.score}
                        onChange={(e) => handleGradeChange(q.id, e.target.value, currentGrade.isCorrect)}
                        disabled={!currentGrade.isCorrect}
                        required
                    />
                </div>
                <div className="flex items-center pt-6">
                    <input
                        type="checkbox"
                        id={`isCorrect-${q.id}`}
                        checked={currentGrade.isCorrect}
                        onChange={(e) => handleGradeChange(q.id, String(currentGrade.score), e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor={`isCorrect-${q.id}`} className="mr-3 block text-md text-gray-900 dark:text-gray-300">
                        پاسخ صحیح است
                    </label>
                </div>
              </div>
            </div>
          );
        })}
        <div className="flex justify-end pt-6 border-t">
            <Button type="submit">ثبت نهایی نمرات</Button>
        </div>
      </form>
    </div>
  );
}

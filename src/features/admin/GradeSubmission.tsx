import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Result, Exam, Question } from '../../../shared/types';
import { API_URL } from '../../config/api';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function GradeSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<{ result: Result; exam: Exam } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scores, setScores] = useState<{ [questionId: string]: number }>({});

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

  const handleScoreChange = (questionId: string, score: string) => {
      setScores(prev => ({...prev, [questionId]: Number(score)}));
  }

  const handleSubmitGrades = async (e: FormEvent) => {
    e.preventDefault();
    try {
        const toastId = toast.loading('در حال ثبت نمرات...');
        // This is the new endpoint we will create
        await axios.post(`${API_URL}/results/${id}/grade`, { essayScores: scores });
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

  const { result, exam } = submission;
  const essayQuestions = exam.questions.filter(q => q.type === 'essay-with-upload' || q.type === 'essay');

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">تصحیح آزمون: {exam.title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">کاربر: {result.userId /* Placeholder, will be replaced with actual user name */}</p>

      <form onSubmit={handleSubmitGrades} className="space-y-8">
        {essayQuestions.map((q) => {
          const answer = result.answers[q.id] as { text: string; file?: any } | undefined;
          return (
            <div key={q.id} className="border-t pt-6">
              <h3 className="text-lg font-semibold">{q.text} (حداکثر {q.points} نمره)</h3>
              {q.gradingCriteria && <p className="text-sm text-gray-500 mt-1 mb-4">معیارهای ارزیابی: {q.gradingCriteria}</p>}

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mt-4">
                <p className="font-semibold mb-2">پاسخ کاربر:</p>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{answer?.text || 'پاسخ متنی ثبت نشده است.'}</p>
                {answer?.file && <a href={answer.file.path /* Placeholder */} className="text-primary-500 mt-2 block">دانلود فایل ضمیمه</a>}
              </div>

              <div className="mt-4">
                <Input
                    label="نمره"
                    type="number"
                    max={q.points}
                    min={0}
                    value={scores[q.id] || ''}
                    onChange={(e) => handleScoreChange(q.id, e.target.value)}
                    required
                />
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

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Exam, Result } from '../../../shared/types';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import { API_URL } from '../../config/api';

export default function ResultDetail() {
  const { id } = useParams(); // This is the result ID
  const [exam, setExam] = useState<Exam | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResultData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/results/${id}`);
        const { result: resultData, exam: examData } = response.data;

        setResult(resultData);
        setExam(examData);

        setError(null);
      } catch (err) {
        setError('خطا در دریافت نتایج آزمون');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResultData();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <Alert message={error} type="error" />;
  if (!exam || !result) return <Alert message="نتیجه آزمون یافت نشد" type="error" />;

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">نتیجه آزمون: {exam.title}</h1>
                <p className={`text-2xl font-semibold ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
                    {result.passed ? 'تبریک! شما قبول شدید.' : 'متاسفانه شما رد شدید.'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-center">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <p className="text-lg text-gray-500 dark:text-gray-400">نمره شما</p>
                    <p className="text-4xl font-bold text-primary-500">{result.score} / {result.totalScore}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <p className="text-lg text-gray-500 dark:text-gray-400">درصد</p>
                    <p className="text-4xl font-bold text-primary-500">{result.percentage}%</p>
                </div>
            </div>

            <div className="border-t dark:border-gray-700 pt-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">جزئیات</h3>
                <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="font-semibold">تعداد سوالات صحیح:</span>
                        <span>{result.correctAnswers} از {exam.questions.length}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="font-semibold">زمان صرف شده:</span>
                        <span>{result.timeSpent} دقیقه</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="font-semibold">تاریخ تکمیل:</span>
                        <span>{result.completedAt}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

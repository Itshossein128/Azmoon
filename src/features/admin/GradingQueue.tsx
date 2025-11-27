import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Result } from '../../../shared/types';
import { API_URL } from '../../config/api';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';

// We need to extend Result to include user/exam info that we'll fetch
interface PendingSubmission extends Result {
  examTitle: string;
  userName: string;
}

export default function GradingQueue() {
  const [submissions, setSubmissions] = useState<PendingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingSubmissions = async () => {
      try {
        setLoading(true);
        // This is a new endpoint we need to create
        const response = await axios.get(`${API_URL}/results/pending`);
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError('خطا در دریافت لیست آزمون‌های نیازمند تصحیح');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingSubmissions();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">آزمون‌های نیازمند تصحیح</h1>

      {submissions.length === 0 ? (
        <p className="text-center text-gray-500 py-8">هیچ آزمونی برای تصحیح وجود ندارد.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-4 font-semibold">عنوان آزمون</th>
                <th className="p-4 font-semibold">نام کاربر</th>
                <th className="p-4 font-semibold">تاریخ ارسال</th>
                <th className="p-4 font-semibold">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="p-4">{sub.examTitle}</td>
                  <td className="p-4">{sub.userName}</td>
                  <td className="p-4">{sub.completedAt}</td>
                  <td className="p-4">
                    <Link to={`/admin/grading/${sub.id}`}>
                      <button className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 font-semibold">
                        شروع تصحیح
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import api from '../../config/api';
import { useUserStore } from '../../store/userStore';
import { Result, User } from '../../../shared/types';

interface StudentResult extends Result {
  examTitle: string;
}

export default function TeacherStudentResults() {
  const { studentId } = useParams<{ studentId: string }>();
  const [results, setResults] = useState<StudentResult[]>([]);
  const [student, setStudent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: teacher } = useUserStore();

  useEffect(() => {
    const fetchResults = async () => {
      if (!teacher?.id || !studentId) return;
      try {
        setLoading(true);
        // The API should ideally return both student info and their results
        const response = await api.get(`/api/teacher/${teacher.id}/students/${studentId}/results`);
        setResults(response.data.results);
        setStudent(response.data.student); // Assuming API returns student info
        setError(null);
      } catch (err) {
        setError('خطا در دریافت نتایج دانشجو.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [teacher, studentId]);

  return (
    <div className="p-6 sm:p-8">
      <Link to="/teacher/students" className="flex items-center gap-2 text-primary-600 hover:text-primary-800 mb-6">
        <ArrowLeft size={20} />
        بازگشت به لیست دانشجویان
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        نتایج آزمون‌های: {loading ? '...' : student?.name || 'دانشجوی ناشناس'}
      </h1>

      {loading ? (
        <div className="text-center py-10">در حال بارگذاری نتایج...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 flex items-center justify-center gap-2">
          <AlertCircle />
          {error}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-4 font-semibold">عنوان آزمون</th>
                <th className="p-4 font-semibold text-center">تاریخ تکمیل</th>
                <th className="p-4 font-semibold text-center">نمره</th>
                <th className="p-4 font-semibold text-center">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((result) => (
                  <tr key={result.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="p-4">{result.examTitle}</td>
                    <td className="p-4 text-center">{new Date(result.completedAt).toLocaleDateString('fa-IR')}</td>
                    <td className="p-4 text-center font-bold">{result.percentage}%</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        result.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {result.passed ? 'قبول' : 'مردود'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-500">
                    هیچ نتیجه‌ای برای این دانشجو یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

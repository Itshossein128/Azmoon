import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Result } from '../../../shared/types';
import useUserStore from '../../store/userStore';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import { Eye, AlertCircle } from 'lucide-react';
import api from '@/config/api';

export default function TeacherStudentResults() {
    const { studentId } = useParams<{ studentId: string }>();
    const { user } = useUserStore();
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!user) {
                setError('ابتدا باید وارد شوید.');
                setLoading(false);
                return;
            }
            if (!studentId) {
                setError('شناسه دانشجو نامعتبر است.');
                setLoading(false);
                return;
            }

            try {
                const response = await api.get<Result[]>(`/api/teacher/${user.id}/students/${studentId}/results`);
                setResults(response.data);
            } catch (err) {
                setError('خطا در دریافت نتایج آزمون‌ها.');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [user, studentId]);

    if (loading) return <Spinner />;
    if (error) return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
        <AlertCircle size={48} className="mb-4" />
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">نتایج آزمون‌های دانشجو</h1>

            {results.length === 0 ? (
                <Alert message="این دانشجو در هیچ یک از آزمون‌های شما شرکت نکرده است." type="info" />
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">نام آزمون</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">تاریخ</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">نمره</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">وضعیت</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">مشاهده جزئیات</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {results.map((result) => (
                                <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{result.examTitle}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{result.completedAt}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                      {result.score !== undefined ? `${result.score} / ${result.totalScore}`: 'در انتظار تصحیح'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            result.status === 'pending_review' ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200' :
                                            result.passed ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                                        }`}>
                                            {result.status === 'pending_review' ? 'در انتظار تصحیح' : result.passed ? 'قبول' : 'مردود'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link to={`/results/${result.id}`} className="text-primary-500 hover:text-primary-600 flex items-center">
                                            <Eye className="ml-2" size={18} />
                                            مشاهده جزئیات
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

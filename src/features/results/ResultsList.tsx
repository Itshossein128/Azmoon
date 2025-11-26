
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Result } from '../../../shared/types';
import { useUserStore } from '../../store/userStore';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import { API_URL } from '../../config/api';
import { Eye } from 'lucide-react';

export default function ResultsList() {
    const user = useUserStore(state => state.user);
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!user) {
                setError("برای مشاهده نتایج، لطفا ابتدا وارد شوید.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/users/${user.id}/results`);
                setResults(response.data);
                setError(null);
            } catch (err) {
                setError('خطا در دریافت لیست نتایج');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [user]);

    if (loading) return <Spinner />;
    if (error) return <Alert message={error} type="error" />;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">نتایج آزمون‌های من</h1>

            {results.length === 0 ? (
                <Alert message="شما هنوز در هیچ آزمونی شرکت نکرده‌اید." type="info" />
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{result.score} / {result.totalScore}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            result.passed
                                            ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                                            : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                                        }`}>
                                            {result.passed ? 'قبول' : 'مردود'}
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

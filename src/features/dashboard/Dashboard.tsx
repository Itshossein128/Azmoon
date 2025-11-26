import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BarChart, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Exam, Result } from '../../../shared/types';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import { API_URL } from '../../config/api';

export default function Dashboard() {
    const [recentExams, setRecentExams] = useState<Exam[]>([]);
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            setLoading(true);
            const [examsResponse, resultsResponse] = await Promise.all([
                axios.get(`${API_URL}/exams?_limit=3`),
                axios.get(`${API_URL}/results`)
            ]);
            setRecentExams(examsResponse.data);
            setResults(resultsResponse.data);
            setError(null);
        } catch (err) {
            setError('خطا در دریافت اطلاعات داشبورد');
            console.error(err);
        } finally {
            setLoading(false);
        }
        };
        fetchData();
    }, []);

    const totalExamsTaken = results.length;
    const passedExams = results.filter(r => r.passed).length;
    const failedExams = totalExamsTaken - passedExams;

    if (loading) return <Spinner />;
    if (error) return <Alert message={error} type="error" />;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">داشبورد</h1>

            {/* Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<BarChart />} title="آزمون های شرکت کرده" value={totalExamsTaken} color="blue" />
                <StatCard icon={<CheckCircle />} title="آزمون های موفق" value={passedExams} color="green" />
                <StatCard icon={<XCircle />} title="آزمون های ناموفق" value={failedExams} color="red" />
                <StatCard icon={<Clock />} title="میانگین زمان پاسخگویی" value="۴۵ دقیقه" color="yellow" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Results */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">نتایج اخیر</h2>
                    <div className="space-y-4">
                        {results.map(result => {
                            const exam = recentExams.find(e => e.id === result.examId);
                            return (
                                <div key={result.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-white">{exam?.title || 'آزمون حذف شده'}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{result.completedAt}</p>
                                    </div>
                                    <div className={`font-bold ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
                                        {result.percentage}% - {result.passed ? 'موفق' : 'ناموفق'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recommended Exams */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">آزمون های پیشنهادی</h2>
                    <div className="space-y-4">
                        {recentExams.map(exam => (
                            <Link to={`/exams/${exam.id}`} key={exam.id} className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <p className="font-semibold text-gray-800 dark:text-white">{exam.title}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{exam.category}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: string | number, color: string }) {
    const colors = {
        blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300',
        green: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300',
        red: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300',
        yellow: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-300',
    };
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center gap-6">
            <div className={`w-16 h-16 flex items-center justify-center rounded-full ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
            </div>
        </div>
    );
}

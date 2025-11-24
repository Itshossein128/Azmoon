import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Exam } from '../../../shared/types';
import { mockCategories } from '../../data/mockData';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import { API_URL } from '../../config/api';

export default function Home() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExams = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/exams?_limit=4`);
            setExams(response.data);
            setError(null);
        } catch (err) {
            setError('خطا در دریافت آزمون‌ها');
            console.error(err);
        } finally {
            setLoading(false);
        }
        };
        fetchExams();
    }, []);

    return (
        <div className="space-y-16 py-12">
            {/* Hero Section */}
            <div className="container mx-auto text-center px-4">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 dark:text-white mb-4">
                    پلتفرم آزمون آنلاین
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                    دانش خود را با طیف گسترده ای از آزمون ها در موضوعات مختلف بسنجید و برای موفقیت آماده شوید.
                </p>
                <div className="flex justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link to="/exams">مشاهده همه آزمون ها</Link>
                    </Button>
                    <Button size="lg" variant="secondary" asChild>
                        <Link to="/about">درباره ما</Link>
                    </Button>
                </div>
            </div>

            {/* Featured Exams Section */}
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">آزمون های پیشنهادی</h2>
                    <Link to="/exams" className="flex items-center text-primary-500 hover:text-primary-600">
                        <span>مشاهده همه</span>
                        <ArrowLeft className="mr-2" />
                    </Link>
                </div>
                {loading && <Spinner />}
                {error && <Alert message={error} type="error" />}
                {!loading && !error && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {exams.map((exam) => (
                            <div key={exam.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
                                <Link to={`/exams/${exam.id}`} className="block">
                                    <img src={exam.imageUrl} alt={exam.title} className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <p className="text-sm font-semibold text-primary-500 mb-2">{exam.category}</p>
                                        <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-primary-500 transition-colors truncate">{exam.title}</h3>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Categories Section */}
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">دسته بندی ها</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {mockCategories.map((category) => (
                        <Link to={`/exams?category=${category.name}`} key={category.id} className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all">
                            <div className="text-4xl mb-3">{category.icon}</div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">{category.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} آزمون</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

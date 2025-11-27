import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Exam, Question, QuestionType } from '../../../shared/types';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import { API_URL } from '../../config/api';
import { PlayCircle } from 'lucide-react';

export default function ExamDetail() {
    const { id } = useParams();
    const [exam, setExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExam = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/exams/${id}`);
            setExam(response.data);
            setError(null);
        } catch (err) {
            setError('خطا در دریافت اطلاعات آزمون');
            console.error(err);
        } finally {
            setLoading(false);
        }
        };
        if (id) {
        fetchExam();
        }
    }, [id]);

    if (loading) return <Spinner />;
    if (error) return <Alert message={error} type="error" />;
    if (!exam) return <Alert message="آزمون یافت نشد" type="error" />;

const questionTypeCounts = (exam.questions || []).reduce((acc, question) => {
    acc[question.type] = (acc[question.type] || 0) + 1;
    return acc;
}, {} as Record<QuestionType, number>);

const questionTypeTranslations: Record<QuestionType, string> = {
    'multiple-choice': 'چند گزینه‌ای',
    'multiple-answer': 'چند جوابی',
    'fill-in-the-blank': 'جای خالی',
    'essay': 'تشریحی',
    'essay-with-upload': 'تشریحی با آپلود فایل',
    'true-false': 'صحیح/غلط',
};


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <img className="h-full w-full object-cover md:w-80" src={exam.imageUrl} alt={exam.title} />
                    </div>
                    <div className="p-8 flex-grow flex flex-col">
                        <div className="uppercase tracking-wide text-sm text-primary-500 font-semibold">{exam.category}</div>
                        <h1 className="block mt-1 text-3xl leading-tight font-extrabold text-black dark:text-white">{exam.title}</h1>
                        <p className="mt-4 text-gray-500 dark:text-gray-300 flex-grow">{exam.description}</p>

                        <div className="mt-6">
                            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">جزئیات آزمون</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <DetailItem label="سطح" value={exam.level} />
                                <DetailItem label="مدت زمان" value={`${exam.duration} دقیقه`} />
                            <DetailItem label="مجموع سوالات" value={`${exam.questions.length} سوال`} />
                                <DetailItem label="نمره قبولی" value={`${exam.passingScore}%`} />
                                <DetailItem label="مدرس" value={exam.instructor} />
                                <DetailItem label="قیمت" value={exam.price === 0 ? 'رایگان' : `${exam.price.toLocaleString()} تومان`} />
                            </div>
                        </div>

                    {Object.keys(questionTypeCounts).length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">انواع سوالات</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {Object.entries(questionTypeCounts).map(([type, count]) => (
                                    <DetailItem
                                        key={type}
                                        label={questionTypeTranslations[type as QuestionType]}
                                        value={`${count} سوال`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}


                        <div className="mt-8 pt-8 border-t dark:border-gray-700">
                           <Link to={`/exams/take/${exam.id}`} className="block">
                             <Button size="lg" className="w-full text-lg py-4 px-8 flex items-center justify-center bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl rounded-full">
                                <PlayCircle className="ml-3" size={28} />
                                <span className="font-bold tracking-wider">شروع آزمون</span>
                             </Button>
                           </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value }: { label: string, value: string | number }) {
    return (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">{value}</p>
        </div>
    );
}

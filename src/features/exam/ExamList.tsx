import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Clock, BookOpen, Users, Star, ChevronDown } from 'lucide-react';
import { mockCategories } from '../../data/mockData';
import { Exam } from '../../../shared/types';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';

const API_URL = 'http://localhost:3000/api';

export default function ExamList() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
    }
  }, [query]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/exams`);
        setExams(response.data);
        setError(null);
      } catch (err) {
        setError('خطا در دریافت لیست آزمون‌ها');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Spinner />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">کاوش در آزمون‌ها</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">آزمون متناسب با نیازهای خود را برای موفقیت پیدا کنید.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="search" className="sr-only">جستجوی آزمون...</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="search"
                type="text"
                placeholder="جستجوی آزمون بر اساس عنوان..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="filter" className="sr-only">فیلتر</label>
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select id="filter" className="w-full appearance-none pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>همه دسته بندی ها</option>
              {mockCategories.map(category => (
                <option key={category.id}>{category.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Exam Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredExams.map((exam) => (
          <div key={exam.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
            <Link to={`/exams/${exam.id}`} className="block">
              <div className="relative">
                <img src={exam.imageUrl} alt={exam.title} className="w-full h-48 object-cover" />
                <div className={`absolute top-4 right-4 px-3 py-1 text-sm font-semibold text-white rounded-full ${exam.level === 'آسان' ? 'bg-green-500' : exam.level === 'متوسط' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                  {exam.level}
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm font-semibold text-primary-500 mb-2">{exam.category}</p>
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-primary-500 transition-colors">{exam.title}</h3>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                  <span className="flex items-center gap-2"><Clock size={16} /> {exam.duration} دقیقه</span>
                  <span className="flex items-center gap-2"><BookOpen size={16} /> {exam.totalQuestions} سوال</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                  <span className="flex items-center gap-2"><Users size={16} /> {exam.participants} شرکت کننده</span>
                  <span className="flex items-center gap-1"><Star size={16} className="text-yellow-400" /> {exam.rating}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

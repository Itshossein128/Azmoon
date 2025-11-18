import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, BookOpen, Users, Star, ChevronDown } from 'lucide-react';
import { getExams } from '../../services/api';
import { Exam } from '../../types';

export default function ExamList() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [selectedLevel, setSelectedLevel] = useState('همه');
  const [sortBy, setSortBy] = useState('محبوبیت');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getExams();
        setExams(data);
      } catch {
        setError('Failed to fetch exams.');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const filteredExams = exams.filter((exam: Exam) => {
    const matchesSearch = exam.title.includes(searchTerm) || exam.description.includes(searchTerm);
    const matchesCategory = selectedCategory === 'همه' || exam.category === selectedCategory;
    const matchesLevel = selectedLevel === 'همه' || exam.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const sortedExams = [...filteredExams].sort((a, b) => {
    switch (sortBy) {
      case 'محبوبیت':
        return b.participants - a.participants;
      case 'امتیاز':
        return b.rating - a.rating;
      case 'جدیدترین':
        return new Date(b.startDate || '').getTime() - new Date(a.startDate || '').getTime();
      case 'قیمت':
        return a.price - b.price;
      default:
        return 0;
    }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">آزمون‌های آنلاین</h1>
          <p className="text-primary-100 text-lg">بیش از {exams.length} آزمون متنوع در دسته‌بندی‌های مختلف</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="جستجوی آزمون..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>فیلترها</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className="hidden lg:flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="همه">همه دسته‌ها</option>
                {/* Add categories from API if available */}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="همه">همه سطوح</option>
                <option value="آسان">آسان</option>
                <option value="متوسط">متوسط</option>
                <option value="سخت">سخت</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="محبوبیت">محبوب‌ترین</option>
                <option value="امتیاز">بهترین امتیاز</option>
                <option value="جدیدترین">جدیدترین</option>
                <option value="قیمت">ارزان‌ترین</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t space-y-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="همه">همه دسته‌ها</option>
                {/* Add categories from API if available */}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="همه">همه سطوح</option>
                <option value="آسان">آسان</option>
                <option value="متوسط">متوسط</option>
                <option value="سخت">سخت</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="محبوبیت">محبوب‌ترین</option>
                <option value="امتیاز">بهترین امتیاز</option>
                <option value="جدیدترین">جدیدترین</option>
                <option value="قیمت">ارزان‌ترین</option>
              </select>
            </div>
          )}
        </div>

        <div className="mb-6 text-gray-600">
          <p>نمایش {sortedExams.length} آزمون</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedExams.map((exam) => (
            <Link
              key={exam.id}
              to={`/exams/${exam.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden card-hover"
            >
              <div className="relative h-48">
                <img
                  src={exam.imageUrl}
                  alt={exam.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-bold text-primary-600">
                  {exam.level}
                </div>
                {exam.price === 0 ? (
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    رایگان
                  </div>
                ) : (
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {exam.price.toLocaleString('fa-IR')} تومان
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="text-sm text-gray-500 mb-2">{exam.category}</div>
                <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 h-12">
                  {exam.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {exam.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{exam.duration} دقیقه</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{exam.totalQuestions} سوال</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-gray-800">{exam.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{exam.participants.toLocaleString('fa-IR')}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {sortedExams.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">آزمونی یافت نشد</h3>
            <p className="text-gray-600">لطفا فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید</p>
          </div>
        )}
      </div>
    </div>
  );
}

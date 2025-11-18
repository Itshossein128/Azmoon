import { Link } from 'react-router-dom';
import { BookOpen, Trophy, Users, Clock, Star, TrendingUp, CheckCircle, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getExams } from '../../services/api';
import { Exam, Category } from '../../types';

export default function Home() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getExams();
        setExams(data);
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const featuredExams = exams.slice(0, 4);
  const stats = [
    { icon: Users, label: 'دانشجویان فعال', value: '۱۵,۰۰۰+' },
    { icon: BookOpen, label: 'آزمون‌های متنوع', value: '۱,۲۰۰+' },
    { icon: Trophy, label: 'گواهینامه صادر شده', value: '۸,۵۰۰+' },
    { icon: Star, label: 'رضایت کاربران', value: '۴.۸/۵' }
  ];

  const features = [
    {
      icon: Clock,
      title: 'دسترسی ۲۴ ساعته',
      description: 'در هر زمان و از هر مکانی به آزمون‌ها دسترسی داشته باشید'
    },
    {
      icon: Award,
      title: 'گواهینامه معتبر',
      description: 'دریافت گواهینامه دیجیتال پس از قبولی در آزمون'
    },
    {
      icon: TrendingUp,
      title: 'پیشرفت تحصیلی',
      description: 'رصد پیشرفت و نمایش آمار دقیق عملکرد شما'
    },
    {
      icon: CheckCircle,
      title: 'نتایج فوری',
      description: 'دریافت نتایج آزمون بلافاصله پس از اتمام'
    }
  ];

  const categories: Category[] = [
    { id: '1', name: 'زبان انگلیسی', count: 50, icon: '🇬🇧' },
    { id: '2', name: 'برنامه‌نویسی', count: 35, icon: '💻' },
    { id: '3', name: 'ریاضیات', count: 42, icon: '📊' },
    { id: '4', name: 'علوم تجربی', count: 28, icon: '🔬' },
    { id: '5', name: 'تاریخ و جغرافیا', count: 18, icon: '🌍' },
    { id: '6', name: 'هنر و موسیقی', count: 22, icon: '🎨' },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-gray-50">
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              سامانه آزمون آنلاین
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed">
              بهترین پلتفرم برای برگزاری و شرکت در آزمون‌های آنلاین
            </p>
            <p className="text-lg mb-10 text-primary-200 leading-relaxed">
              با استفاده از جدیدترین تکنولوژی‌ها، تجربه‌ای منحصربه‌فرد از آزمون آنلاین را تجربه کنید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/exams"
                className="px-8 py-4 bg-white text-primary-700 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
              >
                مشاهده آزمون‌ها
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-primary-700 transition-all hover:scale-105"
              >
                ثبت‌نام رایگان
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">دسته‌بندی آزمون‌ها</h2>
            <p className="text-gray-600 text-lg">آزمون مورد نظر خود را انتخاب کنید</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/exams?category=${category.name}`}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 text-center"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} آزمون</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">آزمون‌های پیشنهادی</h2>
            <p className="text-gray-600 text-lg">محبوب‌ترین آزمون‌ها را امتحان کنید</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredExams.map((exam) => (
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
                  {exam.price === 0 && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      رایگان
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="text-sm text-gray-500 mb-2">{exam.category}</div>
                  <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 h-12">
                    {exam.title}
                  </h3>

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

          <div className="text-center mt-10">
            <Link
              to="/exams"
              className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors"
            >
              مشاهده همه آزمون‌ها
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">مزایای سامانه</h2>
            <p className="text-gray-600 text-lg">چرا سامانه آزمون آنلاین را انتخاب کنیم؟</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">آماده شروع هستید؟</h2>
          <p className="text-xl mb-8 text-primary-100">همین حالا ثبت‌نام کنید و آزمون اول خود را شروع کنید</p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-white text-primary-700 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
          >
            ثبت‌نام رایگان
          </Link>
        </div>
      </section>
    </div>
  );
}

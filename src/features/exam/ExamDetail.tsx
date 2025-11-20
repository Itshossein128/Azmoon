import { Link, useParams } from 'react-router-dom';
import { Clock, BookOpen, Users, Star, Award, TrendingUp, CheckCircle, Calendar, User as UserIcon } from 'lucide-react';
import { mockExams } from '../../data/mockData';

export default function ExamDetail() {
  const { id } = useParams<{ id: string }>();
  const exam = mockExams.find(e => e.id === id);

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">آزمون یافت نشد</h2>
          <Link to="/exams" className="text-primary-600 hover:text-primary-700">
            بازگشت به لیست آزمون‌ها
          </Link>
        </div>
      </div>
    );
  }

  const examInfo = [
    { icon: Clock, label: 'مدت زمان', value: `${exam.duration} دقیقه` },
    { icon: BookOpen, label: 'تعداد سوالات', value: exam.totalQuestions },
    { icon: TrendingUp, label: 'نمره قبولی', value: `${exam.passingScore}%` },
    { icon: Award, label: 'سطح دشواری', value: exam.level }
  ];

  const benefits = [
    'دریافت گواهینامه معتبر پس از قبولی',
    'دسترسی به پاسخ‌های تشریحی سوالات',
    'امکان بازبینی پاسخ‌ها قبل از ثبت نهایی',
    'نمایش نتایج و آمار دقیق عملکرد',
    'پشتیبانی ۲۴ ساعته'
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm mb-4">
                {exam.category}
              </div>
              <h1 className="text-4xl font-bold mb-4 leading-tight">{exam.title}</h1>
              <p className="text-primary-100 text-lg mb-6 leading-relaxed">{exam.description}</p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-xl">{exam.rating}</span>
                  <span className="text-primary-200">امتیاز</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{exam.participants.toLocaleString('fa-IR')} شرکت‌کننده</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-primary-100 mb-6">
                <UserIcon className="w-5 h-5" />
                <span>مدرس: {exam.instructor}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {exam.tags.map((tag, index) => (
                  <span key={index} className="bg-white/10 px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src={exam.imageUrl}
                alt={exam.title}
                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
              />
              {exam.price === 0 && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                  رایگان
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">اطلاعات آزمون</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {examInfo.map((info, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <info.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{info.label}</p>
                      <p className="font-bold text-gray-800 dark:text-gray-100">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {exam.startDate && exam.endDate && (
                <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/50 rounded-lg flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <div className="text-sm">
                    <span className="font-bold text-gray-800 dark:text-gray-100">دوره برگزاری: </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {new Date(exam.startDate).toLocaleDateString('fa-IR')} تا {new Date(exam.endDate).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">مزایا و ویژگی‌ها</h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">درباره این آزمون</h2>
              <div className="prose max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                <p>
                  {exam.description}
                </p>
                <p>
                  این آزمون شامل {exam.totalQuestions} سوال است که در مدت زمان {exam.duration} دقیقه باید به آن‌ها پاسخ دهید.
                  برای قبولی در این آزمون نیاز به کسب حداقل {exam.passingScore} درصد نمره دارید.
                </p>
                <p>
                  سطح دشواری این آزمون <strong>{exam.level}</strong> است و تاکنون {exam.participants.toLocaleString('fa-IR')} نفر
                  در آن شرکت کرده‌اند.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
              <div className="text-center mb-6">
                {exam.price === 0 ? (
                  <div>
                    <p className="text-3xl font-bold text-green-600 mb-2">رایگان</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">بدون نیاز به پرداخت</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                      {exam.price.toLocaleString('fa-IR')} تومان
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">قیمت شرکت در آزمون</p>
                  </div>
                )}
              </div>

              <Link
                to={`/exam-take/${exam.id}`}
                className="block w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center font-bold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all hover:scale-105 shadow-lg mb-4"
              >
                شروع آزمون
              </Link>

              <button className="block w-full py-3 border-2 border-primary-600 text-primary-600 text-center font-bold rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/50 transition-colors">
                افزودن به علاقه‌مندی‌ها
              </button>

              <div className="mt-6 pt-6 border-t dark:border-gray-700 space-y-4">
                <h3 className="font-bold text-gray-800 dark:text-gray-100">این آزمون شامل:</h3>
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{exam.totalQuestions} سوال تستی</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>گواهینامه معتبر</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>دسترسی مادام‌العمر به نتایج</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>پشتیبانی آنلاین</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

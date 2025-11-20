import { Link } from 'react-router-dom';
import { Trophy, TrendingUp, Calendar, Clock, CheckCircle, XCircle, Award, Download, Share2 } from 'lucide-react';
import { mockResults, mockExams } from '../../data/mockData';

export default function Results() {
  const results = mockResults.map(result => ({
    ...result,
    exam: mockExams.find(e => e.id === result.examId)
  }));

  const totalExams = results.length;
  const passedExams = results.filter(r => r.passed).length;
  const averageScore = results.reduce((acc, r) => acc + r.percentage, 0) / (totalExams || 1);

  const stats = [
    { icon: Trophy, label: 'آزمون‌های شرکت شده', value: totalExams, color: 'bg-blue-100 text-blue-600' },
    { icon: CheckCircle, label: 'قبولی‌ها', value: passedExams, color: 'bg-green-100 text-green-600' },
    { icon: XCircle, label: 'ردی‌ها', value: totalExams - passedExams, color: 'bg-red-100 text-red-600' },
    { icon: TrendingUp, label: 'میانگین نمرات', value: `${averageScore.toFixed(1)}%`, color: 'bg-purple-100 text-purple-600' }
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">نتایج آزمون‌ها</h1>
          <p className="text-primary-100 text-lg">مشاهده عملکرد و پیشرفت تحصیلی شما</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.color} rounded-lg mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{stat.value}</h3>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">نمودار پیشرفت</h2>
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100">
              <option>۳۰ روز اخیر</option>
              <option>۶۰ روز اخیر</option>
              <option>۹۰ روز اخیر</option>
              <option>همه زمان‌ها</option>
            </select>
          </div>

          <div className="h-64 flex items-end justify-between gap-4">
            {results.slice(0, 7).map((result, index) => {
              const height = (result.percentage / 100) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg relative" style={{ height: '200px' }}>
                    <div
                      className={`absolute bottom-0 w-full rounded-t-lg transition-all ${
                        result.passed ? 'bg-gradient-to-t from-green-500 to-green-400' : 'bg-gradient-to-t from-red-500 to-red-400'
                      }`}
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                        {result.percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                    {new Date(result.completedAt).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">تاریخچه آزمون‌ها</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                همه
              </button>
              <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                قبولی‌ها
              </button>
              <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                ردی‌ها
              </button>
            </div>
          </div>

          {results.map((result) => (
            <div key={result.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                          {result.exam?.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(result.completedAt).toLocaleDateString('fa-IR')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{result.timeSpent} دقیقه</span>
                          </div>
                        </div>
                      </div>

                      <div className={`px-4 py-2 rounded-full font-bold ${
                        result.passed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {result.passed ? 'قبول' : 'رد'}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>نمره کسب شده</span>
                        <span className="font-bold text-gray-800 dark:text-gray-100">
                          {result.score} از {result.totalScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            result.passed
                              ? 'bg-gradient-to-r from-green-500 to-green-600'
                              : 'bg-gradient-to-r from-red-500 to-red-600'
                          }`}
                          style={{ width: `${result.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-left mt-1">
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{result.percentage}%</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/results/${result.id}`}
                        state={{ result, exam: result.exam }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Award className="w-4 h-4" />
                        <span>مشاهده جزئیات</span>
                      </Link>

                      {result.passed && (
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <Download className="w-4 h-4" />
                          <span>دانلود گواهینامه</span>
                        </button>
                      )}

                      <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>اشتراک‌گذاری</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {results.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">هنوز آزمونی نداده‌اید</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">برای مشاهده نتایج، ابتدا در یک آزمون شرکت کنید</p>
            <Link
              to="/exams"
              className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors"
            >
              مشاهده آزمون‌ها
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

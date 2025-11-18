import { Link } from 'react-router-dom';
import { BookOpen, Trophy, Clock, Star, Target, Award, Calendar, ChevronLeft } from 'lucide-react';
import { mockExams, mockResults } from '../../data/mockData';
import { useUserStore } from '../../store/userStore';

export default function Dashboard() {
  const { user } = useUserStore();

  const recentExams = mockExams.slice(0, 3);
  const recentResults = mockResults.slice(0, 3).map((r) => ({
    ...r,
    exam: mockExams.find((e) => e.id === r.examId),
  }));

  const stats = [
    { icon: BookOpen, label: 'آزمون‌های شرکت شده', value: mockResults.length, color: 'from-blue-500 to-blue-600' },
    { icon: Trophy, label: 'گواهینامه‌های دریافتی', value: mockResults.filter(r => r.passed).length, color: 'from-green-500 to-green-600' },
    { icon: Star, label: 'میانگین نمرات', value: `${Math.round(mockResults.reduce((acc, r) => acc + r.percentage, 0) / mockResults.length) || 0}%`, color: 'from-yellow-500 to-yellow-600' },
    { icon: Target, label: 'امتیاز کلی', value: '۱,۲۵۰', color: 'from-purple-500 to-purple-600' }
  ];

  const upcomingExams = [
    { id: '1', title: 'آزمون زبان انگلیسی', date: '۱۴۰۳/۰۲/۲۵', time: '۱۰:۰۰' },
    { id: '2', title: 'آزمون برنامه‌نویسی پایتون', date: '۱۴۰۳/۰۲/۲۸', time: '۱۴:۳۰' }
  ];

  const achievements = [
    { id: '1', title: 'قهرمان آزمون', description: 'قبولی در ۱۰ آزمون متوالی', icon: '🏆', unlocked: true },
    { id: '2', title: 'دانشجوی نمونه', description: 'کسب نمره بالای ۹۰٪', icon: '⭐', unlocked: true },
    { id: '3', title: 'سریع و دقیق', description: 'پاسخ به تمام سوالات در کمتر از نصف زمان', icon: '⚡', unlocked: false },
    { id: '4', title: 'استاد زبان', description: 'قبولی در ۵ آزمون زبان', icon: '🌐', unlocked: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200'}
              alt={user?.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <div className="text-center md:text-right">
              <h1 className="text-4xl font-bold mb-2">{user?.name}</h1>
              <p className="text-primary-100 mb-2">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">پیشرفت این ماه</h2>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>این ماه</option>
                <option>ماه گذشته</option>
                <option>۳ ماه اخیر</option>
              </select>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">آزمون‌های تکمیل شده</span>
                  <span className="font-bold text-gray-800">۴ از ۶</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full" style={{ width: '66%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">میانگین نمره</span>
                  <span className="font-bold text-gray-800">۸۵٪</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">ساعت مطالعه</span>
                  <span className="font-bold text-gray-800">۱۸ ساعت</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">آزمون‌های آینده</h2>
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <h3 className="font-bold text-gray-800 mb-2">{exam.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>{exam.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{exam.time}</span>
                  </div>
                </div>
              ))}

              <Link
                to="/exams"
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
              >
                <span>مشاهده همه آزمون‌ها</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">آزمون‌های اخیر</h2>
              <Link to="/results" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
                <span>مشاهده همه</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{result.exam?.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(result.completedAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                  <div className="text-left">
                    <div className={`text-2xl font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {result.percentage}%
                    </div>
                    <div className={`text-xs font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {result.passed ? 'قبول' : 'رد'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">آزمون‌های پیشنهادی</h2>
            </div>

            <div className="space-y-4">
              {recentExams.map((exam) => (
                <Link
                  key={exam.id}
                  to={`/exams/${exam.id}`}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <img
                    src={exam.imageUrl}
                    alt={exam.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{exam.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{exam.duration}د</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{exam.rating}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">دستاوردها و جوایز</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-6 rounded-xl border-2 text-center transition-all ${
                  achievement.unlocked
                    ? 'border-primary-300 bg-primary-50 hover:shadow-lg'
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className="text-5xl mb-3">{achievement.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                {achievement.unlocked && (
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                      <Award className="w-3 h-3" />
                      <span>باز شده</span>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

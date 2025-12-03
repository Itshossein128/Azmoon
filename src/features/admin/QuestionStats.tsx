import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

// Mock data directly in the component
const mockQuestionStats = [
  { id: '1', text: 'کدام یک از موارد زیر یک فعل کمکی در زبان انگلیسی است؟', correctPercentage: 88, totalAnswers: 150 },
  { id: '2', text: 'جمله "She ___ to school every day" با کدام فعل کامل می‌شود؟', correctPercentage: 95, totalAnswers: 148 },
  { id: '3', text: 'کلمه "Beautiful" چه نوع کلمه‌ای است؟', correctPercentage: 92, totalAnswers: 145 },
  { id: 'm1', text: 'مشتق تابع f(x) = x^2 چیست؟', correctPercentage: 65, totalAnswers: 98 },
  { id: 'm3', text: 'کدام یک از موارد زیر جزو اعداد اول هستند؟', correctPercentage: 55, totalAnswers: 95 },
  { id: 'p2', text: 'خروجی کد `print(len("hello"))` چیست؟', correctPercentage: 98, totalAnswers: 210 },
  { id: 'p4', text: 'برای چاپ کردن یک متن در پایتون از دستور ____ استفاده می‌شود.', correctPercentage: 80, totalAnswers: 205 },
];

interface QuestionStat {
  id: string;
  text: string;
  correctPercentage: number;
  totalAnswers: number;
}

export default function QuestionStats() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStats = useMemo(() =>
    mockQuestionStats.filter(stat =>
      stat.text.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]);

  const getBarColor = (percentage: number) => {
    if (percentage > 75) return 'bg-green-500';
    if (percentage > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">آمار تفکیکی سوالات</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="جستجوی سوال..."
            className="pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">متن سوال</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 w-48 text-center">درصد پاسخ صحیح</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">تعداد پاسخ‌ها</th>
              </tr>
            </thead>
            <tbody>
              {filteredStats.map((stat, index) => (
                <tr key={stat.id} className={`border-b dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
                  <td className="p-4 text-gray-800 dark:text-gray-200">{stat.text}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full ${getBarColor(stat.correctPercentage)}`}
                          style={{ width: `${stat.correctPercentage}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{stat.correctPercentage}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-center font-mono text-gray-600 dark:text-gray-400">{stat.totalAnswers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

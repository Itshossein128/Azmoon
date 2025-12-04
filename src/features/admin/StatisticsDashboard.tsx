import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/config/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, CheckCircle } from 'lucide-react';

const StatCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center gap-6">
    <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded-full">
      {icon}
    </div>
    <div>
      <h3 className="text-gray-500 dark:text-gray-400 font-semibold">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  </div>
);

export default function StatisticsDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalExams: 0, totalCompletedExams: 0, examPerformance: [] });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/stats`);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">آمار پیشرفته</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="تعداد کاربران" value={stats.totalUsers.toString()} icon={<Users className="w-8 h-8 text-primary-600" />} />
        <StatCard title="تعداد آزمون‌ها" value={stats.totalExams.toString()} icon={<BookOpen className="w-8 h-8 text-primary-600" />} />
        <StatCard title="آزمون‌های تکمیل شده" value={stats.totalCompletedExams.toString()} icon={<CheckCircle className="w-8 h-8 text-primary-600" />} />
      </div>

      <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">عملکرد کلی آزمون‌ها</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.examPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="پاسخ صحیح" fill="#82ca9d" />
            <Bar dataKey="پاسخ غلط" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

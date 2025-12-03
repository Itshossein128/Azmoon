import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '@/config/api';
import Spinner from '@/components/ui/Spinner';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

// Define types for the data
interface PerformanceData {
  studentName: string;
  categories: { category: string; score: number; total: number; average: number }[];
  overallScore: number;
  completedExams: number;
  strengths: string[];
  weaknesses: string[];
}

interface ProgressData {
  date: string;
  score: number;
}

export default function StudentPerformanceReport() {
  const { userId } = useParams<{ userId: string }>();
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [performanceRes, progressRes] = await Promise.all([
          axios.get(`${API_URL}/stats/student/${userId}`),
          axios.get(`${API_URL}/stats/student/${userId}/progress`)
        ]);
        setPerformanceData(performanceRes.data);
        setProgressData(progressRes.data);
      } catch (err) {
        setError('Failed to fetch student performance data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Spinner /></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!performanceData) {
    return <div className="text-center">No performance data found for this student.</div>;
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">گزارش عملکرد دانشجو</h1>
        <p className="text-xl text-primary-600 dark:text-primary-400 font-semibold">{performanceData.studentName}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-white">عملکرد بر اساس دسته‌بندی</h2>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData.categories}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name={performanceData.studentName} dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.7} />
              <Radar name="میانگین کلاس" dataKey="average" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.5} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Side Panel */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-700 dark:text-white">خلاصه عملکرد</h3>
            <div className="space-y-3">
              <p className="flex justify-between">
                <span className="font-semibold text-gray-600 dark:text-gray-300">نمره کل:</span>
                <span className="font-bold text-lg text-primary-600 dark:text-primary-400">{performanceData.overallScore}%</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-gray-600 dark:text-gray-300">آزمون‌های تکمیل شده:</span>
                <span className="font-bold text-lg">{performanceData.completedExams}</span>
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">نقاط قوت</h3>
            <ul className="list-disc list-inside space-y-2">
              {performanceData.strengths.map((strength, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-200">{strength}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">نقاط ضعف</h3>
            <ul className="list-disc list-inside space-y-2">
              {performanceData.weaknesses.map((weakness, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-200">{weakness}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-white">نمودار پیشرفت در طول زمان</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" name="نمره" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

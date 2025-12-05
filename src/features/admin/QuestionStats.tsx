import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/config/api';
import { Search, Download } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface QuestionStat {
  id: string;
  text: string;
  correctPercentage: number;
  totalAnswers: number;
}

export default function QuestionStats() {
  const [stats, setStats] = useState<QuestionStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/stats/questions`);
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch question statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStats = useMemo(() =>
    stats.filter(stat =>
      stat.text.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, stats]);

  const getBarColor = (percentage: number) => {
    if (percentage > 75) return 'bg-green-500';
    if (percentage > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) return <div className="flex h-full items-center justify-center"><Spinner /></div>;
  if (error) return <Alert message={error} type="error" />;

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredStats.map(stat => ({
      "متن سوال": stat.text,
      "درصد پاسخ صحیح": stat.correctPercentage,
      "تعداد پاسخ‌ها": stat.totalAnswers,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "آمار سوالات");
    XLSX.writeFile(wb, "question_stats.xlsx");
  };

  const handleExportPdf = async () => {
    const { vazirFontBase64 } = await import('@/assets/fonts/vazir-font');
    const doc = new jsPDF();
    doc.addFileToVFS("Vazirmatn-Regular.ttf", vazirFontBase64);
    doc.addFont("Vazirmatn-Regular.ttf", "Vazirmatn", "normal");
    doc.setFont("Vazirmatn");

    doc.text("آمار تفکیکی سوالات", 14, 16);
    (doc as any).autoTable({
      startY: 22,
      styles: { font: "Vazirmatn", halign: 'right' },
      head: [['متن سوال', 'درصد پاسخ صحیح', 'تعداد پاسخ‌ها']],
      body: filteredStats.map(stat => [stat.text, `${stat.correctPercentage}%`, stat.totalAnswers]),
    });
    doc.save("question_stats.pdf");
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">آمار تفکیکی سوالات</h1>
        <div className="flex items-center gap-4">
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
          <Button onClick={handleExportExcel} variant="secondary" className="flex items-center gap-2">
            <Download size={18} />
            Excel
          </Button>
          <Button onClick={handleExportPdf} variant="secondary" className="flex items-center gap-2">
            <Download size={18} />
            PDF
          </Button>
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

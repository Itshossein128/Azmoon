import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/config/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Download } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { vazirFontBase64 } from '@/assets/fonts/vazir-font';

const StatCard = ({ title, value, icon, format = true }: { title: string; value: number; icon: React.ReactNode; format?: boolean }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center gap-6">
    <div className="bg-primary-100 dark:bg-primary-900/50 p-4 rounded-full">
      {icon}
    </div>
    <div>
      <h3 className="text-gray-500 dark:text-gray-400 font-semibold">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 dark:text-white">
        {format ? value.toLocaleString('fa-IR') : value}
        {format && <span className="text-lg font-normal"> تومان</span>}
      </p>
    </div>
  </div>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function FinancialReport() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/stats/financial`);
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch financial data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center"><Spinner /></div>;
  if (error) return <Alert message={error} type="error" />;
  if (!data) return <Alert message="No financial data available." type="info" />;

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws_data = [
      ["گزارش مالی"],
      [],
      ["درآمد کل", data.totalRevenue],
      ["درآمد ماهانه", data.monthlyRevenue],
      ["اشتراک‌های جدید", data.newSubscriptions],
      [],
      ["پرفروش‌ترین آزمون‌ها"],
      ["عنوان", "تعداد فروش", "درآمد"],
      ...data.topSellingExams.map(e => [e.title, e.sales, e.revenue]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, "گزارش مالی");
    XLSX.writeFile(wb, "financial_report.xlsx");
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.addFileToVFS("Vazirmatn-Regular.ttf", vazirFontBase64);
    doc.addFont("Vazirmatn-Regular.ttf", "Vazirmatn", "normal");
    doc.setFont("Vazirmatn");

    doc.text("گزارش مالی", 14, 16);
    (doc as any).autoTable({
      startY: 22,
      styles: { font: "Vazirmatn", halign: 'right' },
      head: [['عنوان', 'مقدار']],
      body: [
        ["درآمد کل", data.totalRevenue.toLocaleString('fa-IR')],
        ["درآمد ماهانه", data.monthlyRevenue.toLocaleString('fa-IR')],
        ["اشتراک‌های جدید", data.newSubscriptions],
      ],
    });
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['عنوان آزمون', 'تعداد فروش', 'درآمد']],
      body: data.topSellingExams.map(e => [e.title, e.sales, e.revenue.toLocaleString('fa-IR')]),
    });
    doc.save("financial_report.pdf");
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">گزارش مالی</h1>
        <div className="flex gap-2">
          <Button onClick={handleExportExcel} variant="secondary" className="flex items-center gap-2">
            <Download size={18} />
            خروجی Excel
          </Button>
          <Button onClick={handleExportPdf} variant="secondary" className="flex items-center gap-2">
            <Download size={18} />
            خروجی PDF
          </Button>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <StatCard title="درآمد کل" value={data.totalRevenue} icon={<DollarSign className="w-8 h-8 text-primary-600" />} />
        <StatCard title="درآمد این ماه" value={data.monthlyRevenue} icon={<TrendingUp className="w-8 h-8 text-primary-600" />} />
        <StatCard title="اشتراک‌های جدید (ماهانه)" value={data.newSubscriptions} icon={<Users className="w-8 h-8 text-primary-600" />} format={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-white">روند درآمد ماهانه</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toLocaleString('fa-IR')} M`} />
              <Tooltip formatter={(value: number) => [value.toLocaleString('fa-IR'), 'درآمد']} />
              <Legend />
              <Line type="monotone" dataKey="revenue" name="درآمد" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-white">تفکیک درآمد</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.revenueBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.revenueBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toLocaleString('fa-IR')} تومان`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Selling Exams Table */}
      <div className="mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-white p-6">پرفروش‌ترین آزمون‌ها</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">عنوان آزمون</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">تعداد فروش</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">درآمد (تومان)</th>
              </tr>
            </thead>
            <tbody>
              {data.topSellingExams.map((exam, index) => (
                <tr key={exam.id} className={`border-b dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
                  <td className="p-4 text-gray-800 dark:text-gray-200">{exam.title}</td>
                  <td className="p-4 text-center font-mono">{exam.sales}</td>
                  <td className="p-4 text-center font-mono text-green-600 dark:text-green-400">{exam.revenue.toLocaleString('fa-IR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

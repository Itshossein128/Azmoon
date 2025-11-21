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

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">داشبورد ادمین</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="تعداد کاربران" value="۱۵,۰۰۰" icon={<Users className="w-8 h-8 text-primary-600" />} />
        <StatCard title="تعداد آزمون‌ها" value="۱,۲۰۰" icon={<BookOpen className="w-8 h-8 text-primary-600" />} />
        <StatCard title="آزمون‌های تکمیل شده" value="۸,۵۰۰" icon={<CheckCircle className="w-8 h-8 text-primary-600" />} />
      </div>

      <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">فعالیت‌های اخیر</h2>
        <p className="text-gray-600 dark:text-gray-400">
          در این بخش، لیستی از آخرین فعالیت‌های کاربران و آزمون‌ها نمایش داده خواهد شد.
        </p>
      </div>
    </div>
  );
}

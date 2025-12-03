import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, Folder, Database, FileCheck, Percent, BarChart, FileBarChart, AreaChart } from 'lucide-react';
import Header from '../../components/layout/Header';

const navItems = [
  { name: 'داشبورد', to: '/admin', icon: LayoutDashboard },
  { name: 'آمار پیشرفته', to: '/admin/statistics', icon: BarChart },
  { name: 'آمار سوالات', to: '/admin/question-stats', icon: FileBarChart },
  { name: 'گزارش مالی', to: '/admin/financial-report', icon: AreaChart },
  { name: 'مدیریت کاربران', to: '/admin/users', icon: Users },
  { name: 'مدیریت آزمون‌ها', to: '/admin/exams', icon: FileText },
  { name: 'بانک سوالات', to: '/admin/questions', icon: Database },
  { name: 'تصحیح آزمون‌ها', to: '/admin/grading', icon: FileCheck },
  { name: 'مدیریت دسته‌بندی‌ها', to: '/admin/categories', icon: Folder },
  { name: 'کدهای تخفیف', to: '/admin/discounts', icon: Percent },
  { name: 'تنظیمات', to: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-500">پنل ادمین</h1>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-300 border-r-4 border-primary-500' : ''
                }`
              }
            >
              <item.icon className="mr-3" size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

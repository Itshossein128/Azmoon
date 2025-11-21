import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings } from 'lucide-react';

const SidebarLink = ({ to, icon, children }: { to: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-primary-600 text-white'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
      }`
    }
  >
    {icon}
    <span className="font-semibold">{children}</span>
  </NavLink>
);

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white">پنل ادمین</span>
        </div>

        <nav className="space-y-3">
          <SidebarLink to="/admin" icon={<LayoutDashboard className="w-5 h-5" />}>
            داشبورد
          </SidebarLink>
          <SidebarLink to="/admin/users" icon={<Users className="w-5 h-5" />}>
            مدیریت کاربران
          </SidebarLink>
          <SidebarLink to="/admin/exams" icon={<BookOpen className="w-5 h-5" />}>
            مدیریت آزمون‌ها
          </SidebarLink>
          <SidebarLink to="/admin/settings" icon={<Settings className="w-5 h-5" />}>
            تنظیمات
          </SidebarLink>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

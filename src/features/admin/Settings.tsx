import { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Switch from '../../components/ui/Switch';

const SettingsCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{title}</h2>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export default function Settings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [siteName, setSiteName] = useState('سامانه آزمون آنلاین');
  const [adminEmail, setAdminEmail] = useState('admin@example.com');
  const [userRegistration, setUserRegistration] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the settings to a backend
    alert('تنظیمات ذخیره شد!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">تنظیمات</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SettingsCard title="تنظیمات عمومی">
            <Input
              label="نام وب‌سایت"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
            <Input
              label="ایمیل ادمین"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />
          </SettingsCard>

          <SettingsCard title="تنظیمات امنیتی و دسترسی">
            <Switch
              label="فعال‌سازی حالت تعمیر و نگهداری"
              enabled={maintenanceMode}
              onChange={setMaintenanceMode}
            />
            <Switch
              label="اجازه ثبت‌نام کاربران جدید"
              enabled={userRegistration}
              onChange={setUserRegistration}
            />
          </SettingsCard>
        </div>

        <div className="mt-8 flex justify-end">
          <Button type="submit">
            ذخیره تغییرات
          </Button>
        </div>
      </form>
    </div>
  );
}

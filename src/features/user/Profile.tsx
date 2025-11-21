import { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { User, Edit, Shield } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useUserStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({ ...user, name, email });
      setFeedback({ type: 'success', message: 'اطلاعات با موفقیت به‌روزرسانی شد.' });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'رمز عبور جدید و تکرار آن یکسان نیستند.' });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }
    setFeedback({ type: 'success', message: 'رمز عبور با موفقیت تغییر کرد.' });
    // Reset fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">پروفایل کاربری</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-primary-600 dark:text-primary-300" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user?.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setActiveTab('personal')}
                className={`w-full text-right px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  activeTab === 'personal'
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Edit className="w-5 h-5" />
                <span>اطلاعات فردی</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-right px-4 py-3 rounded-lg flex items-center gap-3 transition-colors mt-2 ${
                  activeTab === 'security'
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span>تغییر رمز عبور</span>
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 relative">
            {feedback && (
              <div
                className={`p-4 mb-4 rounded-lg text-white ${
                  feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {feedback.message}
              </div>
            )}
            {activeTab === 'personal' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">ویرایش اطلاعات فردی</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <Input label="نام کامل" value={name} onChange={(e) => setName(e.target.value)} />
                  <Input label="آدرس ایمیل" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <div className="flex justify-end">
                    <Button type="submit" variant="primary">ذخیره تغییرات</Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">تغییر رمز عبور</h2>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <Input label="رمز عبور فعلی" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  <Input label="رمز عبور جدید" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <Input label="تکرار رمز عبور جدید" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  <div className="flex justify-end">
                    <Button type="submit" variant="primary">تغییر رمز عبور</Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, BookOpen, UserPlus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);

    // Mock registration
    setTimeout(() => {
      login({
        id: '1',
        name,
        email,
        role: 'student',
        registeredAt: new Date().toISOString(),
      });
      navigate('/');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block">
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-12 text-white">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/20 p-3 rounded-xl">
                <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold">سامانه آزمون</h2>
            </div>

            <h3 className="text-4xl font-bold mb-6 leading-relaxed">
              همین حالا عضو شوید
            </h3>

            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              با ثبت‌نام در پلتفرم، دنیای وسیعی از آزمون‌ها و فرصت‌های یادگیری در انتظار شماست.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎓</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">یادگیری هوشمند</h4>
                  <p className="text-green-100 text-sm">مسیر یادگیری شخصی‌سازی شده برای هر کاربر</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">رقابت سالم</h4>
                  <p className="text-green-100 text-sm">رتبه‌بندی و جدول امتیازات ملی</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">دسترسی همیشگی</h4>
                  <p className="text-green-100 text-sm">آزمون بدهید، هر زمان و هر کجا که هستید</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💼</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">مدرک معتبر</h4>
                  <p className="text-green-100 text-sm">گواهینامه‌های قابل ارائه به کارفرمایان</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">ایجاد حساب کاربری</h1>
              <p className="text-gray-600">فرم زیر را تکمیل کنید</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="نام و نام خانوادگی"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام کامل خود را وارد کنید"
                required
              />
              <Input
                label="آدرس ایمیل"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
              <div className="relative">
                <Input
                  label="رمز عبور"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور قوی انتخاب کنید"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="relative">
                <Input
                  label="تکرار رمز عبور"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="رمز عبور را دوباره وارد کنید"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2"
              >
                {loading ? 'در حال ثبت نام...' : 'ثبت‌نام'}
                <UserPlus className="w-5 h-5" />
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">یا</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600">
                  قبلا ثبت‌نام کرده‌اید؟{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold">
                    وارد شوید
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

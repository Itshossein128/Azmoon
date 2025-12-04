import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, BookOpen } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(email, password);

      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('ایمیل یا رمز عبور نامعتبر است');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-12 text-white">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/20 p-3 rounded-xl">
                <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold">سامانه آزمون</h2>
            </div>

            <h3 className="text-4xl font-bold mb-6 leading-relaxed">
              به پلتفرم آزمون آنلاین خوش آمدید
            </h3>

            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              با ورود به حساب کاربری، می‌توانید در آزمون‌های متنوع شرکت کنید، پیشرفت خود را رصد کنید و گواهینامه‌های معتبر دریافت نمایید.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">دسترسی به بیش از ۱۰۰۰ آزمون</h4>
                  <p className="text-primary-100 text-sm">در دسته‌بندی‌های مختلف علمی و تخصصی</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">گواهینامه معتبر</h4>
                  <p className="text-primary-100 text-sm">دریافت گواهینامه دیجیتال پس از قبولی</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">رصد پیشرفت</h4>
                  <p className="text-primary-100 text-sm">نمایش آمار دقیق و نمودار پیشرفت تحصیلی</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">ورود به حساب کاربری</h1>
              <p className="text-gray-600">برای ادامه لطفا وارد شوید</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="رمز عبور خود را وارد کنید"
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

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex items-center justify-between">
                <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 font-bold">
                  فراموشی رمز عبور
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2"
              >
                {loading ? 'در حال ورود...' : 'ورود به حساب'}
                <LogIn className="w-5 h-5" />
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
                  حساب کاربری ندارید؟{' '}
                  <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold">
                    ثبت‌نام کنید
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

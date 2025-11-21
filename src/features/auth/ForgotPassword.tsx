import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, BookOpen } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Mock API call
    setTimeout(() => {
      setMessage(`An email has been sent to ${email} with instructions to reset your password.`);
      setLoading(false);
    }, 1000);
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
              بازیابی رمز عبور
            </h3>

            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              نگران نباشید! برای بازیابی رمز عبور، ایمیل خود را وارد کنید تا لینک بازیابی برایتان ارسال شود.
            </p>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">فراموشی رمز عبور</h1>
              <p className="text-gray-600">ایمیل خود را برای بازیابی رمز عبور وارد کنید</p>
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

              {message && <p className="text-green-600 bg-green-50 p-4 rounded-lg">{message}</p>}

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2"
              >
                {loading ? 'در حال ارسال...' : 'ارسال لینک بازیابی'}
                <Mail className="w-5 h-5" />
              </Button>

              <div className="text-center">
                <p className="text-gray-600">
                  بازگشت به{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold">
                    صفحه ورود
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

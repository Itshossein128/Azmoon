import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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

    // Mock password reset logic
    setTimeout(() => {
      setMessage(`اگر ایمیل ${email} در سیستم ما ثبت شده باشد، لینک بازیابی رمز عبور برایتان ارسال خواهد شد.`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">بازیابی رمز عبور</h1>
            <p className="text-gray-600">ایمیل خود را وارد کنید تا لینک بازیابی را دریافت نمایید.</p>
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

            {message && <p className="text-green-600 bg-green-50 p-4 rounded-lg text-sm">{message}</p>}

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2"
            >
              {loading ? 'در حال ارسال...' : 'ارسال لینک بازیابی'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold flex items-center justify-center gap-2">
              <span>بازگشت به صفحه ورود</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

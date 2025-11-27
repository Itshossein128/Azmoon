import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function PendingReview() {
  return (
    <div className="max-w-2xl mx-auto my-12 text-center">
      <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
        آزمون شما با موفقیت ثبت شد
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
        این آزمون شامل سوالات تشریحی است. پس از تصحیح توسط مدرس، نتیجه نهایی به شما اطلاع داده خواهد شد و در پنل کاربری شما قابل مشاهده خواهد بود.
      </p>
      <div className="mt-10">
        <Link to="/dashboard">
          <Button>بازگشت به داشبورد</Button>
        </Link>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">سامانه آزمون</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              بهترین پلتفرم برای برگزاری و شرکت در آزمون‌های آنلاین با امکانات پیشرفته و کاربری آسان
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">صفحه اصلی</Link>
              </li>
              <li>
                <Link to="/exams" className="hover:text-primary-400 transition-colors">آزمون‌ها</Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-primary-400 transition-colors">نتایج آزمون‌ها</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">درباره ما</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">تماس با ما</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">دسته‌بندی آزمون‌ها</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/exams?category=زبان" className="hover:text-primary-400 transition-colors">زبان‌های خارجی</Link>
              </li>
              <li>
                <Link to="/exams?category=ریاضی" className="hover:text-primary-400 transition-colors">ریاضی و فیزیک</Link>
              </li>
              <li>
                <Link to="/exams?category=برنامه‌نویسی" className="hover:text-primary-400 transition-colors">برنامه‌نویسی</Link>
              </li>
              <li>
                <Link to="/exams?category=علوم" className="hover:text-primary-400 transition-colors">علوم تجربی</Link>
              </li>
              <li>
                <Link to="/exams?category=هنر" className="hover:text-primary-400 transition-colors">هنر و ادبیات</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">تماس با ما</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary-400" />
                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary-400" />
                <span dir="ltr">info@exam-system.ir</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-primary-400 mt-1" />
                <span>تهران، خیابان ولیعصر، پلاک ۱۲۳۴</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>تمامی حقوق محفوظ است © {new Date().getFullYear()} سامانه آزمون آنلاین</p>
        </div>
      </div>
    </footer>
  );
}

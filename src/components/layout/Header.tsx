import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogIn, BookOpen, Trophy, Home, Search, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { supabase } from '../../services/supabase';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">سامانه آزمون</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                <Home className="w-4 h-4" />
                <span>خانه</span>
              </Link>
              <Link to="/exams" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                <BookOpen className="w-4 h-4" />
                <span>آزمون‌ها</span>
              </Link>
              <Link to="/results" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                <Trophy className="w-4 h-4" />
                <span>نتایج</span>
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-gray-700 hover:text-primary-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                  <User className="w-4 h-4" />
                  <span>{user.user_metadata.full_name || user.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>خروج</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <LogIn className="w-4 h-4" />
                  <span>ورود</span>
                </Link>
                <Link to="/register" className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                  ثبت‌نام
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                <Home className="w-4 h-4" />
                <span>خانه</span>
              </Link>
              <Link to="/exams" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                <BookOpen className="w-4 h-4" />
                <span>آزمون‌ها</span>
              </Link>
              <Link to="/results" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                <Trophy className="w-4 h-4" />
                <span>نتایج</span>
              </Link>

              <div className="border-t pt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link to="/dashboard" className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                      <User className="w-4 h-4" />
                      <span>{user.user_metadata.full_name || user.email}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>خروج</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex items-center justify-center gap-2 px-4 py-2 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                      <LogIn className="w-4 h-4" />
                      <span>ورود</span>
                    </Link>
                    <Link to="/register" className="px-4 py-2 text-center bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                      ثبت‌نام
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

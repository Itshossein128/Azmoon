import { Link, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, X, User, LogIn, BookOpen, Trophy, Home, LogOut, Sun, Moon } from 'lucide-react';
import { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import SearchComponent from '../features/Search';
import { useUserStore } from '../../store/userStore';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUserStore();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2" aria-label="Home">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white">سامانه آزمون</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Home className="w-4 h-4" />
                <span>خانه</span>
              </Link>
              <Link to="/exams" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <BookOpen className="w-4 h-4" />
                <span>آزمون‌ها</span>
              </Link>
              <Link to="/results" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Trophy className="w-4 h-4" />
                <span>نتایج</span>
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <SearchComponent />

            <button onClick={toggleTheme} className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {user ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors" aria-label="User menu">
                  <User className="w-4 h-4" />
                  <span>{user.name || user.email}</span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute left-0 mt-2 w-48 origin-top-left bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard"
                            className={`${
                              active ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          >
                            داشبورد
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/subscriptions"
                            className={`${
                              active ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          >
                            اشتراک
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`${
                              active ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          >
                            پروفایل
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/wallet"
                            className={`${
                              active ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          >
                            کیف پول
                          </Link>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="p-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active ? 'bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300' : 'text-gray-900 dark:text-white'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            خروج
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
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
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t dark:border-gray-700">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Home className="w-4 h-4" />
                <span>خانه</span>
              </Link>
              <Link to="/exams" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <BookOpen className="w-4 h-4" />
                <span>آزمون‌ها</span>
              </Link>
              <Link to="/results" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Trophy className="w-4 h-4" />
                <span>نتایج</span>
              </Link>

              <div className="border-t pt-4 flex flex-col gap-3 dark:border-gray-700">
                {user ? (
                  <>
                    <Link to="/dashboard" className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors" aria-label="Dashboard">
                      <User className="w-4 h-4" />
                      <span>{user.name || user.email}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      aria-label="Logout"
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

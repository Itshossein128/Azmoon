import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  const isExamTakePage = location.pathname.startsWith('/exams/take');

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {!isExamTakePage && <Header />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isExamTakePage && <Footer />}
    </div>
  );
}

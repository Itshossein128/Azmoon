import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../../shared/types';
import { Search, Eye, AlertCircle } from 'lucide-react';
import api from '../../config/api';
import useUserStore from '../../store/userStore';

export default function MyStudents() {
  const [students, setStudents] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user) {
        setError('ابتدا باید وارد شوید.');
        setLoading(false);
        return;
      }
      try {
        const response = await api.get<User[]>(`/api/teacher/${user.id}/students`);
        setStudents(response.data);
      } catch (err) {
        setError('خطا در دریافت لیست دانشجویان.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user]);

  const filteredStudents = useMemo(() =>
    students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, students]);

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">دانشجویان من</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="جستجوی دانشجو..."
            className="pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          <AlertCircle size={48} className="mb-4" />
          <p className="text-lg font-semibold">{error}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">نام دانشجو</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">ایمیل</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">تاریخ عضویت</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="p-4 flex items-center gap-3">
                      <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                      <span>{student.name}</span>
                    </td>
                    <td className="p-4">{student.email}</td>
                    <td className="p-4">{student.registeredAt}</td>
                    <td className="p-4">
                      <Link to={`/teacher/students/${student.id}/results`} className="text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-1">
                        <Eye size={20} />
                        <span>مشاهده نتایج</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-8 text-gray-500">
                    دانشجویی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
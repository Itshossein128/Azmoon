import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Search, AlertCircle } from 'lucide-react';
import Pagination from '../../components/ui/Pagination';
import api from '../../config/api';
import { useUserStore } from '../../store/userStore';
import { User } from '../../../shared/types'; // Assuming a shared type

interface StudentStat extends User {
  completedExams: number;
  averageScore: number;
}

export default function TeacherStudentManagement() {
  const [students, setStudents] = useState<StudentStat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const studentsPerPage = 10;
  const { user } = useUserStore();

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const response = await api.get(`/api/teacher/${user.id}/students`);
        setStudents(response.data);
        setError(null);
      } catch (err) {
        setError('خطا در دریافت لیست دانشجویان.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user]);

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, students]);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * studentsPerPage, currentPage * studentsPerPage);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">مدیریت دانشجویان</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="جستجوی دانشجو..."
            className="pl-10 pr-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-10">در حال بارگذاری...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 flex items-center justify-center gap-2">
            <AlertCircle />
            {error}
          </div>
        ) : (
          <table className="w-full text-right">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-4 font-semibold">نام دانشجو</th>
                <th className="p-4 font-semibold">ایمیل</th>
                <th className="p-4 font-semibold text-center">آزمون‌های تکمیل شده</th>
                <th className="p-4 font-semibold text-center">میانگین نمره</th>
                <th className="p-4 font-semibold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student) => (
                <tr key={student.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="p-4 flex items-center gap-3">
                    <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                    <span>{student.name}</span>
                  </td>
                  <td className="p-4">{student.email}</td>
                  <td className="p-4 text-center">{student.completedExams}</td>
                  <td className="p-4 text-center">{student.averageScore.toFixed(2)}%</td>
                  <td className="p-4 text-center">
                    <Link to={`/teacher/students/${student.id}`} className="text-gray-500 hover:text-blue-500 transition-colors inline-block">
                      <Eye size={20} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

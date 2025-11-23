import { useState, useMemo, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { Exam, Question } from '../../../shared/types';
import { Search, PlusCircle, Eye, FilePenLine, Trash2, BookCopy } from 'lucide-react';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';

const API_URL = 'http://localhost:3000/api';

export default function ExamManagement() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view' | 'questions'>('add');
  const examsPerPage = 5;

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/exams`);
      setExams(response.data);
      setError(null);
    } catch (err) {
      setError('خطا در دریافت لیست آزمون‌ها');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const filteredExams = useMemo(() => {
    return exams.filter(exam =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [exams, searchTerm]);

  const totalPages = Math.ceil(filteredExams.length / examsPerPage);
  const paginatedExams = filteredExams.slice((currentPage - 1) * examsPerPage, currentPage * examsPerPage);

  const openModal = (mode: 'add' | 'edit' | 'view' | 'questions', exam: Exam | null = null) => {
    setModalMode(mode);
    setCurrentExam(exam);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentExam(null);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const examData = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      level: formData.get('level') as string,
      totalQuestions: Number(formData.get('totalQuestions')),
      description: currentExam?.description || '',
      duration: currentExam?.duration || 60,
      passingScore: currentExam?.passingScore || 70,
      price: currentExam?.price || 0,
      imageUrl: currentExam?.imageUrl || '',
      instructor: currentExam?.instructor || '',
      participants: currentExam?.participants || 0,
      rating: currentExam?.rating || 0,
      startDate: currentExam?.startDate || '',
      endDate: currentExam?.endDate || '',
      tags: currentExam?.tags || [],
      questions: currentExam?.questions || [],
    };

    try {
      if (modalMode === 'add') {
        await axios.post(`${API_URL}/exams`, examData);
      } else if (modalMode === 'edit' && currentExam) {
        await axios.put(`${API_URL}/exams/${currentExam.id}`, examData);
      }
      fetchExams();
      closeModal();
    } catch (err) {
      setError('خطا در ذخیره آزمون');
      console.error(err);
    }
  };

  const deleteExam = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/exams/${id}`);
      fetchExams();
    } catch (err) {
      setError('خطا در حذف آزمون');
      console.error(err);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">مدیریت آزمون‌ها</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="جستجوی آزمون..."
              className="pl-10 pr-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => openModal('add')} className="flex items-center gap-2">
            <PlusCircle size={20} />
            <span>افزودن آزمون</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-4 font-semibold">عنوان آزمون</th>
              <th className="p-4 font-semibold">دسته بندی</th>
              <th className="p-4 font-semibold">سطح</th>
              <th className="p-4 font-semibold">تعداد سوالات</th>
              <th className="p-4 font-semibold">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {paginatedExams.map((exam) => (
              <tr key={exam.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="p-4">{exam.title}</td>
                <td className="p-4">{exam.category}</td>
                <td className="p-4">{exam.level}</td>
                <td className="p-4">{exam.totalQuestions}</td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button onClick={() => openModal('view', exam)} className="text-gray-500 hover:text-blue-500 transition-colors">
                      <Eye size={20} />
                    </button>
                    <button onClick={() => openModal('edit', exam)} className="text-gray-500 hover:text-yellow-500 transition-colors">
                      <FilePenLine size={20} />
                    </button>
                    <button onClick={() => deleteExam(exam.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                    <button onClick={() => openModal('questions', exam)} className="text-gray-500 hover:text-green-500 transition-colors">
                      <BookCopy size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {isModalOpen && currentExam && modalMode === 'view' && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title="مشاهده آزمون">
            <div className="space-y-4">
            <p><span className="font-semibold">عنوان:</span> {currentExam.title}</p>
            <p><span className="font-semibold">توضیحات:</span> {currentExam.description}</p>
            <p><span className="font-semibold">دسته بندی:</span> {currentExam.category}</p>
            <p><span className="font-semibold">سطح:</span> {currentExam.level}</p>
            <p><span className="font-semibold">مدت زمان:</span> {currentExam.duration} دقیقه</p>
            <p><span className="font-semibold">تعداد سوالات:</span> {currentExam.totalQuestions}</p>
            </div>
            <div className="flex justify-end pt-4">
                <Button variant="secondary" onClick={closeModal}>بستن</Button>
            </div>
        </Modal>
      )}

      {isModalOpen && (modalMode === 'add' || modalMode === 'edit') && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={modalMode === 'add' ? 'افزودن آزمون جدید' : 'ویرایش آزمون'}>
            <form onSubmit={handleFormSubmit} className="space-y-4">
                <Input label="عنوان آزمون" name="title" defaultValue={currentExam?.title} required />
                <Input label="دسته بندی" name="category" defaultValue={currentExam?.category} required />
                <Input label="سطح" name="level" defaultValue={currentExam?.level} required />
                <Input label="تعداد سوالات" name="totalQuestions" type="number" defaultValue={currentExam?.totalQuestions} required />
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={closeModal}>لغو</Button>
                    <Button type="submit">ذخیره</Button>
                </div>
            </form>
        </Modal>
      )}

      {isModalOpen && modalMode === 'questions' && currentExam && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={`سوالات آزمون: ${currentExam.title}`}>
          <div className="space-y-4">
            {currentExam.questions?.map((q, index) => (
              <div key={q.id} className="border-b pb-2">
                <p className="font-semibold">{index + 1}. {q.text}</p>
                <ul className="list-disc list-inside mt-2">
                  {q.options.map((opt, i) => (
                    <li key={i} className={i === q.correctAnswer ? 'text-green-600' : ''}>{opt}</li>
                  ))}
                </ul>
              </div>
            ))}
            {(!currentExam.questions || currentExam.questions.length === 0) && (
              <p>هنوز سوالی برای این آزمون ثبت نشده است.</p>
            )}
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="secondary" onClick={closeModal}>بستن</Button>
          </div>
        </Modal>
      )}

    </div>
  );
}

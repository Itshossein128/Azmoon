import { useState, useMemo, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { Exam, Question } from '../../../shared/types';
import { Search, PlusCircle, Eye, FilePenLine, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import { API_URL } from '../../config/api';
import QuestionSelector from './components/QuestionSelector';

export default function ExamManagement() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

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

  const openModal = (mode: 'add' | 'edit' | 'view', exam: Exam | null = null) => {
    setModalMode(mode);
    setCurrentExam(exam);
    if (exam && (mode === 'edit' || mode === 'view')) {
      setSelectedQuestionIds(exam.questions?.map(q => q.id) || []);
    } else {
      setSelectedQuestionIds([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentExam(null);
    setSelectedQuestionIds([]);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const examData = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      level: formData.get('level') as string,
      duration: Number(formData.get('duration')),
      description: formData.get('description') as string,
      passingScore: Number(formData.get('passingScore')),
      price: Number(formData.get('price')),
      imageUrl: formData.get('imageUrl') as string,
      instructor: formData.get('instructor') as string,
      participants: Number(formData.get('participants')),
      rating: Number(formData.get('rating')),
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
      questions: selectedQuestionIds.map(id => ({ id })), // Send only IDs
      totalQuestions: selectedQuestionIds.length,
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
      {/* Header and Controls */}
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

      {/* Exams Table */}
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
                <td className="p-4">{exam.questions?.length || 0}</td>
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

      {/* View Modal */}
      {isModalOpen && currentExam && modalMode === 'view' && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title="مشاهده آزمون">
            <div className="space-y-4">
            <p><span className="font-semibold">عنوان:</span> {currentExam.title}</p>
            <p><span className="font-semibold">توضیحات:</span> {currentExam.description}</p>
            {/* ... other fields */}
            </div>
            <div className="flex justify-end pt-4">
                <Button variant="secondary" onClick={closeModal}>بستن</Button>
            </div>
        </Modal>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (modalMode === 'add' || modalMode === 'edit') && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={modalMode === 'add' ? 'افزودن آزمون جدید' : 'ویرایش آزمون'} size="3xl">
            <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="عنوان آزمون" name="title" defaultValue={currentExam?.title} required />
                    <Input label="دسته بندی" name="category" defaultValue={currentExam?.category} required />
                    <Input label="سطح" name="level" defaultValue={currentExam?.level} required />
                    <Input label="مدت زمان (دقیقه)" name="duration" type="number" defaultValue={currentExam?.duration || 60} required />
                    <Input label="نمره قبولی" name="passingScore" type="number" defaultValue={currentExam?.passingScore || 50} required />
                    <Input label="قیمت (تومان)" name="price" type="number" defaultValue={currentExam?.price || 0} />
                    <Input label="آدرس تصویر" name="imageUrl" defaultValue={currentExam?.imageUrl} />
                    <Input label="مدرس" name="instructor" defaultValue={currentExam?.instructor} />
                    <Input label="تاریخ شروع" name="startDate" type="datetime-local" defaultValue={currentExam?.startDate?.slice(0, 16)} />
                    <Input label="تاریخ پایان" name="endDate" type="datetime-local" defaultValue={currentExam?.endDate?.slice(0, 16)} />
                    <Input label="توضیحات" name="description" defaultValue={currentExam?.description} className="md:col-span-2" />
                    <Input label="تگ ها (با ویرگول جدا کنید)" name="tags" defaultValue={currentExam?.tags?.join(', ')} className="md:col-span-2" />
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold mb-2">انتخاب سوالات از بانک</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    ابتدا دسته‌بندی را انتخاب کرده، سپس سوالات مورد نظر را جستجو و انتخاب کنید. ({selectedQuestionIds.length} سوال انتخاب شده)
                  </p>
                  <QuestionSelector
                    selectedQuestions={selectedQuestionIds}
                    onChange={setSelectedQuestionIds}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                    <Button type="button" variant="secondary" onClick={closeModal}>لغو</Button>
                    <Button type="submit">ذخیره</Button>
                </div>
            </form>
        </Modal>
      )}
    </div>
  );
}

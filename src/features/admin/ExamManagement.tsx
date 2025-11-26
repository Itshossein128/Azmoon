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

export default function ExamManagement() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [questions, setQuestions] = useState<Question[]>([]);

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
    if (exam && mode === 'edit') {
      setQuestions(exam.questions || []);
    } else {
      setQuestions([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentExam(null);
    setQuestions([]);
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
      questions: questions,
      totalQuestions: questions.length,
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

  const handleQuestionChange = (index: number, field: keyof Question | `option-${number}`, value: any) => {
    const newQuestions = [...questions];
    if (typeof field === 'string' && field.startsWith('option-')) {
      const optionIndex = parseInt(field.split('-')[1]);
      const newOptions = [...(newQuestions[index].options || [])];
      newOptions[optionIndex] = value;
      newQuestions[index] = { ...newQuestions[index], options: newOptions };
    } else if (field === 'correctAnswer') {
      newQuestions[index] = { ...newQuestions[index], correctAnswer: parseInt(value) };
    }
    else {
      newQuestions[index] = { ...newQuestions[index], [field as keyof Question]: value };
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: `new-${Date.now()}`, examId: currentExam?.id || 'new', text: '', type: 'multiple-choice', options: ['', '', '', ''], correctAnswer: 0, points: 0 }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
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
                    <Input label="توضیحات" name="description" defaultValue={currentExam?.description} />
                    <Input label="تگ ها (با ویرگول جدا کنید)" name="tags" defaultValue={currentExam?.tags?.join(', ')} />
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">سوالات</h3>
                    <Button type="button" variant="secondary" onClick={addQuestion}>افزودن سوال</Button>
                  </div>
                  <div className="space-y-6 max-h-72 overflow-y-auto p-2">
                    {questions.map((q, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <div className="flex justify-between items-center mb-2">
                          <label className="font-semibold">سوال {index + 1}</label>
                          <Button type="button" variant="danger" size="sm" onClick={() => removeQuestion(index)}>حذف</Button>
                        </div>
                        <Input placeholder="متن سوال را وارد کنید" value={q.text} onChange={(e) => handleQuestionChange(index, 'text', e.target.value)} />
                        <div className="mt-4">
                          <label className="font-semibold mb-2 block">گزینه‌ها و پاسخ صحیح:</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                            {Array.from({ length: 4 }).map((_, optionIndex) => (
                              <div key={optionIndex} className="flex items-center">
                                <input type="radio" name={`correctAnswer-${index}`} value={optionIndex} checked={q.correctAnswer === optionIndex} onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)} className="ml-2" />
                                <Input placeholder={`گزینه ${optionIndex + 1}`} value={q.options[optionIndex]} onChange={(e) => handleQuestionChange(index, `option-${optionIndex}`, e.target.value)} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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

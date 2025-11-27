import { useState, useEffect, useMemo, FormEvent } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Question, Category } from '../../../shared/types';
import { Search, PlusCircle, FilePenLine, Trash2, Upload } from 'lucide-react';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import { API_URL } from '../../config/api';

export default function QuestionBank() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const questionsPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [questionsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/questions`),
        axios.get(`${API_URL}/categories`),
      ]);
      setQuestions(questionsRes.data);
      setCategories(categoriesRes.data);
      setError(null);
    } catch (err) {
      setError('خطا در دریافت اطلاعات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredQuestions = useMemo(() => {
    return questions
      .filter(q => selectedCategory === 'all' || q.category === selectedCategory)
      .filter(q => q.text.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [questions, selectedCategory, searchTerm]);

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const paginatedQuestions = filteredQuestions.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage);

  const openModal = (mode: 'add' | 'edit', question: Question | null = null) => {
    setModalMode(mode);
    setCurrentQuestion(question);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentQuestion(null);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const questionData: Partial<Question> = {
        text: formData.get('text') as string,
        category: formData.get('category') as string,
        points: Number(formData.get('points')),
        options: [
            formData.get('option-0') as string,
            formData.get('option-1') as string,
            formData.get('option-2') as string,
            formData.get('option-3') as string,
        ],
        correctAnswer: Number(formData.get('correctAnswer')),
        type: 'multiple-choice',
    };

    try {
        const toastId = toast.loading('در حال ذخیره سوال...');
        if (modalMode === 'add') {
            await axios.post(`${API_URL}/questions`, questionData);
        } else if (currentQuestion) {
            await axios.put(`${API_URL}/questions/${currentQuestion.id}`, questionData);
        }
        toast.success('سوال با موفقیت ذخیره شد', { id: toastId });
        fetchData();
        closeModal();
    } catch (err) {
        toast.error('خطا در ذخیره سوال');
        console.error(err);
    }
  };

  const deleteQuestion = async (id: string) => {
    if(window.confirm('آیا از حذف این سوال مطمئن هستید؟')) {
        try {
            const toastId = toast.loading('در حال حذف سوال...');
            await axios.delete(`${API_URL}/questions/${id}`);
            toast.success('سوال با موفقیت حذف شد', { id: toastId });
            fetchData();
        } catch (err) {
            toast.error('خطا در حذف سوال');
            console.error(err);
        }
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">بانک سوالات</h1>
        <div className="flex items-center gap-4">
            <input type="text" placeholder="جستجو در سوالات..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="all">همه دسته‌بندی‌ها</option>
                {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
            </select>
            <Button onClick={() => openModal('add')} className="flex items-center gap-2"><PlusCircle size={20} /> افزودن سوال</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-4 font-semibold">متن سوال</th>
              <th className="p-4 font-semibold">دسته‌بندی</th>
              <th className="p-4 font-semibold">امتیاز</th>
              <th className="p-4 font-semibold">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {paginatedQuestions.map((q) => (
              <tr key={q.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="p-4">{q.text}</td>
                <td className="p-4">{q.category}</td>
                <td className="p-4">{q.points}</td>
                <td className="p-4 flex gap-3">
                  <button onClick={() => openModal('edit', q)} className="text-gray-500 hover:text-yellow-500"><FilePenLine size={20} /></button>
                  <button onClick={() => deleteQuestion(q.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={modalMode === 'add' ? 'افزودن سوال' : 'ویرایش سوال'}>
            <form onSubmit={handleFormSubmit} className="space-y-4">
                <Input name="text" label="متن سوال" defaultValue={currentQuestion?.text} required />
                <select name="category" defaultValue={currentQuestion?.category} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                    <option value="">انتخاب دسته‌بندی</option>
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
                <Input name="points" label="امتیاز" type="number" defaultValue={currentQuestion?.points} required />
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center">
                        <input type="radio" name="correctAnswer" value={i} defaultChecked={currentQuestion?.correctAnswer === i} className="ml-2" />
                        <Input name={`option-${i}`} placeholder={`گزینه ${i + 1}`} defaultValue={currentQuestion?.options?.[i]} />
                    </div>
                ))}
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={closeModal}>لغو</Button>
                    <Button type="submit">ذخیره</Button>
                </div>
            </form>
        </Modal>
      )}
    </div>
  );
}

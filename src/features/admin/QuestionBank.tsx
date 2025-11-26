import { useState, useEffect } from 'react';
import axios from 'axios';
import { Question } from '../../../shared/types';
import { Search, PlusCircle, FilePenLine, Trash2, Upload } from 'lucide-react';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import { API_URL } from '../../config/api';

export default function QuestionBank() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const questionsPerPage = 10;

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/questions`);
      setQuestions(response.data);
      setError(null);
    } catch (err) {
      setError('خطا در دریافت لیست سوالات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter(q => q.text.toLowerCase().includes(searchTerm.toLowerCase()));
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const questionData: Partial<Question> = {
      text: formData.get('text') as string,
      type: 'multiple-choice', // Assuming multiple-choice for now
      points: Number(formData.get('points')),
      options: [
        formData.get('option-0') as string,
        formData.get('option-1') as string,
        formData.get('option-2') as string,
        formData.get('option-3') as string,
      ],
      correctAnswer: Number(formData.get('correctAnswer')),
    };

    try {
      if (modalMode === 'add') {
        await axios.post(`${API_URL}/questions`, questionData);
      } else if (modalMode === 'edit' && currentQuestion) {
        await axios.put(`${API_URL}/questions/${currentQuestion.id}`, questionData);
      }
      fetchQuestions();
      closeModal();
    } catch (err) {
      setError('خطا در ذخیره سوال');
      console.error(err);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (window.confirm('آیا از حذف این سوال مطمئن هستید؟')) {
      try {
        await axios.delete(`${API_URL}/questions/${id}`);
        fetchQuestions();
      } catch (err) {
        setError('خطا در حذف سوال');
        console.error(err);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile) {
      setUploadError('لطفا یک فایل را انتخاب کنید.');
      return;
    }

    const formData = new FormData();
    formData.append('questionFile', uploadFile);

    try {
      const toastId = toast.loading('در حال آپلود فایل...');
      const response = await axios.post(`${API_URL}/questions/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(response.data.message || 'فایل با موفقیت آپلود شد', { id: toastId });
      fetchQuestions(); // Refresh the question list
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadError(null);
    } catch (err) {
      toast.error('خطا در آپلود فایل');
      if (axios.isAxiosError(err) && err.response) {
        setUploadError(err.response.data.message || 'مشکلی در سرور رخ داده است.');
      } else {
        setUploadError('خطای ناشناخته');
      }
      console.error(err);
    }
  };


  if (loading) return <Spinner />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">بانک سوالات</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="جستجوی سوال..."
              className="pl-10 pr-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => openModal('add')} className="flex items-center gap-2">
            <PlusCircle size={20} />
            <span>افزودن سوال</span>
          </Button>
          <Button onClick={() => setIsUploadModalOpen(true)} variant="secondary" className="flex items-center gap-2">
            <Upload size={20} />
            <span>آپلود دسته‌جمعی</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-4 font-semibold">متن سوال</th>
              <th className="p-4 font-semibold">نوع</th>
              <th className="p-4 font-semibold">امتیاز</th>
              <th className="p-4 font-semibold">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {paginatedQuestions.map((question) => (
              <tr key={question.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="p-4">{question.text}</td>
                <td className="p-4">{question.type === 'multiple-choice' ? 'چند گزینه ای' : 'تشریحی'}</td>
                <td className="p-4">{question.points}</td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button onClick={() => openModal('edit', question)} className="text-gray-500 hover:text-yellow-500 transition-colors">
                      <FilePenLine size={20} />
                    </button>
                    <button onClick={() => deleteQuestion(question.id)} className="text-gray-500 hover:text-red-500 transition-colors">
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={modalMode === 'add' ? 'افزودن سوال جدید' : 'ویرایش سوال'} size="2xl">
            <form onSubmit={handleFormSubmit} className="space-y-6">
                <Input label="متن سوال" name="text" defaultValue={currentQuestion?.text} required />
                <Input label="امتیاز" name="points" type="number" defaultValue={currentQuestion?.points || 1} required />

                <div className="border-t pt-4">
                  <label className="font-semibold mb-2 block">گزینه‌ها و پاسخ صحیح:</label>
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctAnswer"
                          value={optionIndex}
                          defaultChecked={currentQuestion?.correctAnswer === optionIndex}
                          className="ml-2"
                        />
                        <Input
                          name={`option-${optionIndex}`}
                          placeholder={`گزینه ${optionIndex + 1}`}
                          defaultValue={currentQuestion?.options?.[optionIndex]}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="secondary" onClick={closeModal}>لغو</Button>
                    <Button type="submit">ذخیره</Button>
                </div>
            </form>
        </Modal>
      )}

      {/* Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="آپلود دسته‌جمعی سوالات">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            فایل CSV یا Excel خود را انتخاب کنید. فایل باید شامل ستون‌های زیر باشد:
            <code className="bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-xs">text</code>,
            <code className="bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-xs">points</code>,
            <code className="bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-xs">option1</code>,
            <code className="bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-xs">option2</code>,
            <code className="bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-xs">option3</code>,
            <code className="bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-xs">option4</code>,
            <code className="bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-xs">correctAnswer</code> (index).
          </p>
          <Input
            type="file"
            name="questionFile"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
          />
          {uploadError && <Alert type="error" message={uploadError} />}
        </div>
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
          <Button type="button" variant="secondary" onClick={() => setIsUploadModalOpen(false)}>لغو</Button>
          <Button type="button" onClick={handleFileUpload}>آپلود</Button>
        </div>
      </Modal>
    </div>
  );
}

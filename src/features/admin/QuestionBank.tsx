import { useState, useEffect, useMemo, FormEvent } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Question, Category, QuestionType } from '../../../shared/types';
import { Search, PlusCircle, FilePenLine, Trash2, X, GripVertical } from 'lucide-react';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import { API_URL } from '../../config/api';

// A more structured state for the form
type QuestionFormData = Partial<Question> & {
    options: string[];
    correctAnswerRadio: string; // for multiple-choice
    correctAnswerCheckbox: boolean[]; // for multiple-answer
};

const initialFormState: QuestionFormData = {
    text: '',
    category: '',
    points: 1,
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswerRadio: '0',
    correctAnswerCheckbox: [false, false, false, false],
    prompts: [''],
    correctAnswer: [],
};


export default function QuestionBank() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const [formData, setFormData] = useState<QuestionFormData>(initialFormState);

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
    if (question) {
        setFormData({
            ...initialFormState,
            ...question,
            options: question.options || initialFormState.options,
            correctAnswerRadio: String(question.correctAnswer) || '0',
            correctAnswerCheckbox: Array.isArray(question.correctAnswer)
                ? initialFormState.options.map((_, i) => (question.correctAnswer as number[]).includes(i))
                : initialFormState.correctAnswerCheckbox,
        });
    } else {
        setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleListChange = (listName: 'prompts' | 'options', index: number, value: string) => {
    setFormData(prev => {
        const newList = [...(prev[listName] || [])];
        newList[index] = value;
        return { ...prev, [listName]: newList };
    });
  };

  const addListItem = (listName: 'prompts' | 'options') => {
      setFormData(prev => ({ ...prev, [listName]: [...(prev[listName] || []), ''] }));
  };

  const removeListItem = (listName: 'prompts' | 'options', index: number) => {
      setFormData(prev => ({ ...prev, [listName]: (prev[listName] || []).filter((_, i) => i !== index) }));
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const questionData: Partial<Question> = { ...formData };

    if (formData.type === 'multiple-choice') {
        questionData.correctAnswer = Number(formData.correctAnswerRadio);
    } else if (formData.type === 'multiple-answer') {
        questionData.correctAnswer = formData.correctAnswerCheckbox.map((checked, i) => checked ? i : -1).filter(i => i !== -1);
    } else if (formData.type === 'matching') {
        questionData.options = formData.options.filter(o => o.trim() !== '');
        questionData.prompts = formData.prompts?.filter(p => p.trim() !== '');
        // correctAnswer is already set in state for matching
    }
    // Cleanup unnecessary fields
    delete (questionData as any).correctAnswerRadio;
    delete (questionData as any).correctAnswerCheckbox;

    try {
        const toastId = toast.loading('در حال ذخیره سوال...');
        if (modalMode === 'add') {
            await axios.post(`${API_URL}/questions`, questionData);
        } else if (formData.id) {
            await axios.put(`${API_URL}/questions/${formData.id}`, questionData);
        }
        toast.success('سوال با موفقیت ذخیره شد', { id: toastId });
        fetchData();
        closeModal();
    } catch (err) {
        toast.error('خطا در ذخیره سوال');
    }
  };

  const deleteQuestion = async (id: string) => {
    if(window.confirm('آیا از حذف این سوال مطمئن هستید؟')) {
        try {
            await axios.delete(`${API_URL}/questions/${id}`);
            toast.success('سوال با موفقیت حذف شد');
            fetchData();
        } catch (err) {
            toast.error('خطا در حذف سوال');
        }
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      {/* Header and Controls */}
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

        {/* Table */}
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={modalMode === 'add' ? 'افزودن سوال' : 'ویرایش سوال'}>
            <form onSubmit={handleFormSubmit} className="space-y-4">
                <Input name="text" label="متن سوال" value={formData.text} onChange={handleInputChange} required />
                <div className="grid grid-cols-2 gap-4">
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                        <option value="">انتخاب دسته‌بندی</option>
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                    <select name="type" aria-label="Question Type" value={formData.type} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                        <option value="multiple-choice">تک جوابی</option>
                        <option value="multiple-answer">چند جوابی</option>
                        <option value="fill-in-the-blank">جای خالی</option>
                        <option value="matching">جورکردنی</option>
                        <option value="essay-with-upload">تشریحی با آپلود</option>
                    </select>
                </div>
                <Input name="points" label="امتیاز" type="number" value={formData.points} onChange={handleInputChange} required />

                {formData.type === 'essay-with-upload' && (
                    <textarea name="gradingCriteria" placeholder="معیارهای ارزیابی..." value={formData.gradingCriteria} onChange={handleInputChange} rows={3} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                )}

                {formData.type === 'fill-in-the-blank' && (
                    <Input name="correctAnswer" label="پاسخ صحیح (جای خالی)" value={formData.correctAnswer as string} onChange={handleInputChange} required />
                )}

                {(formData.type === 'multiple-choice' || formData.type === 'multiple-answer') && (
                    <div className="border-t pt-4 space-y-2">
                        <h3 className="font-semibold">گزینه‌ها و پاسخ(های) صحیح</h3>
                        {formData.options.map((option, i) => (
                            <div key={i} className="flex items-center gap-2">
                                {formData.type === 'multiple-choice' ? (
                                    <input type="radio" name="correctAnswerRadio" value={i} checked={formData.correctAnswerRadio === String(i)} onChange={handleInputChange} className="form-radio h-5 w-5" />
                                ) : (
                                    <input type="checkbox" checked={formData.correctAnswerCheckbox[i]} onChange={() => setFormData(prev => {
                                        const newChecks = [...prev.correctAnswerCheckbox];
                                        newChecks[i] = !newChecks[i];
                                        return { ...prev, correctAnswerCheckbox: newChecks };
                                    })} className="form-checkbox h-5 w-5 rounded" />
                                )}
                                <Input name={`option-${i}`} placeholder={`گزینه ${i + 1}`} value={option} onChange={(e) => handleListChange('options', i, e.target.value)} required />
                            </div>
                        ))}
                    </div>
                )}

                {formData.type === 'matching' && (
                    <div className="border-t pt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold mb-2">صورت سوال‌ها (Prompts)</h3>
                                {(formData.prompts || []).map((prompt, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                        <Input value={prompt} onChange={(e) => handleListChange('prompts', index, e.target.value)} placeholder={`آیتم ${index + 1}`} />
                                        <Button type="button" variant="danger" size="icon" onClick={() => removeListItem('prompts', index)}><X size={16} /></Button>
                                    </div>
                                ))}
                                <Button type="button" variant="secondary" onClick={() => addListItem('prompts')}>افزودن آیتم</Button>
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2">گزینه‌ها (Options)</h3>
                                {formData.options.map((option, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                        <Input value={option} onChange={(e) => handleListChange('options', index, e.target.value)} placeholder={`گزینه ${index + 1}`} />
                                        <Button type="button" variant="danger" size="icon" onClick={() => removeListItem('options', index)}><X size={16} /></Button>
                                    </div>
                                ))}
                                <Button type="button" variant="secondary" onClick={() => addListItem('options')}>افزودن گزینه</Button>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 border-t pt-4">تنظیم کلید پاسخ</h3>
                            {(formData.prompts || []).map((prompt, pIndex) => (
                                <div key={pIndex} className="flex items-center gap-4 mb-2">
                                    <span className="flex-1">{prompt || `آیتم ${pIndex + 1}`}</span>
                                    <select
                                        value={(formData.correctAnswer as number[])?.[pIndex] ?? ''}
                                        onChange={(e) => {
                                            const newMatching = [...(formData.correctAnswer as number[] || [])];
                                            newMatching[pIndex] = Number(e.target.value);
                                            setFormData(prev => ({...prev, correctAnswer: newMatching}));
                                        }}
                                        className="w-full flex-1 px-3 py-2 border rounded-lg shadow-sm"
                                    >
                                        <option value="" disabled>انتخاب کنید</option>
                                        {formData.options.map((option, oIndex) => (
                                            <option key={oIndex} value={oIndex}>{option || `گزینه ${oIndex + 1}`}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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

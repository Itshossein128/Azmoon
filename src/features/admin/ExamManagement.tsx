import { useState, useMemo, FormEvent } from 'react';
import { mockExams } from '../../data/mockData';
import { Exam } from '../../types';
import { Search, PlusCircle, Eye, FilePenLine, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const ITEMS_PER_PAGE = 5;

export default function ExamManagement() {
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingExamId, setDeletingExamId] = useState<string | null>(null);

  const filteredExams = useMemo(() => {
    return exams
      .filter(exam =>
        exam.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(exam =>
        categoryFilter === 'all' || exam.category === categoryFilter
      )
      .filter(exam =>
        levelFilter === 'all' || exam.level === levelFilter
      );
  }, [exams, searchTerm, categoryFilter, levelFilter]);

  const totalPages = Math.ceil(filteredExams.length / ITEMS_PER_PAGE);

  const paginatedExams = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredExams.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredExams, currentPage]);

  const uniqueCategories = [...new Set(mockExams.map(exam => exam.category))];
  const uniqueLevels = ['آسان', 'متوسط', 'سخت'];

  const handleAddExam = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newExam: Exam = {
      id: crypto.randomUUID(),
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      level: formData.get('level') as 'آسان' | 'متوسط' | 'سخت',
      totalQuestions: Number(formData.get('totalQuestions')),
      duration: Number(formData.get('duration')),
      description: '',
      passingScore: 0,
      price: 0,
      imageUrl: '',
      instructor: '',
      participants: 0,
      rating: 0,
      tags: [],
      questions: [],
    };
    setExams([newExam, ...exams]);
    setIsAddModalOpen(false);
  };

  const handleUpdateExam = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingExam) return;
    const formData = new FormData(e.currentTarget);
    const updatedExam = {
      ...editingExam,
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      level: formData.get('level') as 'آسان' | 'متوسط' | 'سخت',
      totalQuestions: Number(formData.get('totalQuestions')),
      duration: Number(formData.get('duration')),
    };
    setExams(exams.map(exam => exam.id === updatedExam.id ? updatedExam : exam));
    setIsEditModalOpen(false);
    setEditingExam(null);
  };

  const handleDeleteExam = () => {
    if (!deletingExamId) return;
    setExams(exams.filter(exam => exam.id !== deletingExamId));
    setIsDeleteModalOpen(false);
    setDeletingExamId(null);
  };

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
              className="pl-10 pr-4 py-2 w-64 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">همه دسته‌بندی‌ها</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="all">همه سطوح</option>
            {uniqueLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
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
              <th className="p-4 font-semibold">دسته‌بندی</th>
              <th className="p-4 font-semibold">سطح</th>
              <th className="p-4 font-semibold">تعداد سوالات</th>
              <th className="p-4 font-semibold">زمان (دقیقه)</th>
              <th className="p-4 font-semibold">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {paginatedExams.map((exam) => (
              <tr key={exam.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="p-4">{exam.title}</td>
                <td className="p-4">{exam.category}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    exam.level === 'سخت' ? 'bg-red-100 text-red-700' :
                    exam.level === 'متوسط' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {exam.level}
                  </span>
                </td>
                <td className="p-4">{exam.totalQuestions}</td>
                <td className="p-4">{exam.duration}</td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button className="text-gray-500 hover:text-blue-500 transition-colors"><Eye size={20} /></button>
                    <button onClick={() => { setEditingExam(exam); setIsEditModalOpen(true); }} className="text-gray-500 hover:text-yellow-500 transition-colors"><FilePenLine size={20} /></button>
                    <button onClick={() => { setDeletingExamId(exam.id); setIsDeleteModalOpen(true); }} className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
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

      {/* Add Exam Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="افزودن آزمون جدید">
        <form onSubmit={handleAddExam} className="space-y-4">
          <Input name="title" label="عنوان آزمون" required />
          <Input name="category" label="دسته‌بندی" required />
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">سطح</label>
            <select name="level" id="level" required className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
              {uniqueLevels.map(level => <option key={level} value={level}>{level}</option>)}
            </select>
          </div>
          <Input name="totalQuestions" label="تعداد سوالات" type="number" required />
          <Input name="duration" label="زمان (دقیقه)" type="number" required />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>لغو</Button>
            <Button type="submit">افزودن</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Exam Modal */}
      {editingExam && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="ویرایش آزمون">
          <form onSubmit={handleUpdateExam} className="space-y-4">
            <Input name="title" label="عنوان آزمون" defaultValue={editingExam.title} required />
            <Input name="category" label="دسته‌بندی" defaultValue={editingExam.category} required />
            <div>
              <label htmlFor="edit-level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">سطح</label>
              <select name="level" id="edit-level" defaultValue={editingExam.level} required className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                {uniqueLevels.map(level => <option key={level} value={level}>{level}</option>)}
              </select>
            </div>
            <Input name="totalQuestions" label="تعداد سوالات" type="number" defaultValue={editingExam.totalQuestions} required />
            <Input name="duration" label="زمان (دقیقه)" type="number" defaultValue={editingExam.duration} required />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => { setIsEditModalOpen(false); setEditingExam(null); }}>لغو</Button>
              <Button type="submit">ذخیره</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Exam Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="حذف آزمون">
        <div>
          <p>آیا از حذف این آزمون اطمینان دارید؟</p>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => { setIsDeleteModalOpen(false); setDeletingExamId(null); }}>لغو</Button>
            <Button onClick={handleDeleteExam}>حذف</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

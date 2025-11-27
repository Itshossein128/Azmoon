import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { Category } from '../../../shared/types';
import { Search, PlusCircle, FilePenLine, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import { API_URL } from '../../config/api';

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError('خطا در دریافت لیست دسته‌بندی‌ها');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (mode: 'add' | 'edit', category: Category | null = null) => {
    setModalMode(mode);
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryData = {
      name: formData.get('name') as string,
      icon: formData.get('icon') as string,
      count: Number(formData.get('count')),
    };

    try {
      if (modalMode === 'add') {
        await axios.post(`${API_URL}/categories`, categoryData);
      } else if (modalMode === 'edit' && currentCategory) {
        await axios.put(`${API_URL}/categories/${currentCategory.id}`, categoryData);
      }
      fetchCategories();
      closeModal();
    } catch (err) {
      setError('خطا در ذخیره دسته‌بندی');
      console.error(err);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/categories/${id}`);
      fetchCategories();
    } catch (err) {
      setError('خطا در حذف دسته‌بندی');
      console.error(err);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">مدیریت دسته‌بندی‌ها</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="جستجوی دسته‌بندی..."
              className="pl-10 pr-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => openModal('add')} className="flex items-center gap-2">
            <PlusCircle size={20} />
            <span>افزودن دسته‌بندی</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-4 font-semibold">آیکون</th>
              <th className="p-4 font-semibold">نام دسته‌بندی</th>
              <th className="p-4 font-semibold">تعداد آزمون‌ها</th>
              <th className="p-4 font-semibold">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="p-4 text-2xl">{category.icon}</td>
                <td className="p-4">{category.name}</td>
                <td className="p-4">{category.count}</td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button onClick={() => openModal('edit', category)} className="text-gray-500 hover:text-yellow-500 transition-colors">
                      <FilePenLine size={20} />
                    </button>
                    <button onClick={() => deleteCategory(category.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={modalMode === 'add' ? 'افزودن دسته‌بندی جدید' : 'ویرایش دسته‌بندی'}>
            <form onSubmit={handleFormSubmit} className="space-y-4">
                <Input label="نام دسته‌بندی" name="name" defaultValue={currentCategory?.name} required />
                <Input label="آیکون" name="icon" defaultValue={currentCategory?.icon} required />
                <Input label="تعداد آزمون‌ها" name="count" type="number" defaultValue={currentCategory?.count} required />
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

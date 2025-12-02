import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DiscountCode, DiscountType } from '../../../../shared/types';
import { API_URL } from '@/config/api';
import Button from '@/components/ui/Button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

const DiscountManagement = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState<Partial<DiscountCode>>({});

  const fetchDiscountCodes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/discounts`);
      setDiscountCodes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching discount codes:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  const handleSave = async () => {
    try {
      if (currentCode.id) {
        await axios.put(`${API_URL}/discounts/${currentCode.id}`, currentCode);
        toast.success('کد تخفیف با موفقیت ویرایش شد');
      } else {
        await axios.post(`${API_URL}/discounts`, currentCode);
        toast.success('کد تخفیف با موفقیت ایجاد شد');
      }
      fetchDiscountCodes();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('خطا در ذخیره کد تخفیف');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این کد تخفیف مطمئن هستید؟')) {
      try {
        await axios.delete(`${API_URL}/discounts/${id}`);
        toast.success('کد تخفیف با موفقیت حذف شد');
        fetchDiscountCodes();
      } catch (error) {
        toast.error('خطا در حذف کد تخفیف');
      }
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت کدهای تخفیf</h1>
        <Button onClick={() => { setCurrentCode({}); setIsModalOpen(true); }}>
          <PlusCircle className="ml-2" />
          کد جدید
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          {/* ... table head ... */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {discountCodes.map((code) => (
              <tr key={code.id}>
                <td className="px-6 py-4 whitespace-nowrap">{code.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{code.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{code.value}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${code.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {code.isActive ? 'فعال' : 'غیرفعال'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="secondary" size="sm" className="ml-2" onClick={() => { setCurrentCode(code); setIsModalOpen(true); }}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(code.id)}>
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentCode.id ? 'ویرایش کد تخفیf' : 'ایجاد کد تخفیf'}>
        <div className="space-y-4">
          <Input label="کد" value={currentCode.code || ''} onChange={(e) => setCurrentCode({ ...currentCode, code: e.target.value })} />
          <Input label="مقدار" type="number" value={currentCode.value || ''} onChange={(e) => setCurrentCode({ ...currentCode, value: parseInt(e.target.value) })} />
          {/* Add other fields for discount management here */}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>لغو</Button>
            <Button onClick={handleSave}>ذخیره</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DiscountManagement;

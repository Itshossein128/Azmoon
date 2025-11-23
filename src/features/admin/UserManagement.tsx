import { useState, FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { mockUsers } from '../../data/mockData';
import { User } from '../../types';
import { Eye, FilePenLine, Trash2, Search, PlusCircle } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';

const userSchema = z.object({
  name: z.string().min(1, 'نام کاربری الزامی است'),
  email: z.string().email('ایمیل نامعتبر است'),
  role: z.enum(['student', 'teacher', 'admin']),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UserManagement() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('all');
  const usersPerPage = 5;

  const filteredUsers = users
    .filter(user =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(user => roleFilter === 'all' || user.role === roleFilter);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);

    const newTotalPages = Math.ceil(updatedUsers.filter(user =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === 'all' || user.role === roleFilter)
    ).length / usersPerPage);

    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages || 1);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setIsEditModalOpen(false);
  };

  const handleUpdateUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;

    const formData = new FormData(e.currentTarget);
    const updatedUser = {
      ...editingUser,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as 'student' | 'teacher' | 'admin',
    };

    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    closeEditModal();
  };

  const handleAddUser = (data: UserFormData) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      ...data,
      registeredAt: new Date().toLocaleDateString('fa-IR'),
      avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
    };

    setUsers([newUser, ...users]);
    setIsAddModalOpen(false);
  };

  const openViewModal = (user: User) => {
    setViewingUser(user);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewingUser(null);
    setIsViewModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">مدیریت کاربران</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="جستجو..."
              className="pl-10 pr-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">همه نقش‌ها</option>
              <option value="student">دانشجو</option>
              <option value="teacher">استاد</option>
              <option value="admin">ادمین</option>
            </select>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <PlusCircle size={20} />
            <span>افزودن کاربر</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-4 font-semibold">نام</th>
              <th className="p-4 font-semibold">ایمیل</th>
              <th className="p-4 font-semibold">نقش</th>
              <th className="p-4 font-semibold">تاریخ عضویت</th>
              <th className="p-4 font-semibold">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="p-4 flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  <span>{user.name}</span>
                </td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    user.role === 'admin' ? 'bg-red-100 text-red-700' :
                    user.role === 'teacher' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {user.role === 'admin' ? 'ادمین' : user.role === 'teacher' ? 'استاد' : 'دانشجو'}
                  </span>
                </td>
                <td className="p-4">{user.registeredAt}</td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button onClick={() => openViewModal(user)} className="text-gray-500 hover:text-blue-500 transition-colors">
                      <Eye size={20} />
                    </button>
                    <button onClick={() => openEditModal(user)} className="text-gray-500 hover:text-yellow-500 transition-colors">
                      <FilePenLine size={20} />
                    </button>
                    <button onClick={() => deleteUser(user.id)} className="text-gray-500 hover:text-red-500 transition-colors">
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

      {editingUser && (
        <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="ویرایش کاربر">
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <Input
              label="نام"
              name="name"
              defaultValue={editingUser.name}
              required
            />
            <Input
              label="ایمیل"
              name="email"
              type="email"
              defaultValue={editingUser.email}
              required
            />
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نقش</label>
              <select
                id="role"
                name="role"
                defaultValue={editingUser.role}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="student">دانشجو</option>
                <option value="teacher">استاد</option>
                <option value="admin">ادمین</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={closeEditModal}>لغو</Button>
              <Button type="submit">ذخیره تغییرات</Button>
            </div>
          </form>
        </Modal>
      )}

      {viewingUser && (
        <Modal isOpen={isViewModalOpen} onClose={closeViewModal} title="مشاهده کاربر">
          <div className="space-y-4">
            <div className="flex justify-center">
              <img src={viewingUser.avatar} alt={viewingUser.name} className="w-24 h-24 rounded-full object-cover" />
            </div>
            <div>
              <h3 className="font-semibold">نام</h3>
              <p>{viewingUser.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">ایمیل</h3>
              <p>{viewingUser.email}</p>
            </div>
            <div>
              <h3 className="font-semibold">نقش</h3>
              <p>{viewingUser.role}</p>
            </div>
            <div>
              <h3 className="font-semibold">تاریخ عضویت</h3>
              <p>{viewingUser.registeredAt}</p>
            </div>
            <div className="flex justify-end pt-4">
              <Button variant="secondary" onClick={closeViewModal}>بستن</Button>
            </div>
          </div>
        </Modal>
      )}

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="افزودن کاربر جدید">
        <form onSubmit={handleSubmit(handleAddUser)} className="space-y-4">
          <div>
            <Input
              label="نام"
              {...register('name')}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Input
              label="ایمیل"
              type="email"
              {...register('email')}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="add-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">نقش</label>
            <select
              id="add-role"
              name="role"
              defaultValue="student"
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="student">دانشجو</option>
              <option value="teacher">استاد</option>
              <option value="admin">ادمین</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>لغو</Button>
            <Button type="submit">افزودن</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import api from '../../config/api';
import { useUserStore } from '../../store/userStore';
import TeacherStudentManagement from './TeacherStudentManagement';

// Mock the user store
vi.mock('../../store/userStore', () => ({
  useUserStore: vi.fn(() => ({
    user: { id: 'teacher1', name: 'Teacher', role: 'teacher' },
    setUser: vi.fn(),
  })),
}));

// Mock the api module
vi.mock('../../config/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('TeacherStudentManagement', () => {
  it('should display loading state initially and then render students', async () => {
    const mockStudents = [
      { id: '2', name: 'کاربر تستی', email: 'test@test.com', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', completedExams: 1, averageScore: 88 },
      { id: '4', name: 'دانشجو جدید', email: 'student@test.com', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d', completedExams: 2, averageScore: 75 },
    ];

    vi.mocked(api.get).mockResolvedValue({ data: mockStudents });

    render(
      <BrowserRouter>
        <TeacherStudentManagement />
      </BrowserRouter>
    );

    expect(screen.getByText('در حال بارگذاری...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('کاربر تستی')).toBeInTheDocument();
      expect(screen.getByText('student@test.com')).toBeInTheDocument();
    });
  });

  it('should display an error message if the api call fails', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <TeacherStudentManagement />
      </BrowserRouter>
    );

    // Give the component a moment to update state after the API call fails
    await new Promise(r => setTimeout(r, 100));

    await waitFor(() => {
      expect(screen.getByText('خطا در دریافت لیست دانشجویان.')).toBeInTheDocument();
    });
  });
});

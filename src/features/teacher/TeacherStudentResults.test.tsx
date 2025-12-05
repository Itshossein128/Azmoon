import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import api from '../../config/api';
import { useUserStore } from '../../store/userStore';
import TeacherStudentResults from './TeacherStudentResults';

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

describe('TeacherStudentResults', () => {
  it('should display loading state and then render student results', async () => {
    const mockData = {
      student: { id: 'student1', name: 'دانشجوی نمونه' },
      results: [
        { id: 'res1', examTitle: 'آزمون شماره ۱', completedAt: new Date().toISOString(), percentage: 90, passed: true },
        { id: 'res2', examTitle: 'آزمون شماره ۲', completedAt: new Date().toISOString(), percentage: 45, passed: false },
      ],
    };

    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    render(
      <MemoryRouter initialEntries={['/teacher/students/student1']}>
        <Routes>
          <Route path="/teacher/students/:studentId" element={<TeacherStudentResults />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('در حال بارگذاری نتایج...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('نتایج آزمون‌های: دانشجوی نمونه')).toBeInTheDocument();
      expect(screen.getByText('آزمون شماره ۱')).toBeInTheDocument();
      expect(screen.getByText('قبول')).toBeInTheDocument();
      expect(screen.getByText('مردود')).toBeInTheDocument();
    });
  });

    it('should display an error message if the api call fails', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('API Error'));

    render(
      <MemoryRouter initialEntries={['/teacher/students/student1']}>
        <Routes>
          <Route path="/teacher/students/:studentId" element={<TeacherStudentResults />} />
        </Routes>
      </MemoryRouter>
    );

    // Give the component a moment to update state after the API call fails
    await new Promise(r => setTimeout(r, 100));

    await waitFor(() => {
        expect(screen.getByText('خطا در دریافت نتایج دانشجو.')).toBeInTheDocument();
    });
  });
});

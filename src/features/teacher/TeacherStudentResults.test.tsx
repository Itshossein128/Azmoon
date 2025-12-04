import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TeacherStudentResults from './TeacherStudentResults';
import { vi } from 'vitest';
import api from '../../config/api';
import useUserStore from '../../store/userStore';

// Mock the user store
vi.mock('../../store/userStore');

// Mock the api module
vi.mock('../../config/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('TeacherStudentResults', () => {
  it('renders the results page title and a result', async () => {
    // Mock the store's return value for this test
    vi.mocked(useUserStore).mockReturnValue({
      user: { id: 'teacher1', name: 'Teacher', role: 'teacher' },
      setUser: () => {},
    });

    const mockStudentResults = [
      {
        id: 'res1',
        examId: '1',
        userId: '2',
        status: 'pending_review',
        examTitle: 'آزمون جامع زبان انگلیسی',
        completedAt: '1403/03/01',
        score: undefined,
        totalScore: 100
      },
       {
        id: 'res2',
        examId: '3',
        userId: '2',
        status: 'graded',
        examTitle: 'آزمون ریاضیات عمومی ۱',
        completedAt: '1403/02/15',
        score: 92,
        totalScore: 100,
        passed: true,
      },
    ];

    // Mock the API response
    vi.mocked(api.get).mockResolvedValue({ data: mockStudentResults });

    render(
      <MemoryRouter initialEntries={['/teacher/students/2/results']}>
        <Routes>
            <Route path="/teacher/students/:studentId/results" element={<TeacherStudentResults />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('نتایج آزمون‌های دانشجو')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('آزمون جامع زبان انگلیسی')).toBeInTheDocument();
      expect(screen.getAllByText('در انتظار تصحیح').length).toBeGreaterThan(0);
    });
  });
});
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import StudentPerformanceReport from './StudentPerformanceReport';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockPerformanceData = {
  studentName: 'کاربر تستی',
  categories: [{ category: 'ریاضی', score: 85, total: 100, average: 78 }],
  overallScore: 83,
  completedExams: 12,
  strengths: ['علوم'],
  weaknesses: ['ادبیات'],
};

const mockProgressData = [
  { date: 'فروردین', score: 65 },
];

describe('StudentPerformanceReport', () => {
  beforeEach(() => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('/progress')) {
        return Promise.resolve({ data: mockProgressData });
      }
      return Promise.resolve({ data: mockPerformanceData });
    });
  });

  it('renders the student name and report title', async () => {
    render(
      <MemoryRouter initialEntries={['/student-report/2']}>
        <Routes>
          <Route path="/student-report/:userId" element={<StudentPerformanceReport />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('گزارش عملکرد دانشجو')).toBeInTheDocument();
      expect(screen.getByText('کاربر تستی')).toBeInTheDocument();
    });
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import GradingQueue from './GradingQueue';
import GradeSubmission from './GradeSubmission';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockPendingSubmissions = [
  { id: 'res1', examTitle: 'آزمون انگلیسی', userName: 'کاربر تستی', completedAt: '1403/01/01', status: 'pending_review', answers: {} },
];

const mockSubmissionDetail = {
  result: {
    id: 'res1',
    userId: 'user1',
    answers: [{ questionId: 'q1', answer: 'پاسخ تشریحی' }],
  },
  exam: {
    id: 'ex1',
    title: 'آزمون انگلیسی',
    questions: [
      { id: 'q1', text: 'سوال تشریحی', type: 'essay-with-upload', points: 10, gradingCriteria: 'وضوح متن' },
      { id: 'q2', text: 'سوال تستی', type: 'multiple-choice', options: ['A'], points: 5 },
    ],
  },
  user: {
    name: 'کاربر آزمایشی',
  }
};

describe('Grading Workflow', () => {
  beforeEach(() => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.endsWith('/results/pending')) {
        return Promise.resolve({ data: mockPendingSubmissions });
      }
      if (url.includes('/results/')) {
        return Promise.resolve({ data: mockSubmissionDetail });
      }
      return Promise.reject(new Error('not found'));
    });
  });

  afterEach(() => vi.clearAllMocks());

  it('should display pending submissions and navigate to the grading page', async () => {
    render(
      <MemoryRouter initialEntries={['/admin/grading']}>
        <Routes>
          <Route path="/admin/grading" element={<GradingQueue />} />
          <Route path="/admin/grading/:id" element={<GradeSubmission />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if the queue is displayed
    expect(await screen.findByText('آزمون انگلیسی')).toBeInTheDocument();
    expect(screen.getByText('کاربر تستی')).toBeInTheDocument();

    // Navigate to grading page
    fireEvent.click(screen.getByText('شروع تصحیح'));

    // Check if the grading page is displayed
    expect(await screen.findByText('تصحیح آزمون: آزمون انگلیسی')).toBeInTheDocument();
    expect(screen.getByText('کاربر: کاربر آزمایشی')).toBeInTheDocument();
    expect(await screen.findByText(/سوال تشریحی/)).toBeInTheDocument();
    expect(screen.getByText(/پاسخ تشریحی/)).toBeInTheDocument();
    expect(screen.getByLabelText('نمره')).toBeInTheDocument();
  });
});

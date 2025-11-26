import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ExamManagement from './ExamManagement';
import { vi } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');


const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockExams = [
  { id: '1', title: 'Exam 1', category: 'Category A', level: 'Easy', questions: [] },
  { id: '2', title: 'Exam 2', category: 'Category B', level: 'Hard', questions: [] },
];

const mockQuestions = [
  { id: 'q1', text: 'First amazing question' },
  { id: 'q2', text: 'Second awesome question' }
]

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('ExamManagement', () => {
  beforeEach(() => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/exams')) {
        return Promise.resolve({ data: mockExams });
      }
      if (url.includes('/questions')) {
        return Promise.resolve({ data: mockQuestions });
      }
      return Promise.reject(new Error('not found'));
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the exam management title and exams', async () => {
    renderWithRouter(<ExamManagement />);

    expect(await screen.findByText('مدیریت آزمون‌ها')).toBeInTheDocument();
    expect(await screen.findByText('Exam 1')).toBeInTheDocument();
    expect(await screen.findByText('Exam 2')).toBeInTheDocument();
  });

  it('should open the "add exam" modal and allow searching questions', async () => {
    renderWithRouter(<ExamManagement />);

    const addButton = await screen.findByText('افزودن آزمون');
    fireEvent.click(addButton);

    expect(await screen.findByText('افزودن آزمون جدید')).toBeInTheDocument();

    // Both questions should be visible initially
    expect(await screen.findByText('First amazing question')).toBeInTheDocument();
    expect(await screen.findByText('Second awesome question')).toBeInTheDocument();

    // Search for a specific question
    const searchInput = screen.getByPlaceholderText('جستجوی سوال...');
    fireEvent.change(searchInput, { target: { value: 'amazing' } });

    // Only the matching question should be visible
    expect(screen.getByText('First amazing question')).toBeInTheDocument();
    expect(screen.queryByText('Second awesome question')).not.toBeInTheDocument();
  });
});

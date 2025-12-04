import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ExamManagement from './ExamManagement';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockExams = [
  { id: '1', title: 'Exam 1', category: 'Category A', level: 'Easy', questions: [] },
];

const mockQuestions = [
  { id: 'q1', text: 'React Question 1', category: 'React' },
  { id: 'q2', text: 'React Question 2', category: 'React' },
  { id: 'q3', text: 'Vue Question 1', category: 'Vue' },
];

const mockCategories = [
  { id: 'c1', name: 'React', count: 2, icon: 'R' },
  { id: 'c2', name: 'Vue', count: 1, icon: 'V' },
];

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('ExamManagement with QuestionSelector', () => {
  beforeEach(() => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.endsWith('/exams')) return Promise.resolve({ data: mockExams });
      if (url.endsWith('/questions')) return Promise.resolve({ data: mockQuestions });
      if (url.endsWith('/categories')) return Promise.resolve({ data: mockCategories });
      return Promise.reject(new Error('not found'));
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should allow selecting a category and then searching for questions', async () => {
    renderWithRouter(<ExamManagement />);

    // Open the modal
    fireEvent.click(await screen.findByText('افزودن آزمون'));
    expect(await screen.findByText('افزودن آزمون جدید')).toBeInTheDocument();

    // Select a category
    const categorySelector = await screen.findByRole('combobox');
    fireEvent.change(categorySelector, { target: { value: 'React' } });

    // Only React questions should be visible now
    expect(await screen.findByText('React Question 1')).toBeInTheDocument();
    expect(await screen.findByText('React Question 2')).toBeInTheDocument();
    expect(screen.queryByText('Vue Question 1')).not.toBeInTheDocument();

    // Search within the selected category
    const searchInput = screen.getByPlaceholderText('جستجو در سوالات دسته "React"...');
    fireEvent.change(searchInput, { target: { value: 'Question 2' } });

    // Only the searched question should be visible
    expect(screen.queryByText('React Question 1')).not.toBeInTheDocument();
    expect(await screen.findByText('React Question 2')).toBeInTheDocument();
  });

  it('should render all form fields in the modal', async () => {
    renderWithRouter(<ExamManagement />);

    // Open the modal
    fireEvent.click(await screen.findByText('افزودن آزمون'));
    expect(await screen.findByText('افزودن آزمون جدید')).toBeInTheDocument();

    // Check for some of the added fields
    expect(screen.getByLabelText('نمره قبولی')).toBeInTheDocument();
    expect(screen.getByLabelText('قیمت (تومان)')).toBeInTheDocument();
    expect(screen.getByLabelText('تاریخ شروع')).toBeInTheDocument();
    expect(screen.getByLabelText('مدرس')).toBeInTheDocument();
  });

  it('should fetch teacher-specific exams when teacherId is provided', async () => {
    const teacherExams = [{ id: 't1', title: 'Teacher Exam', category: 'Category B', level: 'Medium', questions: [] }];
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/teacher/teacher-123/exams')) return Promise.resolve({ data: teacherExams });
      if (url.endsWith('/questions')) return Promise.resolve({ data: mockQuestions });
      if (url.endsWith('/categories')) return Promise.resolve({ data: mockCategories });
      return Promise.reject(new Error('not found'));
    });

    renderWithRouter(<ExamManagement teacherId="teacher-123" />);

    // Wait for the teacher's exam to be rendered
    expect(await screen.findByText('Teacher Exam')).toBeInTheDocument();
    // Ensure the general exam is not rendered
    expect(screen.queryByText('Exam 1')).not.toBeInTheDocument();
    // Verify the correct URL was called
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/teacher/teacher-123/exams'));
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ExamManagement from './ExamManagement';
import { vi } from 'vitest';
import axios from 'axios';

// Mock axios and QuestionSelector component
vi.mock('axios');
vi.mock('./components/QuestionSelector', () => ({
  default: ({ selectedQuestions, onChange }: { selectedQuestions: string[], onChange: (ids: string[]) => void }) => (
    <div>
      <span>Question Selector Mock</span>
      <button onClick={() => onChange([...selectedQuestions, 'q1'])}>Select Question</button>
    </div>
  )
}));


const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockExams = [
  { id: '1', title: 'Exam 1', category: 'Category A', level: 'Easy', questions: [] },
  { id: '2', title: 'Exam 2', category: 'Category B', level: 'Hard', questions: [] },
];

const mockQuestions = [
  { id: 'q1', text: 'Sample Question 1' }
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

  it('should open the "add exam" modal with the question selector', async () => {
    renderWithRouter(<ExamManagement />);

    const addButton = await screen.findByText('افزودن آزمون');
    fireEvent.click(addButton);

    expect(await screen.findByText('افزودن آزمون جدید')).toBeInTheDocument();
    expect(await screen.findByText('Question Selector Mock')).toBeInTheDocument();
  });

  it('should update the selected questions count when a question is selected', async () => {
    renderWithRouter(<ExamManagement />);

    const addButton = await screen.findByText('افزودن آزمون');
    fireEvent.click(addButton);

    // Initial count should be 0
    expect(await screen.findByText(/0 سوال انتخاب شده/)).toBeInTheDocument();

    const selectButton = await screen.findByText('Select Question');
    fireEvent.click(selectButton);

    // Count should update to 1
    await waitFor(() => {
      expect(screen.getByText(/1 سوال انتخاب شده/)).toBeInTheDocument();
    });
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import QuestionBank from './QuestionBank';
import { vi } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockQuestions = [
  { id: '1', text: 'Question 1', type: 'multiple-choice', options: ['A', 'B', 'C', 'D'], correctAnswer: 0, points: 5, examId: '1' },
  { id: '2', text: 'Question 2', type: 'multiple-choice', options: ['A', 'B', 'C', 'D'], correctAnswer: 1, points: 5, examId: '1' },
];

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('QuestionBank', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockQuestions });
    mockedAxios.post.mockResolvedValue({ data: { id: '3', text: 'New Question' } });
    mockedAxios.delete.mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the question bank title and questions', async () => {
    renderWithRouter(<QuestionBank />);

    expect(await screen.findByText('بانک سوالات')).toBeInTheDocument();
    expect(await screen.findByText('Question 1')).toBeInTheDocument();
    expect(await screen.findByText('Question 2')).toBeInTheDocument();
  });

  it('should open the "add question" modal when the button is clicked', async () => {
    renderWithRouter(<QuestionBank />);

    const addButton = await screen.findByText('افزودن سوال');
    fireEvent.click(addButton);

    expect(await screen.findByText('افزودن سوال جدید')).toBeInTheDocument();
  });

  it('should open the upload modal when the "آپلود دسته‌جمعی" button is clicked', async () => {
    renderWithRouter(<QuestionBank />);

    const uploadButton = await screen.findByText('آپلود دسته‌جمعی');
    fireEvent.click(uploadButton);

    expect(await screen.findByText('آپلود دسته‌جمعی سوالات')).toBeInTheDocument();
  });

});

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import QuestionBank from './QuestionBank';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockQuestions = [
  { id: '1', text: 'React Question', category: 'React', type: 'multiple-choice', options: ['A'], correctAnswer: 0, points: 5, examId: '1' },
  { id: '2', text: 'Vue Question', category: 'Vue', type: 'multiple-choice', options: ['A'], correctAnswer: 1, points: 5, examId: '1' },
];

const mockCategories = [
  { id: '1', name: 'React', count: 1, icon: 'R' },
  { id: '2', name: 'Vue', count: 1, icon: 'V' },
];

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('QuestionBank', () => {
  beforeEach(() => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.endsWith('/questions')) return Promise.resolve({ data: mockQuestions });
      if (url.endsWith('/categories')) return Promise.resolve({ data: mockCategories });
      return Promise.reject(new Error('not found'));
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render and filter questions by category', async () => {
    renderWithRouter(<QuestionBank />);

    expect(await screen.findByText('React Question')).toBeInTheDocument();
    expect(await screen.findByText('Vue Question')).toBeInTheDocument();

    const categoryFilter = screen.getByRole('combobox');
    fireEvent.change(categoryFilter, { target: { value: 'React' } });

    expect(await screen.findByText('React Question')).toBeInTheDocument();
    expect(screen.queryByText('Vue Question')).not.toBeInTheDocument();
  });

  it('should open the add question modal', async () => {
    renderWithRouter(<QuestionBank />);
    fireEvent.click(await screen.findByText('افزودن سوال'));
    expect(await screen.findByRole('heading', { name: 'افزودن سوال' })).toBeInTheDocument();
  });
});

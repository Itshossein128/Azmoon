import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    mockedAxios.post.mockResolvedValue({ data: {} });
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

  it('should correctly handle matching question creation', async () => {
    renderWithRouter(<QuestionBank />);
    fireEvent.click(await screen.findByText('افزودن سوال'));

    const typeSelector = screen.getByLabelText('Question Type');
    fireEvent.change(typeSelector, { target: { value: 'matching' } });

    await screen.findByText('صورت سوال‌ها (Prompts)');

    // Fill out form
    fireEvent.change(screen.getByLabelText('متن سوال'), { target: { value: 'Match the capitals' } });
    fireEvent.change(screen.getByLabelText('آدرس فایل رسانه‌ای (اختیاری)'), { target: { value: 'http://example.com/map.png' } });
    const categorySelect = screen.getAllByRole('combobox').find(el => el.getAttribute('name') === 'category');
    if (categorySelect) {
      fireEvent.change(categorySelect, { target: { value: 'React' } });
    }
    fireEvent.change(screen.getByLabelText('امتیاز'), { target: { value: '10' } });

    const promptInputs = screen.getAllByPlaceholderText(/آیتم \d+/);
    fireEvent.change(promptInputs[0], { target: { value: 'Iran' } });
    fireEvent.click(screen.getAllByText('افزودن آیتم')[0]);

    await screen.findByPlaceholderText('آیتم 2');
    const newPromptInputs = screen.getAllByPlaceholderText(/آیتم \d+/);
    fireEvent.change(newPromptInputs[1], { target: { value: 'France' } });

    const optionInputs = screen.getAllByPlaceholderText(/گزینه \d+/);
    fireEvent.change(optionInputs[0], { target: { value: 'Paris' } });
    fireEvent.click(screen.getAllByText('افزودن گزینه')[0]);

    await screen.findByPlaceholderText('گزینه 2');
    const newOptionInputs = screen.getAllByPlaceholderText(/گزینه \d+/);
    fireEvent.change(newOptionInputs[1], { target: { value: 'Tehran' } });

    // Set correct answers
    const selects = screen.getAllByRole('combobox');
    const answerSelects = selects.filter(s => s.closest('div')?.querySelector('span'));

    fireEvent.change(answerSelects[0], { target: { value: '1' } }); // Iran -> Tehran
    fireEvent.change(answerSelects[1], { target: { value: '0' } }); // France -> Paris

    fireEvent.click(screen.getByText('ذخیره'));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/questions'),
        expect.objectContaining({
          type: 'matching',
          text: 'Match the capitals',
          mediaUrl: 'http://example.com/map.png',
          prompts: ['Iran', 'France'],
          options: ['Paris', 'Tehran'],
          correctAnswer: [1, 0],
        })
      );
    });
  });
});

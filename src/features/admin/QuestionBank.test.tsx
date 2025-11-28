import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import QuestionBank from './QuestionBank';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockQuestions = [{ id: '1', text: 'React Question', category: 'React', type: 'multiple-choice', options: ['A'], correctAnswer: 0, points: 5, examId: '1' }];
const mockCategories = [{ id: '1', name: 'React', count: 1, icon: 'R' }];

const renderWithRouter = (ui: React.ReactElement) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('QuestionBank', () => {
  beforeEach(() => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.endsWith('/questions')) return Promise.resolve({ data: mockQuestions });
      if (url.endsWith('/categories')) return Promise.resolve({ data: mockCategories });
      return Promise.reject(new Error('not found'));
    });
    mockedAxios.post.mockResolvedValue({ data: {} });
  });

  afterEach(() => vi.clearAllMocks());

  it('should handle file upload and form submission', async () => {
    renderWithRouter(<QuestionBank />);
    fireEvent.click(await screen.findByText('افزودن سوال'));

    // Fill text fields
    fireEvent.change(screen.getByLabelText('متن سوال'), { target: { value: 'Test Question' } });

    const selectElement = screen.getByDisplayValue('انتخاب دسته‌بندی');
    fireEvent.change(selectElement, { target: { value: 'React' } });

    fireEvent.change(screen.getByLabelText('امتیاز'), { target: { value: '10' } });

    // Fill options for the default multiple-choice type
    fireEvent.change(screen.getByPlaceholderText('گزینه 1'), { target: { value: 'Option A' } });
    fireEvent.change(screen.getByPlaceholderText('گزینه 2'), { target: { value: 'Option B' } });
    fireEvent.change(screen.getByPlaceholderText('گزینه 3'), { target: { value: 'Option C' } });
    fireEvent.change(screen.getByPlaceholderText('گزینه 4'), { target: { value: 'Option D' } });

    // Simulate file upload
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/فایل رسانه‌ای/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit the form
    fireEvent.click(screen.getByText('ذخیره'));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
      const formData = mockedAxios.post.mock.calls[0][1] as FormData;
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('mediaFile')).toEqual(file);
      expect(formData.get('text')).toBe('Test Question');
      expect(formData.get('category')).toBe('React');
    });
  });
});

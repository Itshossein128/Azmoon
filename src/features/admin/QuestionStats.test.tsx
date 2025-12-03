import { render, screen, waitFor } from '@testing-library/react';
import QuestionStats from './QuestionStats';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockQuestionStats = [
  { id: '1', text: 'کدام یک از موارد زیر یک فعل کمکی در زبان انگلیسی است؟', correctPercentage: 88, totalAnswers: 150 },
];

describe('QuestionStats', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockQuestionStats });
  });

  it('renders the page title and export buttons', async () => {
    render(<QuestionStats />);
    await waitFor(() => {
      expect(screen.getByText('آمار تفکیکی سوالات')).toBeInTheDocument();
      expect(screen.getByText('Excel')).toBeInTheDocument();
      expect(screen.getByText('PDF')).toBeInTheDocument();
    });
  });

  it('renders the question statistics table', async () => {
    render(<QuestionStats />);
    await waitFor(() => {
      expect(screen.getByText('کدام یک از موارد زیر یک فعل کمکی در زبان انگلیسی است؟')).toBeInTheDocument();
      expect(screen.getByText('88%')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
    });
  });
});

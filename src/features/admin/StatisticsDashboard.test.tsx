import { render, screen, waitFor } from '@testing-library/react';
import StatisticsDashboard from './StatisticsDashboard';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.get.mockResolvedValue({ data: { totalUsers: 1, totalExams: 2, totalCompletedExams: 3 } });

describe('StatisticsDashboard', () => {
  it('renders the dashboard title', () => {
    render(<StatisticsDashboard />);
    expect(screen.getByText('آمار پیشرفته')).toBeInTheDocument();
  });

  it('renders the stat cards', async () => {
    render(<StatisticsDashboard />);
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });
});

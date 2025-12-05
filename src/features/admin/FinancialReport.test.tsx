import { render, screen, waitFor } from '@testing-library/react';
import FinancialReport from './FinancialReport';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockFinancialData = {
  totalRevenue: 54500000,
  monthlyRevenue: 7800000,
  newSubscriptions: 152,
  revenueTrend: [],
  revenueBreakdown: [],
  topSellingExams: [{ id: '7', title: 'آزمون آیلتس', sales: 120, revenue: 18000000 }],
};

describe('FinancialReport', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockFinancialData });
  });

  it('renders the page title and export buttons', async () => {
    render(<FinancialReport />);
    await waitFor(() => {
      expect(screen.getByText('گزارش مالی')).toBeInTheDocument();
      expect(screen.getByText('خروجی Excel')).toBeInTheDocument();
      expect(screen.getByText('خروجی PDF')).toBeInTheDocument();
    });
  });

  it('renders the stat cards', async () => {
    render(<FinancialReport />);
    await waitFor(() => {
      expect(screen.getByText('درآمد کل')).toBeInTheDocument();
      expect(screen.getByText('درآمد این ماه')).toBeInTheDocument();
      expect(screen.getByText('اشتراک‌های جدید (ماهانه)')).toBeInTheDocument();
    });
  });

  it('renders the top selling exams table', async () => {
    render(<FinancialReport />);
    await waitFor(() => {
      expect(screen.getByText('پرفروش‌ترین آزمون‌ها')).toBeInTheDocument();
      expect(screen.getByText('آزمون آیلتس')).toBeInTheDocument();
    });
  });
});

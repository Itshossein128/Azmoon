import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CategoryManagement from './CategoryManagement';
import { vi } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockCategories = [
  { id: '1', name: 'Category 1', icon: 'C1', count: 5 },
  { id: '2', name: 'Category 2', icon: 'C2', count: 10 },
];

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('CategoryManagement', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockCategories });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the category management title and categories', async () => {
    renderWithRouter(<CategoryManagement />);

    expect(await screen.findByText('مدیریت دسته‌بندی‌ها')).toBeInTheDocument();
    expect(await screen.findByText('Category 1')).toBeInTheDocument();
    expect(await screen.findByText('Category 2')).toBeInTheDocument();
  });

  it('should open the "add category" modal when the button is clicked', async () => {
    renderWithRouter(<CategoryManagement />);

    const addButton = await screen.findByText('افزودن دسته‌بندی');
    fireEvent.click(addButton);

    expect(await screen.findByText('افزودن دسته‌بندی جدید')).toBeInTheDocument();
  });

  it('should filter categories based on search term', async () => {
    renderWithRouter(<CategoryManagement />);

    const searchInput = await screen.findByPlaceholderText('جستجوی دسته‌بندی...');
    fireEvent.change(searchInput, { target: { value: 'Category 1' } });

    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.queryByText('Category 2')).not.toBeInTheDocument();
  });
});

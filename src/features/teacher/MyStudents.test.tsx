import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyStudents from './MyStudents';
import { vi } from 'vitest';
import api from '../../config/api';
import useUserStore from '../../store/userStore';

// Mock the user store
vi.mock('../../store/userStore');

// Mock the api module
vi.mock('../../config/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('MyStudents', () => {
  it('renders the page title and student list', async () => {
    // Mock the store's return value for this test
    vi.mocked(useUserStore).mockReturnValue({
      user: { id: 'teacher1', name: 'Teacher', role: 'teacher' },
      setUser: () => {},
    });

    const mockStudents = [
      {
        id: '2',
        name: 'کاربر تستی',
        email: 'test@test.com',
        role: 'student',
        registeredAt: '1403/01/15',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      },
      {
        id: '4',
        name: 'دانشجو جدید',
        email: 'student@test.com',
        role: 'student',
        registeredAt: '1403/02/05',
        avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d',
      },
    ];

    // Mock the API response
    vi.mocked(api.get).mockResolvedValue({ data: mockStudents });

    render(
      <BrowserRouter>
        <MyStudents />
      </BrowserRouter>
    );

    expect(screen.getByText('دانشجویان من')).toBeInTheDocument();

    // Wait for the students to be loaded and displayed
    await waitFor(() => {
      expect(screen.getByText('کاربر تستی')).toBeInTheDocument();
      expect(screen.getByText('student@test.com')).toBeInTheDocument();
    });
  });
});
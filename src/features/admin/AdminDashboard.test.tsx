import { render, screen } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';

describe('AdminDashboard', () => {
  it('renders the admin dashboard with correct title', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('داشبورد ادمین')).toBeInTheDocument();
  });
});

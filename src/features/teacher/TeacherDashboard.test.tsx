import { render, screen } from '@testing-library/react';
import TeacherDashboard from './TeacherDashboard';

describe('TeacherDashboard', () => {
  it('renders the welcome message', () => {
    render(<TeacherDashboard />);
    expect(screen.getByText('به پنل مدرس خوش آمدید')).toBeInTheDocument();
  });
});

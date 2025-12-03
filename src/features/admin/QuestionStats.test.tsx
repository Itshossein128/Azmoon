import { render, screen } from '@testing-library/react';
import QuestionStats from './QuestionStats';

describe('QuestionStats', () => {
  it('renders the page title', () => {
    render(<QuestionStats />);
    expect(screen.getByText('آمار تفکیکی سوالات')).toBeInTheDocument();
  });

  it('renders the question statistics table', () => {
    render(<QuestionStats />);
    expect(screen.getByText('کدام یک از موارد زیر یک فعل کمکی در زبان انگلیسی است؟')).toBeInTheDocument();
    expect(screen.getByText('88%')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });
});

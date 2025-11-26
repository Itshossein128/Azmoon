import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface AlertProps {
  message: string;
  type: 'error' | 'success' | 'warning';
}

export default function Alert({ message, type }: AlertProps) {
  const Svg = {
    error: <AlertCircle />,
    success: <CheckCircle />,
    warning: <AlertTriangle />
  }[type];

  const colors = {
    error: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  }[type];

  return (
    <div className={`border p-4 rounded-lg flex items-center ${colors}`} role="alert">
      <div className="mr-2">{Svg}</div>
      <p className="font-bold">{message}</p>
    </div>
  );
}

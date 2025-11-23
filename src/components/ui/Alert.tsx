import { AlertCircle, X } from 'lucide-react';

interface AlertProps {
  message: string;
  onClose?: () => void;
}

export default function Alert({ message, onClose }: AlertProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg p-4 flex justify-between items-center">
      <div className="flex items-center">
        <AlertCircle className="text-red-500 mr-3" />
        <p className="text-red-700 dark:text-red-300">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-red-500 hover:text-red-700">
          <X size={20} />
        </button>
      )}
    </div>
  );
}

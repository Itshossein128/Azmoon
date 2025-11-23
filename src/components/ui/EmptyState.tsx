interface EmptyStateProps {
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({ message, actionText, onAction }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 dark:text-gray-400 mb-4">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

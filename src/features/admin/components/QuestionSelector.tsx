import { useState, useEffect } from 'react';
import axios from 'axios';
import { Question } from '../../../../shared/types';
import { API_URL } from '../../../config/api';
import Spinner from '../../../components/ui/Spinner';
import Alert from '../../../components/ui/Alert';

interface QuestionSelectorProps {
  selectedQuestions: string[];
  onChange: (selectedIds: string[]) => void;
}

export default function QuestionSelector({ selectedQuestions, onChange }: QuestionSelectorProps) {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/questions`);
        setAllQuestions(response.data);
        setError(null);
      } catch (err) {
        setError('خطا در بارگذاری سوالات از بانک سوالات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllQuestions();
  }, []);

  const handleSelect = (questionId: string) => {
    const isSelected = selectedQuestions.includes(questionId);
    if (isSelected) {
      onChange(selectedQuestions.filter(id => id !== questionId));
    } else {
      onChange([...selectedQuestions, questionId]);
    }
  };

  if (loading) return <Spinner size="sm" />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="border rounded-lg p-4 max-h-72 overflow-y-auto bg-gray-50 dark:bg-gray-700/50">
      <div className="space-y-3">
        {allQuestions.length > 0 ? (
          allQuestions.map(question => (
            <div key={question.id} className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600">
              <input
                type="checkbox"
                id={`q-${question.id}`}
                checked={selectedQuestions.includes(question.id)}
                onChange={() => handleSelect(question.id)}
                className="ml-3 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor={`q-${question.id}`} className="flex-1 text-sm text-gray-800 dark:text-gray-200 cursor-pointer">
                {question.text}
              </label>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">هیچ سوالی در بانک سوالات یافت نشد.</p>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, AlertCircle, ChevronRight, ChevronLeft, Flag, Eye } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Exam, Question, Result, User } from '../../../shared/types';
import { useUserStore } from '../../store/userStore';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import { API_URL } from '../../config/api';
import Modal from '../../components/ui/Modal';

export default function ExamTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useUserStore(state => state.user);

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/exams/${id}`);
        setExam(response.data);
        setTimeLeft(response.data.duration * 60);
        setError(null);
      } catch (err) {
        setError('خطا در دریافت اطلاعات آزمون');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchExam();
    }
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const goToNextQuestion = () => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const toggleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (!exam || !user) return;

    try {
      const submission = {
        examId: exam.id,
        userId: user.id,
        answers,
        timeLeft
      };
      const response = await axios.post(`${API_URL}/results`, submission);
      const newResult: Result = response.data;
      navigate(`/results/${newResult.id}`);
    } catch (err) {
      setError('خطا در ثبت نتیجه آزمون');
      console.error(err);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert message={error} type="error" />;
  if (!exam) return <Alert message="آزمون یافت نشد" type="error" />;

  const currentQuestion = exam.questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isCurrentQuestionFlagged = flaggedQuestions.has(currentQuestion.id);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-grow">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-500">{exam.category}</p>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{exam.title}</h1>
            </div>
            <div className="flex items-center gap-4 text-lg font-bold text-red-500 bg-red-100 dark:bg-red-900/50 px-4 py-2 rounded-lg">
              <Clock size={24} />
              <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                سوال {currentQuestionIndex + 1} از {exam.questions.length}
              </p>
              <Button variant={isCurrentQuestionFlagged ? "danger" : "outline"} size="sm" onClick={() => toggleFlagQuestion(currentQuestion.id)} className="flex items-center gap-2">
                <Flag size={16} />
                <span>{isCurrentQuestionFlagged ? 'حذف علامت' : 'علامت گذاری'}</span>
              </Button>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{currentQuestion.text}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                  className={`p-4 rounded-lg text-right border-2 transition-all duration-200 ${
                    answers[currentQuestion.id] === index
                      ? 'bg-primary-500 border-primary-500 text-white shadow-lg scale-105'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>
              <ChevronRight className="ml-2" />
              سوال قبلی
            </Button>
            {currentQuestionIndex === exam.questions.length - 1 ? (
              <Button onClick={handleSubmit} variant="success">
                پایان و ثبت آزمون
              </Button>
            ) : (
              <Button onClick={goToNextQuestion}>
                سوال بعدی
                <ChevronLeft className="mr-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg sticky top-8">
          <h3 className="text-xl font-bold mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">وضعیت سوالات</h3>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {exam.questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold border-2 transition-colors relative ${
                  index === currentQuestionIndex
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : answers[q.id] !== undefined
                      ? 'bg-green-100 dark:bg-green-800/50 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                      : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {flaggedQuestions.has(q.id) && <Flag size={12} className="absolute top-1 right-1 text-red-500" />}
                {index + 1}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <Button variant="outline" className="w-full flex justify-center gap-2" onClick={() => setIsReviewModalOpen(true)}>
              <Eye size={20} />
              <span>مرور کلی آزمون</span>
            </Button>
            <Button variant="danger" className="w-full flex justify-center gap-2" onClick={handleSubmit}>
              <AlertCircle size={20} />
              <span>پایان آزمون</span>
            </Button>
          </div>
        </div>
      </div>

      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="مرور کلی آزمون">
        <div className="max-h-96 overflow-y-auto">
          {exam.questions.map((q, index) => (
            <div key={q.id} className="mb-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex justify-between items-center">
                <p className="font-semibold">سوال {index + 1}: {q.text}</p>
                <Button size="sm" onClick={() => { setCurrentQuestionIndex(index); setIsReviewModalOpen(false); }}>برو به سوال</Button>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className={`px-2 py-1 rounded-full ${answers[q.id] !== undefined ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {answers[q.id] !== undefined ? 'پاسخ داده شده' : 'پاسخ نداده'}
                </span>
                {flaggedQuestions.has(q.id) && (
                  <span className="flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 mr-2">
                    <Flag size={14} className="ml-1" />
                    علامت‌گذاری شده
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>

    </div>
  );
}

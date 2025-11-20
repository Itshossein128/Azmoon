import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, ChevronRight, ChevronLeft, Flag, Eye } from 'lucide-react';
import Button from '../../components/ui/Button';
import { mockExams } from '../../data/mockData';
import { Exam, Question, Result } from '../../types';
import { useUserStore } from '../../store/userStore';

export default function ExamTake() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());

  const handleSubmit = useCallback(() => {
    if (!exam || !user) return;

    let score = 0;
    let correctAnswers = 0;
    const userAnswers: number[] = [];

    questions.forEach((q) => {
      const answerIndex = answers[q.id];
      userAnswers.push(answerIndex);
      if (answerIndex !== undefined && answerIndex === q.correctAnswer) {
        score += q.points;
        correctAnswers++;
      }
    });

    const totalScore = questions.reduce((acc, q) => acc + q.points, 0);
    const percentage = Math.round((score / totalScore) * 100);
    const passed = percentage >= exam.passingScore;

    const newResult: Result = {
      id: new Date().toISOString(),
      examId: exam.id,
      userId: user.id,
      score,
      totalScore,
      percentage,
      passed,
      completedAt: new Date().toISOString(),
      timeSpent: Math.floor((exam.duration * 60 - timeLeft) / 60),
      answers: userAnswers,
      correctAnswers,
    };

    localStorage.removeItem(`examState-${id}`);
    navigate(`/results/${newResult.id}`, { state: { result: newResult, exam } });
  }, [exam, user, questions, answers, timeLeft, navigate, id]);

  useEffect(() => {
    const examData = mockExams.find(e => e.id === id);
    if (examData) {
      setExam(examData);
      setQuestions(examData.questions || []);

      const savedState = localStorage.getItem(`examState-${id}`);
      if (savedState) {
        const { currentQuestion, answers, timeLeft } = JSON.parse(savedState);
        setCurrentQuestion(currentQuestion);
        setAnswers(answers);
        setTimeLeft(timeLeft);
      } else {
        setTimeLeft(examData.duration * 60);
      }
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(`examState-${id}`, JSON.stringify({ currentQuestion, answers, timeLeft }));
    }
  }, [id, currentQuestion, answers, timeLeft, loading]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">آزمون یافت نشد</h2>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            سوالی برای این آزمون یافت نشد.
          </h2>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const toggleFlag = (index: number) => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(index)) {
      newFlagged.delete(index);
    } else {
      newFlagged.add(index);
    }
    setFlaggedQuestions(newFlagged);
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  if (showReview) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">مرور آزمون</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((q, i) => (
            <div key={q.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">سوال {i + 1}</h2>
                {flaggedQuestions.has(i) && <Flag className="w-5 h-5 text-yellow-500" />}
              </div>
              <p className="mb-4">{q.text}</p>
              <p>پاسخ شما: {answers[q.id] !== undefined ? q.options?.[answers[q.id]] : 'پاسخ نداده اید'}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={() => setShowReview(false)}>بازگشت به آزمون</Button>
          <Button onClick={() => setShowSubmitConfirm(true)} variant="primary">ثبت نهایی</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{exam.title}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">سوال {currentQuestion + 1} از {questions.length}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-primary-100 text-primary-700'}`}>
                <Clock className="w-5 h-5" />
                <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
              </div>

              <button
                onClick={() => setShowReview(true)}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-bold"
              >
                <Eye className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold"
              >
                ثبت نهایی
              </button>
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-primary-100 text-primary-700 px-4 py-1 rounded-full font-bold">
                      سوال {currentQuestion + 1}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {questions[currentQuestion].points} امتیاز
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 leading-relaxed">
                    {questions[currentQuestion].text}
                  </h2>
                </div>

                <button
                  onClick={() => toggleFlag(currentQuestion)}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestion)
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600'
                  }`}
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              {questions[currentQuestion].imageUrl && (
                <img
                  src={questions[currentQuestion].imageUrl}
                  alt="تصویر سوال"
                  className="w-full max-h-64 object-contain mb-6 rounded-lg"
                />
              )}

              <div className="space-y-4">
                {questions[currentQuestion].options?.map((option, index) => {
                  const questionId = questions[currentQuestion].id;
                  const isSelected = answers[questionId] === index;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(questionId, index)}
                      className={`w-full text-right p-5 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/50 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {isSelected && <div className="w-3 h-3 bg-white rounded-full"></div>}
                        </div>
                        <span className={`text-lg ${isSelected ? 'font-bold text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t dark:border-gray-700">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                  <span>سوال قبل</span>
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {answeredCount} از {questions.length} سوال پاسخ داده شده
                  </p>
                </div>

                <button
                  onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                  disabled={currentQuestion === questions.length - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>سوال بعد</span>
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-32">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">نمای کلی سوالات</h3>

              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((_, index) => {
                  const questionId = questions[index].id;
                  const isAnswered = Object.prototype.hasOwnProperty.call(answers, questionId);
                  const isCurrent = index === currentQuestion;
                  const isFlagged = flaggedQuestions.has(index);

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`aspect-square rounded-lg font-bold text-sm transition-all relative ${
                        isCurrent
                          ? 'bg-primary-600 text-white ring-2 ring-primary-600 ring-offset-2'
                          : isAnswered
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {index + 1}
                      {isFlagged && (
                        <Flag className="w-3 h-3 absolute top-0 left-0 text-yellow-500 fill-yellow-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-100 rounded"></div>
                  <span className="text-gray-700 dark:text-gray-300">پاسخ داده شده</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded"></div>
                  <span className="text-gray-700 dark:text-gray-300">بدون پاسخ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary-600 rounded"></div>
                  <span className="text-gray-700 dark:text-gray-300">سوال فعلی</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    پس از ثبت نهایی امکان تغییر پاسخ‌ها وجود ندارد
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">ثبت نهایی آزمون</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              آیا از ثبت نهایی آزمون اطمینان دارید؟ شما به {answeredCount} سوال از {questions.length} سوال پاسخ داده‌اید.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold"
              >
                بله، ثبت نهایی
              </button>
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-bold"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

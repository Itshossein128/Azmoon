import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, ChevronRight, ChevronLeft, Flag } from 'lucide-react';
import { getExamById } from '../../services/api';
import { Exam, Question } from '../../types';

export default function ExamTake() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());

  const handleSubmit = useCallback(() => {
    if (exam) {
      navigate(`/results/${exam.id}`);
    }
  }, [navigate, exam]);

  useEffect(() => {
    const fetchExam = async () => {
      if (!id) return;
      try {
        const examData = await getExamById(id);
        setExam(examData);
        // Assuming questions are part of the exam data
        setQuestions(examData.questions || []);
        setTimeLeft(examData.duration * 60);
      } catch (error) {
        console.error('Failed to fetch exam:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">آزمون یافت نشد</h2>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{exam.title}</h1>
              <p className="text-sm text-gray-600">سوال {currentQuestion + 1} از {questions.length}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-primary-100 text-primary-700'}`}>
                <Clock className="w-5 h-5" />
                <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
              </div>

              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold"
              >
                ثبت نهایی
              </button>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
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
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-primary-100 text-primary-700 px-4 py-1 rounded-full font-bold">
                      سوال {currentQuestion + 1}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {questions[currentQuestion].points} امتیاز
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
                    {questions[currentQuestion].text}
                  </h2>
                </div>

                <button
                  onClick={() => toggleFlag(currentQuestion)}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestion)
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600'
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
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-3 h-3 bg-white rounded-full"></div>}
                        </div>
                        <span className={`text-lg ${isSelected ? 'font-bold text-primary-700' : 'text-gray-700'}`}>
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                  <span>سوال قبل</span>
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
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
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-32">
              <h3 className="font-bold text-gray-800 mb-4">نمای کلی سوالات</h3>

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
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                  <span className="text-gray-700">پاسخ داده شده</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 rounded"></div>
                  <span className="text-gray-700">بدون پاسخ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary-600 rounded"></div>
                  <span className="text-gray-700">سوال فعلی</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800">
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
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">ثبت نهایی آزمون</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
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
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-bold"
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

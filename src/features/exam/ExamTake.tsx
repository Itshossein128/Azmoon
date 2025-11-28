
import { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, AlertCircle, ChevronRight, ChevronLeft, Flag, Eye, UploadCloud, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, OnDragEndResponder } from '@hello-pangea/dnd';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Exam, Question, Result } from '../../../shared/types';
import { useUserStore } from '../../store/userStore';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import { API_URL } from '../../config/api';
import Modal from '../../components/ui/Modal';

interface MatchedPair {
  prompt: string;
  option: string | null;
}
interface MatchingState {
  pairs: MatchedPair[];
  unmatchedOptions: string[];
}

export default function ExamTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useUserStore(state => state.user);

  type Answer = number | number[] | string | { text: string; file?: File };
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: Answer }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [matchingState, setMatchingState] = useState<MatchingState>({ pairs: [], unmatchedOptions: [] });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isConfirmSubmitModalOpen, setIsConfirmSubmitModalOpen] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/exams/${id}`);
        setExam(response.data);
        setTimeLeft(response.data.duration * 60);
      } catch (err) {
        setError('خطا در دریافت اطلاعات آزمون');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchExam();
  }, [id]);

  useEffect(() => {
    const currentQuestion = exam?.questions[currentQuestionIndex];
    if (currentQuestion?.type === 'matching' && currentQuestion.prompts && currentQuestion.options) {
        const currentAnswer = answers[currentQuestion.id] as number[] | undefined;
        const pairs: MatchedPair[] = currentQuestion.prompts.map((prompt, index) => {
            const optionIndex = currentAnswer?.[index];
            const option = (optionIndex !== undefined && optionIndex !== -1 && currentQuestion.options) ? currentQuestion.options[optionIndex] : null;
            return { prompt, option };
        });

        const matchedOptions = pairs.map(p => p.option).filter((o): o is string => o !== null);
        const unmatchedOptions = currentQuestion.options.filter(o => !matchedOptions.includes(o));

        setMatchingState({ pairs, unmatchedOptions });
    }
  }, [currentQuestionIndex, exam, answers]);

  useEffect(() => {
    if (timeLeft <= 0) {
        handleFinalSubmit();
        return;
    };
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionId: string, value: Answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleEssayAnswerChange = (questionId: string, text: string) => {
    const currentAnswer = (answers[questionId] as { text: string; file?: File }) || { text: '' };
    handleAnswerChange(questionId, { ...currentAnswer, text });
  };

  const handleFileChange = (questionId: string, file: File | undefined) => {
    const currentAnswer = (answers[questionId] as { text: string; file?: File }) || { text: '' };
    handleAnswerChange(questionId, { ...currentAnswer, file });
  };

  const onDragEnd: OnDragEndResponder = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const currentQuestion = exam?.questions[currentQuestionIndex];
    if (currentQuestion?.type !== 'matching') return;

    let newPairs = [...matchingState.pairs];
    let newUnmatched = [...matchingState.unmatchedOptions];
    let draggedItem: string | null = null;

    if (source.droppableId === 'unmatched') {
      draggedItem = newUnmatched.splice(source.index, 1)[0];
    } else if (source.droppableId.startsWith('pair-')) {
      const pairIndex = parseInt(source.droppableId.split('-')[1]);
      draggedItem = newPairs[pairIndex].option;
      newPairs[pairIndex].option = null;
    }

    if (!draggedItem) return;

    if (destination.droppableId === 'unmatched') {
      newUnmatched.splice(destination.index, 0, draggedItem);
    } else if (destination.droppableId.startsWith('pair-')) {
      const pairIndex = parseInt(destination.droppableId.split('-')[1]);
      const existingItem = newPairs[pairIndex].option;
      if (existingItem) {
        newUnmatched.push(existingItem);
      }
      newPairs[pairIndex].option = draggedItem;
    }

    setMatchingState({ pairs: newPairs, unmatchedOptions: newUnmatched });

    const originalOptions = currentQuestion.options || [];
    const newAnswer = newPairs.map(p => p.option ? originalOptions.indexOf(p.option) : -1);
    handleAnswerChange(currentQuestion.id, newAnswer);
  };

  const handleMultiChoiceAnswer = (question: Question, optionIndex: number) => {
    const questionId = question.id;
    if (question.type === 'multiple-answer') {
        const currentAnswers = (answers[questionId] as number[] | undefined) || [];
        const newAnswers = currentAnswers.includes(optionIndex) ? currentAnswers.filter(ans => ans !== optionIndex) : [...currentAnswers, optionIndex];
        handleAnswerChange(questionId, newAnswers);
    } else {
        handleAnswerChange(questionId, optionIndex);
    }
  };

  const goToNextQuestion = () => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) setCurrentQuestionIndex(prev => prev + 1);
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
  };

  const toggleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) newSet.delete(questionId);
      else newSet.add(questionId);
      return newSet;
    });
  };

  const handleSubmitAttempt = () => {
    if (!exam) return;
    const unanswered = exam.questions.filter(q => answers[q.id] === undefined).length;
    if (unanswered > 0) setIsConfirmSubmitModalOpen(true);
    else handleFinalSubmit();
  };

  const handleFinalSubmit = async () => {
    if (!exam || !user) return;
    setIsConfirmSubmitModalOpen(false);
    try {
        const formData = new FormData();
        formData.append('examId', exam.id);
        formData.append('userId', user.id);
        formData.append('timeLeft', timeLeft.toString());
        const jsonAnswers: { [key: string]: any } = {};
        exam.questions.forEach(q => {
            const answer = answers[q.id];
            if (answer !== undefined) {
                if (q.type === 'essay-with-upload') {
                    const essayAnswer = answer as { text: string; file?: File };
                    jsonAnswers[q.id] = { text: essayAnswer.text };
                    if (essayAnswer.file) formData.append(`file-${q.id}`, essayAnswer.file);
                } else {
                    jsonAnswers[q.id] = answer;
                }
            }
        });
        formData.append('answers', JSON.stringify(jsonAnswers));
        const response = await axios.post(`${API_URL}/results`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        const newResult: Result = response.data;
        if (newResult.status === 'pending_review') navigate('/results/pending-review');
        else navigate(`/results/${newResult.id}`);
    } catch (err) {
      setError('خطا در ثبت نتیجه آزمون');
    }
  };

    if (loading) return <Spinner />;
    if (error) return <Alert message={error} type="error" />;
    if (!exam) return <Alert message="آزمون یافت نشد" type="error" />;

    const currentQuestion = exam.questions[currentQuestionIndex];
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isCurrentQuestionFlagged = flaggedQuestions.has(currentQuestion.id);
    const unansweredQuestionsCount = exam.questions.filter(q => answers[q.id] === undefined).length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="flex justify-between items-center mb-6 pb-6 border-b dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-500">{exam.category}</p>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{exam.title}</h1>
                </div>
                <div className="flex items-center gap-4 text-lg font-bold text-red-500 bg-red-100 dark:bg-red-900/50 px-4 py-2 rounded-lg">
                  <Clock size={24} />
                  <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">سوال {currentQuestionIndex + 1} از {exam.questions.length}</p>
                  <Button variant={isCurrentQuestionFlagged ? "danger" : "outline"} size="sm" onClick={() => toggleFlagQuestion(currentQuestion.id)} className="flex items-center gap-2">
                    <Flag size={16} />
                    <span>{isCurrentQuestionFlagged ? 'حذف علامت' : 'علامت گذاری'}</span>
                  </Button>
                </div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{currentQuestion.text}</h2>

                {(() => {
                    switch (currentQuestion.type) {
                        case 'matching':
                            return (
                                <div className="mt-4">
                                  <DragDropContext onDragEnd={onDragEnd}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                      <div className="space-y-4">
                                        {matchingState.pairs.map((pair, index) => (
                                          <div key={index} className="flex items-center gap-4">
                                            <div className="flex-1 h-16 flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg font-semibold">{pair.prompt}</div>
                                            <Droppable droppableId={`pair-${index}`} key={`drop-${index}`}>
                                              {(provided, snapshot) => (
                                                <div ref={provided.innerRef} {...provided.droppableProps} className={`flex-1 h-16 p-2 rounded-lg border-2 ${snapshot.isDraggingOver ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-dashed border-gray-300 dark:border-gray-600'}`}>
                                                  {pair.option && (
                                                    <Draggable draggableId={pair.option} index={0}>
                                                      {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="h-full flex items-center justify-center p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                                                          {pair.option}
                                                        </div>
                                                      )}
                                                    </Draggable>
                                                  )}
                                                  {provided.placeholder}
                                                </div>
                                              )}
                                            </Droppable>
                                          </div>
                                        ))}
                                      </div>
                                      <div>
                                        <h3 className="font-semibold text-center mb-4">گزینه‌ها</h3>
                                        <Droppable droppableId="unmatched" key="unmatched-drop">
                                          {(provided, snapshot) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps} className={`p-4 rounded-lg min-h-[200px] ${snapshot.isDraggingOver ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900/50'}`}>
                                              {matchingState.unmatchedOptions.map((option, index) => (
                                                <Draggable key={option} draggableId={option} index={index}>
                                                  {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-3 mb-2 bg-white dark:bg-gray-800 rounded-md shadow-sm flex items-center">
                                                      <GripVertical className="text-gray-400 mr-2" />
                                                      {option}
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                              {provided.placeholder}
                                            </div>
                                          )}
                                        </Droppable>
                                      </div>
                                    </div>
                                  </DragDropContext>
                                </div>
                            );
                        case 'fill-in-the-blank':
                            return <Input type="text" placeholder="پاسخ..." value={(answers[currentQuestion.id] as string) || ''} onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)} />;
                        case 'essay-with-upload':
                            return (
                                <div className="space-y-4">
                                    <textarea placeholder="پاسخ تشریحی..." rows={8} className="w-full p-4 border rounded-lg dark:bg-gray-700" value={((answers[currentQuestion.id] as any)?.text) || ''} onChange={(e) => handleEssayAnswerChange(currentQuestion.id, e.target.value)} />
                                    <label htmlFor="file-upload" className="flex items-center justify-center w-full px-4 py-6 bg-gray-50 dark:bg-gray-700 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
                                        <UploadCloud className="w-12 h-12 mx-auto text-gray-400" />
                                        <p className="mt-2 text-sm text-gray-500">{((answers[currentQuestion.id] as any)?.file)?.name || 'آپلود فایل'}</p>
                                        <input id="file-upload" type="file" className="hidden" onChange={(e) => handleFileChange(currentQuestion.id, e.target.files?.[0])} />
                                    </label>
                                </div>
                            );
                        case 'multiple-choice':
                        case 'multiple-answer':
                            return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentQuestion.options?.map((option, index) => {
                                        const isSelected = currentQuestion.type === 'multiple-answer' ? ((answers[currentQuestion.id] as number[]) || []).includes(index) : answers[currentQuestion.id] === index;
                                        return (
                                            <button key={index} onClick={() => handleMultiChoiceAnswer(currentQuestion, index)} className={`p-4 rounded-lg text-right border-2 flex items-center gap-4 ${isSelected ? 'bg-primary-500 border-primary-500 text-white' : 'bg-gray-50 dark:bg-gray-700 hover:border-primary-400'}`}>
                                                <div className={`w-6 h-6 rounded-md border-2 ${isSelected ? 'border-white bg-white' : 'border-gray-400'}`} />
                                                <span>{option}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            );
                        default:
                            return null;
                    }
                })()}
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button variant="secondary" onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}><ChevronRight className="ml-2" /> سوال قبلی</Button>
                {currentQuestionIndex === exam.questions.length - 1 ? (
                  <Button onClick={handleSubmitAttempt} variant="success">پایان و ثبت آزمون</Button>
                ) : (
                  <Button onClick={goToNextQuestion}>سوال بعدی <ChevronLeft className="mr-2" /></Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar and Modals */}
          {/* ... (sidebar and modal JSX is the same) */}
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
            <Button variant="danger" className="w-full flex justify-center gap-2" onClick={handleSubmitAttempt}>
              <AlertCircle size={20} />
              <span>پایان آزمون</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="مرور کلی آزمون">
          <div className="max-h-[70vh] overflow-y-auto p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exam.questions.map((q, index) => {
                      const isAnswered = answers[q.id] !== undefined;
                      const isFlagged = flaggedQuestions.has(q.id);
                      return (
                          <div key={q.id} className="border dark:border-gray-700 rounded-xl p-4 flex flex-col justify-between transition-shadow hover:shadow-lg">
                              <div>
                                  <div className="flex justify-between items-start mb-2">
                                      <p className="font-bold text-lg text-gray-800 dark:text-white">سوال {index + 1}</p>
                                      <div className="flex items-center gap-2">
                                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                              isAnswered
                                                  ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                                                  : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                                          }`}>
                                              {isAnswered ? 'پاسخ داده' : 'پاسخ نداده'}
                                          </span>
                                          {isFlagged && (
                                              <span className="flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">
                                                  <Flag size={12} className="ml-1" />
                                                  علامت‌دار
                                              </span>
                                          )}
                                      </div>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-400 mb-4 truncate">{q.text}</p>
                              </div>
                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => {
                                      setCurrentQuestionIndex(index);
                                      setIsReviewModalOpen(false);
                                  }}
                              >
                                  مشاهده سوال
                              </Button>
                          </div>
                      );
                  })}
              </div>
          </div>
      </Modal>

      {/* Confirm Submit Modal */}
      <Modal isOpen={isConfirmSubmitModalOpen} onClose={() => setIsConfirmSubmitModalOpen(false)} title="تایید نهایی ارسال">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">آیا از ارسال آزمون مطمئن هستید؟</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              شما به {unansweredQuestionsCount} سوال پاسخ نداده‌اید. پس از ارسال، دیگر امکان تغییر پاسخ‌ها وجود نخواهد داشت.
            </p>
          </div>
          <div className="mt-4 flex justify-center gap-4">
            <Button variant="secondary" onClick={() => setIsConfirmSubmitModalOpen(false)}>
              بازگشت
            </Button>
            <Button variant="danger" onClick={handleFinalSubmit}>
              بله، ارسال کن
            </Button>
          </div>
        </div>
      </Modal>

        </div>
      );
}

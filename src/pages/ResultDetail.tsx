import { useParams, Link } from 'react-router-dom';
import { Trophy, Clock, CheckCircle, XCircle, Award, Download, Share2, ChevronRight, Target } from 'lucide-react';
import { mockResults, mockExams } from '../data/mockData';

const mockAnswerDetails = [
  { questionNumber: 1, question: 'کدام یک از موارد زیر یک فعل کمکی در زبان انگلیسی است؟', userAnswer: 'Have', correctAnswer: 'Have', isCorrect: true, points: 2, earnedPoints: 2 },
  { questionNumber: 2, question: 'جمله "She ___ to school every day" با کدام فعل کامل می‌شود؟', userAnswer: 'goes', correctAnswer: 'goes', isCorrect: true, points: 2, earnedPoints: 2 },
  { questionNumber: 3, question: 'کلمه "Beautiful" چه نوع کلمه‌ای است؟', userAnswer: 'صفت', correctAnswer: 'صفت', isCorrect: true, points: 2, earnedPoints: 2 },
  { questionNumber: 4, question: 'Past Simple زمان "eat" چیست؟', userAnswer: 'ate', correctAnswer: 'ate', isCorrect: true, points: 2, earnedPoints: 2 },
  { questionNumber: 5, question: 'کدام جمله صحیح است؟', userAnswer: 'He doesn\'t like apples', correctAnswer: 'He doesn\'t like apples', isCorrect: true, points: 2, earnedPoints: 2 }
];

export default function ResultDetail() {
  const { id } = useParams();
  const result = mockResults.find(r => r.id === id);
  const exam = result ? mockExams.find(e => e.id === result.examId) : null;

  if (!result || !exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">نتیجه یافت نشد</h2>
          <Link to="/results" className="text-primary-600 hover:text-primary-700">
            بازگشت به نتایج
          </Link>
        </div>
      </div>
    );
  }

  const correctAnswers = mockAnswerDetails.filter(a => a.isCorrect).length;
  const incorrectAnswers = mockAnswerDetails.length - correctAnswers;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${result.passed ? 'bg-gradient-to-br from-green-600 to-green-800' : 'bg-gradient-to-br from-red-600 to-red-800'} text-white py-12`}>
        <div className="container mx-auto px-4">
          <Link to="/results" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
            <ChevronRight className="w-5 h-5" />
            <span>بازگشت به نتایج</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className={`inline-flex items-center gap-2 ${result.passed ? 'bg-green-500' : 'bg-red-500'} px-4 py-2 rounded-full mb-4`}>
                {result.passed ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-bold">قبول</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    <span className="font-bold">رد</span>
                  </>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-4">{exam.title}</h1>
              <p className={result.passed ? 'text-green-100' : 'text-red-100'}>
                {new Date(result.completedAt).toLocaleDateString('fa-IR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="text-7xl font-bold mb-2">{result.percentage}%</div>
                <p className="text-lg opacity-90">نمره کلی</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="text-3xl font-bold mb-1">{result.score}</div>
                  <p className="text-sm opacity-90">نمره کسب شده</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="text-3xl font-bold mb-1">{result.totalScore}</div>
                  <p className="text-sm opacity-90">نمره کل</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{correctAnswers}</div>
                <p className="text-gray-600">پاسخ صحیح</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(correctAnswers / mockAnswerDetails.length) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{incorrectAnswers}</div>
                <p className="text-gray-600">پاسخ نادرست</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(incorrectAnswers / mockAnswerDetails.length) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{result.timeSpent}</div>
                <p className="text-gray-600">دقیقه</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(result.timeSpent / exam.duration) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">تحلیل عملکرد</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">دقت پاسخ‌دهی</span>
                    <span className="font-bold text-gray-800">{result.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full" style={{ width: `${result.percentage}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">سرعت پاسخ‌دهی</span>
                    <span className="font-bold text-gray-800">{Math.round((exam.duration - result.timeSpent) / exam.duration * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{ width: `${(exam.duration - result.timeSpent) / exam.duration * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-start gap-3">
                  <Target className={`w-6 h-6 ${result.passed ? 'text-green-600' : 'text-red-600'} flex-shrink-0 mt-1`} />
                  <div>
                    <h3 className={`font-bold ${result.passed ? 'text-green-800' : 'text-red-800'} mb-1`}>
                      {result.passed ? 'تبریک!' : 'متاسفانه'}
                    </h3>
                    <p className={`text-sm ${result.passed ? 'text-green-700' : 'text-red-700'} leading-relaxed`}>
                      {result.passed
                        ? `شما با موفقیت در این آزمون قبول شدید و نمره ${result.percentage}% کسب کردید. برای دریافت گواهینامه به بخش پایین مراجعه کنید.`
                        : `برای قبولی در این آزمون به نمره ${exam.passingScore}% نیاز بود. شما ${result.percentage}% کسب کردید. می‌توانید دوباره در این آزمون شرکت کنید.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">بررسی تفصیلی سوالات</h2>

              <div className="space-y-4">
                {mockAnswerDetails.map((answer, index) => (
                  <div
                    key={index}
                    className={`p-5 rounded-xl border-2 ${
                      answer.isCorrect
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                        } text-white font-bold`}>
                          {answer.questionNumber}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">سوال {answer.questionNumber}</p>
                          <p className="text-sm text-gray-600">{answer.points} امتیاز</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                        answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                      } text-white text-sm font-bold`}>
                        {answer.isCorrect ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>صحیح</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            <span>نادرست</span>
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{answer.question}</p>

                    <div className="space-y-2">
                      <div className={`p-3 rounded-lg ${
                        answer.isCorrect ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <p className="text-sm text-gray-600 mb-1">پاسخ شما:</p>
                        <p className={`font-bold ${
                          answer.isCorrect ? 'text-green-700' : 'text-red-700'
                        }`}>{answer.userAnswer}</p>
                      </div>

                      {!answer.isCorrect && (
                        <div className="p-3 rounded-lg bg-green-100">
                          <p className="text-sm text-gray-600 mb-1">پاسخ صحیح:</p>
                          <p className="font-bold text-green-700">{answer.correctAnswer}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 space-y-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-4">اقدامات</h3>
                <div className="space-y-3">
                  {result.passed && (
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-bold">
                      <Download className="w-5 h-5" />
                      <span>دانلود گواهینامه</span>
                    </button>
                  )}

                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-bold">
                    <Share2 className="w-5 h-5" />
                    <span>اشتراک‌گذاری نتیجه</span>
                  </button>

                  <Link
                    to={`/exams/${exam.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-bold"
                  >
                    <Trophy className="w-5 h-5" />
                    <span>تلاش مجدد</span>
                  </Link>
                </div>
              </div>

              {result.passed && (
                <div className="pt-6 border-t">
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl text-center">
                    <Award className="w-16 h-16 text-yellow-600 mx-auto mb-3" />
                    <h4 className="font-bold text-gray-800 mb-2">گواهینامه آماده است</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      شما می‌توانید گواهینامه دیجیتال این آزمون را دریافت کنید
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t">
                <h4 className="font-bold text-gray-800 mb-3">توصیه‌های ما</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>نقاط ضعف خود را شناسایی کنید</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>در آزمون‌های مشابه شرکت کنید</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>مطالب مرتبط را مرور کنید</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

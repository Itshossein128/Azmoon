import { User, Exam, Category, Result, Question } from '../../shared/types';

const mockQuestions: Question[] = [
  {
    id: '1',
    examId: '1',
    category: 'زبان انگلیسی',
    text: 'کدام یک از موارد زیر یک فعل کمکی در زبان انگلیسی است؟',
    type: 'multiple-choice',
    options: ['Run', 'Have', 'Book', 'Student'],
    correctAnswer: 1,
    points: 2
  },
  {
    id: '2',
    examId: '1',
    category: 'زبان انگلیسی',
    text: 'جمله "She ___ to school every day" با کدام فعل کامل می‌شود؟',
    type: 'multiple-choice',
    options: ['go', 'goes', 'going', 'gone'],
    correctAnswer: 1,
    points: 2
  },
  {
    id: '3',
    examId: '1',
    category: 'زبان انگلیسی',
    text: 'کلمه "Beautiful" چه نوع کلمه‌ای است؟',
    type: 'multiple-choice',
    options: ['اسم', 'فعل', 'صفت', 'قید'],
    correctAnswer: 2,
    points: 2
  },
  {
    id: '4',
    examId: '1',
    category: 'زبان انگلیسی',
    text: 'Past Simple زمان "eat" چیست؟',
    type: 'multiple-choice',
    options: ['eated', 'ate', 'eaten', 'eating'],
    correctAnswer: 1,
    points: 2
  },
  {
    id: '5',
    examId: '1',
    category: 'زبان انگلیسی',
    text: 'کدام جمله صحیح است؟',
    type: 'multiple-choice',
    options: [
      'He don\'t like apples',
      'He doesn\'t like apples',
      'He doesn\'t likes apples',
      'He not like apples'
    ],
    correctAnswer: 1,
    points: 2
  }
];

const mockPythonQuestions: Question[] = [
  {
    id: 'p1',
    examId: '2',
    category: 'برنامه‌نویسی',
    text: 'کدام نوع داده برای ذخیره مقادیر صحیح در پایتون استفاده می‌شود؟',
    type: 'multiple-choice',
    options: ['float', 'str', 'int', 'bool'],
    correctAnswer: 2,
    points: 3
  },
  {
    id: 'p2',
    examId: '2',
    category: 'برنامه‌نویسی',
    text: 'خروجی کد `print(len("hello"))` چیست؟',
    type: 'multiple-choice',
    options: ['5', '4', 'hello', 'Error'],
    correctAnswer: 0,
    points: 3
  },
  {
    id: 'p3',
    examId: '2',
    category: 'برنامه‌نویسی',
    text: 'کدام کلمه کلیدی برای تعریف یک تابع در پایتون استفاده می‌شود؟',
    type: 'multiple-choice',
    options: ['fun', 'def', 'function', 'define'],
    correctAnswer: 1,
    points: 4
  }
];

const mockMathQuestions: Question[] = [
  {
    id: 'm1',
    examId: '3',
    category: 'ریاضیات',
    text: 'مشتق تابع f(x) = x^2 چیست؟',
    type: 'multiple-choice',
    options: ['2x', 'x', 'x^3 / 3', '2'],
    correctAnswer: 0,
    points: 5
  },
  {
    id: 'm2',
    examId: '3',
    category: 'ریاضیات',
    text: 'حاصل انتگرال ∫(1)dx چیست؟',
    type: 'multiple-choice',
    options: ['x + C', '1 + C', '0', 'x^2 + C'],
    correctAnswer: 0,
    points: 5
  },
  {
    id: 'm3',
    examId: '3',
    category: 'ریاضیات',
    text: 'کدام یک از موارد زیر جزو اعداد اول هستند؟ (چند جوابی)',
    type: 'multiple-answer',
    options: ['2', '4', '7', '9'],
    correctAnswer: [0, 2],
    points: 5
  }
];


export const mockExams: Exam[] = [
  {
    id: '1',
    title: 'آزمون جامع زبان انگلیسی',
    description: 'این یک آزمون جامع برای سنجش مهارت‌های زبان انگلیسی شما است.',
    category: 'زبان انگلیسی',
    level: 'سخت',
    duration: 60,
    totalQuestions: 50,
    passingScore: 70,
    price: 50000,
    imageUrl: 'https://images.pexels.com/photos/276452/pexels-photo-276452.jpeg?auto=compress&cs=tinysrgb&w=600',
    instructor: 'دکتر رضایی',
    participants: 1250,
    rating: 4.8,
    startDate: '1403/02/20',
    endDate: '1403/02/25',
    tags: ['گرامر', 'واژگان', 'درک مطلب'],
    questions: mockQuestions,
  },
  {
    id: '2',
    title: 'آزمون مبانی برنامه‌نویسی پایتون',
    description: 'دانش خود را در زمینه مبانی برنامه‌نویسی پایتون محک بزنید.',
    category: 'برنامه‌نویسی',
    level: 'آسان',
    duration: 45,
    totalQuestions: 30,
    passingScore: 65,
    price: 0,
    imageUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600',
    instructor: 'مهندس اکبری',
    participants: 2300,
    rating: 4.9,
    tags: ['پایتون', 'مبانی', 'الگوریتم'],
    questions: mockPythonQuestions,
  },
  {
    id: '3',
    title: 'آزمون ریاضیات عمومی ۱',
    description: 'این آزمون شامل مباحث حد، مشتق و انتگرال است.',
    category: 'ریاضیات',
    level: 'متوسط',
    duration: 90,
    totalQuestions: 25,
    passingScore: 60,
    price: 25000,
    imageUrl: 'https://images.pexels.com/photos/374918/pexels-photo-374918.jpeg?auto=compress&cs=tinysrgb&w=600',
    instructor: 'دکتر محمدی',
    participants: 850,
    rating: 4.6,
    tags: ['ریاضی', 'دانشگاه', 'انتگرال'],
    questions: mockMathQuestions,
  },
  {
    id: '4',
    title: 'آزمون زیست‌شناسی سلولی و مولکولی',
    description: 'مباحث مربوط به ساختار و عملکرد سلول‌ها را مرور کنید.',
    category: 'علوم تجربی',
    level: 'متوسط',
    duration: 75,
    totalQuestions: 60,
    passingScore: 75,
    price: 35000,
    imageUrl: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600',
    instructor: 'دکتر کریمی',
    participants: 600,
    rating: 4.7,
    tags: ['زیست', 'کنکور', 'سلولی'],
    questions: [],
  },
  {
    id: '5',
    title: 'آزمون تاریخ ایران باستان',
    description: 'اطلاعات خود را در مورد تاریخ ایران پیش از اسلام بسنجید.',
    category: 'تاریخ و جغرافیا',
    level: 'متوسط',
    duration: 50,
    totalQuestions: 40,
    passingScore: 70,
    price: 15000,
    imageUrl: 'https://images.pexels.com/photos/1310777/pexels-photo-1310777.jpeg?auto=compress&cs=tinysrgb&w=600',
    instructor: 'دکتر زمانی',
    participants: 450,
    rating: 4.5,
    tags: ['تاریخ', 'ایران', 'باستان'],
    questions: [],
  },
  {
    id: '6',
    title: 'آزمون تئوری موسیقی',
    description: 'مبانی تئوری موسیقی و نت‌خوانی.',
    category: 'هنر و موسیقی',
    level: 'سخت',
    duration: 60,
    totalQuestions: 50,
    passingScore: 80,
    price: 40000,
    imageUrl: 'https://images.pexels.com/photos/3971985/pexels-photo-3971985.jpeg?auto=compress&cs=tinysrgb&w=600',
    instructor: 'استاد نوری',
    participants: 320,
    rating: 4.9,
    tags: ['موسیقی', 'تئوری', 'نت'],
    questions: [],
  },
  {
    id: '7',
    title: 'آزمون آیلتس',
    description: 'آزمون آزمایشی آیلتس برای سنجش مهارت‌های شما.',
    category: 'زبان انگلیسی',
    level: 'سخت',
    duration: 180,
    totalQuestions: 100,
    passingScore: 75,
    price: 150000,
    imageUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
    instructor: 'آکادمی زبان',
    participants: 1800,
    rating: 4.9,
    tags: ['آیلتس', 'زبان', 'مهاجرت'],
    questions: [],
  },
  {
    id: '8',
    title: 'آزمون الگوریتم و ساختمان داده',
    description: 'مفاهیم پیشرفته الگوریتم و ساختمان داده.',
    category: 'برنامه‌نویسی',
    level: 'آسان',
    duration: 120,
    totalQuestions: 40,
    passingScore: 60,
    price: 75000,
    imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600',
    instructor: 'مهندس قنبری',
    participants: 980,
    rating: 4.8,
    tags: ['الگوریتم', 'داده‌ساختار', 'جاوا'],
    questions: [],
  }
];

export const mockAllQuestions: Question[] = [
    ...mockQuestions,
    ...mockPythonQuestions,
    ...mockMathQuestions,
];

export const mockCategories: Category[] = [
  { id: '1', name: 'زبان انگلیسی', icon: '🇬🇧', count: 50, isFeatured: false },
  { id: '2', name: 'برنامه‌نویسی', icon: '💻', count: 35, isFeatured: true },
  { id: '3', name: 'ریاضیات', icon: '📊', count: 42, isFeatured: true },
  { id: '4', name: 'علوم تجربی', icon: '🔬', count: 28, isFeatured: false },
  { id: '5', name: 'تاریخ و جغرافیا', icon: '🌍', count: 18, isFeatured: false },
  { id: '6', name: 'هنر و موسیقی', icon: '🎨', count: 22, isFeatured: true }
];

export const mockResults: Result[] = [
  {
    id: '1',
    examId: '1',
    userId: '1',
    score: 85,
    totalScore: 100,
    percentage: 85,
    passed: true,
    completedAt: '1403/02/21',
    timeSpent: 45,
    answers: [1, 1, 2, 1, 1],
    correctAnswers: 5,
  },
  {
    id: '2',
    examId: '2',
    userId: '1',
    score: 60,
    totalScore: 100,
    percentage: 60,
    passed: false,
    completedAt: '1403/02/18',
    timeSpent: 35,
    answers: [],
    correctAnswers: 0,
  },
  {
    id: '3',
    examId: '3',
    userId: '1',
    score: 92,
    totalScore: 100,
    percentage: 92,
    passed: true,
    completedAt: '1403/02/15',
    timeSpent: 75,
    answers: [],
    correctAnswers: 0,
  }
];

export let mockUsers: User[] = [
  {
    id: '1',
    name: 'ادمین',
    email: 'admin@test.com',
    role: 'admin',
    registeredAt: '1402/10/01',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  },
  {
    id: '2',
    name: 'کاربر تستی',
    email: 'test@test.com',
    role: 'student',
    registeredAt: '1403/01/15',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    id: '3',
    name: 'استاد رضایی',
    email: 'teacher@test.com',
    role: 'teacher',
    registeredAt: '1402/11/20',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
  },
    {
    id: '4',
    name: 'دانشجو جدید',
    email: 'student@test.com',
    role: 'student',
    registeredAt: '1403/02/05',
    avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d',
  },
];

import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '../components/layout/Layout';
import ErrorBoundary from '../components/layout/ErrorBoundary';
import Spinner from '../components/ui/Spinner';

const Home = lazy(() => import('../features/home/Home'));
const ExamList = lazy(() => import('../features/exam/ExamList'));
const ExamDetail = lazy(() => import('../features/exam/ExamDetail'));
const ExamTake = lazy(() => import('../features/exam/ExamTake'));
const ResultsList = lazy(() => import('../features/results/ResultsList'));
const ResultDetail = lazy(() => import('../features/results/ResultDetail'));
const PendingReview = lazy(() => import('../features/results/PendingReview'));
const Dashboard = lazy(() => import('../features/dashboard/Dashboard'));
const Profile = lazy(() => import('../features/user/Profile'));
const Wallet = lazy(() => import('../features/Wallet'));
const SubscriptionPage = lazy(() => import('../features/subscriptions/SubscriptionPage'));
const About = lazy(() => import('../features/about/About'));
const Login = lazy(() => import('../features/auth/Login'));
const Register = lazy(() => import('../features/auth/Register'));
const ForgotPassword = lazy(() => import('../features/auth/ForgotPassword'));
const PrivateRoute = lazy(() => import('./PrivateRoute'));
const PublicRoute = lazy(() => import('./PublicRoute'));
const AdminRoute = lazy(() => import('./AdminRoute'));
const AdminLayout = lazy(() => import('../features/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('../features/admin/AdminDashboard'));
const UserManagement = lazy(() => import('../features/admin/UserManagement'));
const ExamManagement = lazy(() => import('../features/admin/ExamManagement'));
const QuestionBank = lazy(() => import('../features/admin/QuestionBank'));
const GradingQueue = lazy(() => import('../features/admin/GradingQueue'));
const GradeSubmission = lazy(() => import('../features/admin/GradeSubmission'));
const CategoryManagement = lazy(() => import('../features/admin/CategoryManagement'));
const DiscountManagement = lazy(() => import('../features/admin/DiscountManagement'));
const Settings = lazy(() => import('../features/admin/Settings'));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="flex h-screen items-center justify-center"><Spinner /></div>}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SuspenseWrapper><PrivateRoute /></SuspenseWrapper>,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <SuspenseWrapper><Home /></SuspenseWrapper> },
          { path: 'exams', element: <SuspenseWrapper><ExamList /></SuspenseWrapper> },
          { path: 'exams/:id', element: <SuspenseWrapper><ExamDetail /></SuspenseWrapper> },
          { path: 'exams/take/:id', element: <SuspenseWrapper><ExamTake /></SuspenseWrapper> },
          { path: 'results', element: <SuspenseWrapper><ResultsList /></SuspenseWrapper> },
          { path: 'results/:id', element: <SuspenseWrapper><ResultDetail /></SuspenseWrapper> },
          { path: 'results/pending-review', element: <SuspenseWrapper><PendingReview /></SuspenseWrapper> },
          { path: 'dashboard', element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
          { path: 'profile', element: <SuspenseWrapper><Profile /></SuspenseWrapper> },
          { path: 'wallet', element: <SuspenseWrapper><Wallet /></SuspenseWrapper> },
          { path: 'subscriptions', element: <SuspenseWrapper><SubscriptionPage /></SuspenseWrapper> },
          { path: 'about', element: <SuspenseWrapper><About /></SuspenseWrapper> },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <SuspenseWrapper><PublicRoute /></SuspenseWrapper>,
    errorElement: <ErrorBoundary />,
    children: [
      { path: 'login', element: <SuspenseWrapper><Login /></SuspenseWrapper> },
      { path: 'register', element: <SuspenseWrapper><Register /></SuspenseWrapper> },
      { path: 'forgot-password', element: <SuspenseWrapper><ForgotPassword /></SuspenseWrapper> },
    ],
  },
  {
    path: '/admin',
    element: <SuspenseWrapper><AdminRoute /></SuspenseWrapper>,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <SuspenseWrapper><AdminLayout /></SuspenseWrapper>,
        children: [
          { index: true, element: <SuspenseWrapper><AdminDashboard /></SuspenseWrapper> },
          { path: 'users', element: <SuspenseWrapper><UserManagement /></SuspenseWrapper> },
          { path: 'exams', element: <SuspenseWrapper><ExamManagement /></SuspenseWrapper> },
          { path: 'questions', element: <SuspenseWrapper><QuestionBank /></SuspenseWrapper> },
          { path: 'grading', element: <SuspenseWrapper><GradingQueue /></SuspenseWrapper> },
          { path: 'grading/:id', element: <SuspenseWrapper><GradeSubmission /></SuspenseWrapper> },
          { path: 'categories', element: <SuspenseWrapper><CategoryManagement /></SuspenseWrapper> },
          { path: 'discounts', element: <SuspenseWrapper><DiscountManagement /></SuspenseWrapper> },
          { path: 'settings', element: <SuspenseWrapper><Settings /></SuspenseWrapper> },
        ],
      },
    ],
  },
]);

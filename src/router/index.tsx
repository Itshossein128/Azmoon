import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../features/home/Home';
import ExamList from '../features/exam/ExamList';
import ExamDetail from '../features/exam/ExamDetail';
import ExamTake from '../features/exam/ExamTake';
import Results from '../features/results/Results';
import ResultDetail from '../features/results/ResultDetail';
import Dashboard from '../features/dashboard/Dashboard';
import Profile from '../features/user/Profile';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import ForgotPassword from '../features/auth/ForgotPassword';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import AdminRoute from './AdminRoute';
import AdminLayout from '../features/admin/AdminLayout';
import AdminDashboard from '../features/admin/AdminDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'exams', element: <ExamList /> },
          { path: 'exams/:id', element: <ExamDetail /> },
          { path: 'results', element: <Results /> },
          { path: 'results/:id', element: <ResultDetail /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'profile', element: <Profile /> },
        ],
      },
      {
        path: 'exam-take/:id',
        element: <ExamTake />,
      },
    ],
  },
  {
    path: '/',
    element: <PublicRoute />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          // Add other admin routes here, e.g., for users, exams, settings
        ],
      },
    ],
  },
]);

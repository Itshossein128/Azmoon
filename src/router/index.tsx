import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../features/home/Home';
import ExamList from '../features/exam/ExamList';
import ExamDetail from '../features/exam/ExamDetail';
import ExamTake from '../features/exam/ExamTake';
import Results from '../features/results/Results';
import ResultDetail from '../features/results/ResultDetail';
import Dashboard from '../features/dashboard/Dashboard';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

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
    ],
  },
]);

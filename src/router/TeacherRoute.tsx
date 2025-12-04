import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

const TeacherRoute: React.FC = () => {
  const { user } = useUserStore();

  if (!user || user.role !== 'teacher') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default TeacherRoute;

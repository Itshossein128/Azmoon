import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

const PublicRoute: React.FC = () => {
  const { user } = useUserStore();

  return user ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;

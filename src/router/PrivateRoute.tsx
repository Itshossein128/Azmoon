import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

const PrivateRoute: React.FC = () => {
  const { user } = useUserStore();

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

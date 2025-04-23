import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    alert('Будь ласка, увійдіть або зареєструйтесь, щоб переглянути цю сторінку.');
    return <Navigate to="/cars" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

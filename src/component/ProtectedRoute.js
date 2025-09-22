import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      
      if (!isLoggedIn) {
        console.log('Không có đăng nhập, chuyển về login');
        navigate('/login', { replace: true });
        return;
      }

      const savedRole = localStorage.getItem('userRole');
      
      if (!savedRole) {
        console.log('Không có role, chuyển về role selector');
        navigate('/role-selector', { replace: true });
        return;
      }

      if (requiredRole && savedRole !== requiredRole) {
        console.log('Role không khớp, chuyển về role selector');
        navigate('/role-selector', { replace: true });
        return;
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [navigate, requiredRole]);

  // Lắng nghe thay đổi localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      if (!isLoggedIn) {
        navigate('/', { replace: true });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
  
  if (isChecking || !isLoggedIn) {
    return <div>Đang kiểm tra quyền truy cập...</div>;
  }

  const savedRole = localStorage.getItem('userRole');
  if (!savedRole || (requiredRole && savedRole !== requiredRole)) {
    return <div>Đang chuyển hướng...</div>;
  }

  return children;
};

export default ProtectedRoute;
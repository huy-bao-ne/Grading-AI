import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/globals.css';
import '../style/role-selector.css';

const RoleSelector = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra authentication và role đã lưu
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      setIsRedirecting(true);
      navigate('/login');
    } else {
      // Kiểm tra nếu đã có role được lưu
      const savedRole = localStorage.getItem('userRole');
      if (savedRole) {
        setIsRedirecting(true);
        navigate(savedRole === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
      }
    }
  }, [navigate]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setIsSelecting(true);
    
    // Lưu vai trò vào localStorage
    localStorage.setItem('userRole', role);
    
    setTimeout(() => {
      if (role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    }, 1000);
  };

  // Hiển thị loading nếu đang redirect
  if (isRedirecting) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          {isRedirecting ? 'Đang chuyển hướng...' : 'Đang tải...'}
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập, không hiển thị gì (sẽ redirect)
  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
  if (!isLoggedIn) {
    return null;
  }

  // Nếu đã có role, không hiển thị UI chọn role nữa
  const savedRole = localStorage.getItem('userRole');
  if (savedRole) {
    return null; // Hoặc hiển thị loading trong khi redirect
  }

  const userName = localStorage.getItem('userName') || 'bạn';

  return (
    <div className="role-selector-container">
      <div className="role-selector-card">
        <div className="welcome-section">
          <h1>🎉 Chào mừng bạn!</h1>
          <p>Xin chào <strong>{userName}</strong>, vui lòng chọn vai trò của bạn:</p>
        </div>

        <div className="role-options">
          <div 
            className={`role-card ${selectedRole === 'teacher' ? 'selected' : ''} ${isSelecting && selectedRole === 'teacher' ? 'processing' : ''}`}
            onClick={() => !isSelecting && handleRoleSelect('teacher')}
          >
            <div className="role-icon">👩‍🏫</div>
            <h3>Giáo viên</h3>
            <p>Quản lý lớp học, tạo bài tập và chấm điểm</p>
            <ul>
              <li>📚 Tạo và quản lý lớp học</li>
              <li>📝 Tạo bài tập và đề thi</li>
              <li>📊 Chấm điểm và theo dõi tiến độ</li>
              <li>💬 Giao tiếp với học sinh</li>
            </ul>
            {isSelecting && selectedRole === 'teacher' && (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Đang chuyển hướng...</span>
              </div>
            )}
          </div>

          <div 
            className={`role-card ${selectedRole === 'student' ? 'selected' : ''} ${isSelecting && selectedRole === 'student' ? 'processing' : ''}`}
            onClick={() => !isSelecting && handleRoleSelect('student')}
          >
            <div className="role-icon">👨‍🎓</div>
            <h3>Học sinh</h3>
            <p>Tham gia lớp học, làm bài tập và theo dõi điểm số</p>
            <ul>
              <li>📖 Tham gia lớp học</li>
              <li>✍️ Làm bài tập và bài kiểm tra</li>
              <li>📈 Xem điểm số và nhận xét</li>
              <li>💬 Trao đổi với giáo viên</li>
            </ul>
            {isSelecting && selectedRole === 'student' && (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Đang chuyển hướng...</span>
              </div>
            )}
          </div>
        </div>

        <div className="note-section">
          <p className="note">
            💡 <strong>Lưu ý:</strong> Lựa chọn này sẽ được ghi nhớ cho những lần đăng nhập tiếp theo.
            Bạn có thể thay đổi vai trò trong phần cài đặt tài khoản.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
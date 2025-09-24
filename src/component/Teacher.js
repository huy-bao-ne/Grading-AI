import React, { useState } from "react";
import ClassManager from "./ClassManager.js";
import TeacherDashboard from "./TeacherDashboard.js";
import NotificationSystem from "./NotificationSystem.js";
import ChatSystem from "./ChatSystem.js";
import ProfileComponent from "./ProfileComponent.js";
import { useNavigate } from "react-router-dom";
import "../style/globals.css";
import "../style/teacher.css";

const Teacher = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  // Profile editing state removed - ProfileComponent handles this
  const [classes, setClasses] = useState([]); // Shared state cho dashboard

  // Thông tin giáo viên (state)
  const [teacherInfo, setTeacherInfo] = useState({
    name: localStorage.getItem('userName') || "Trần Văn B",
    teacherId: "GV98765",
    birthDate: "1985-08-20",
    gender: "Nam",
    email: localStorage.getItem('userEmail') || "teacher@email.com",
    phone: "0123456789",
    department: "Khoa Công nghệ thông tin",
    degree: "Thạc sĩ",
    experience: "5 năm",
    avatar: "https://via.placeholder.com/100"
  });

  // Xử lý đăng xuất
  const handleLogout = () => {
    // Xóa tất cả dữ liệu người dùng
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('teacherId');
    
    // Log để debug
    console.log('Đăng xuất thành công, chuyển về trang chủ');
    
    // Chuyển về trang chủ và reload
    navigate("/", { replace: true });
    
    // Force reload trang để đảm bảo state được reset
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="teacher-dashboard">
      {/* Navigation - Using Homepage Style */}
      <nav className="nav-modern">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-icon">🎓</div>
            <span className="brand-text">GradingAI - Teacher</span>
          </div>
          <div className="nav-actions">
            <button 
              className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              📊 Dashboard
            </button>
            <button 
              className={`nav-tab ${activeTab === "assignments" ? "active" : ""}`}
              onClick={() => setActiveTab("assignments")}
            >
              👥 Quản lý lớp
            </button>
            <button 
              className={`nav-tab ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              👤 Hồ sơ
            </button>
            <div className="notification-wrapper">
              <NotificationSystem 
                userRole="teacher" 
                classes={classes} 
                currentUser={teacherInfo} 
              />
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      {/* Nội dung từng tab */}
      <div className={`content ${activeTab === "dashboard" ? "active" : ""}`}>
        <TeacherDashboard classes={classes} />
      </div>

      <div className={`content ${activeTab === "assignments" ? "active" : ""}`}>
        <ClassManager classes={classes} setClasses={setClasses} />
      </div>

      <div className={`content ${activeTab === "profile" ? "active" : ""}`}>
        <ProfileComponent 
          userType="teacher"
          userData={teacherInfo}
          onUpdate={(updatedData) => setTeacherInfo(updatedData)}
          onLogout={handleLogout}
        />
      </div>

      {/* Hệ thống Chat */}
      <ChatSystem 
        userRole="teacher" 
        currentUser={teacherInfo} 
        classes={classes} 
      />
    </div>
  );
};

export default Teacher;

import React, { useState } from "react";
import ClassManager from "./ClassManager.js";
import TeacherDashboard from "./TeacherDashboard.js";
import NotificationSystem from "./NotificationSystem.js";
import ChatSystem from "./ChatSystem.js";
import { useNavigate } from "react-router-dom";
import "../style/globals.css";
import "../style/teacher.css";

const Teacher = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isEditing, setIsEditing] = useState(false);
  const [classes, setClasses] = useState([]); // Shared state cho dashboard

  // Thông tin giáo viên (state)
  const [teacherInfo, setTeacherInfo] = useState({
    name: "Trần Văn B",
    teacherId: "GV98765",
    birthDate: "1985-08-20",
    gender: "Nam",
    avatar: "https://via.placeholder.com/100"
  });

  // Xử lý thay đổi thông tin
  const handleChange = (e) => {
    setTeacherInfo({ ...teacherInfo, [e.target.name]: e.target.value });
  };

  // Xử lý tải lên ảnh đại diện
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTeacherInfo({ ...teacherInfo, avatar: imageUrl });
    }
  };

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
    <div className="teacher-container">
      {/* Thanh công cụ */}
      <nav className="teacher-navbar">
        <div className="navbar-left">
          <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
            📊 Dashboard
          </button>
          <button className={activeTab === "assignments" ? "active" : ""} onClick={() => setActiveTab("assignments")}>
            👥 Quản lý lớp & học sinh
          </button>
          <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
            👤 Thông tin tài khoản
          </button>
        </div>
        
        <div className="navbar-right">
          {/* Hệ thống thông báo */}
          <div className="notification-wrapper">
            <NotificationSystem 
              userRole="teacher" 
              classes={classes} 
              currentUser={teacherInfo} 
            />
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
        <h2>👤 Thông tin tài khoản</h2>

        {isEditing ? (
          <div className="edit-form">
            {/* Upload ảnh đại diện */}
            <div className="avatar-upload">
              <img src={teacherInfo.avatar} alt="Avatar" className="avatar-preview" />
              <label className="upload-btn">
                📷 Chọn ảnh
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>

            <label>Họ và tên:</label>
            <input type="text" name="name" value={teacherInfo.name} onChange={handleChange} />

            <label>Mã số giáo viên:</label>
            <input type="text" name="teacherId" value={teacherInfo.teacherId} onChange={handleChange} />

            <label>Ngày sinh:</label>
            <input type="date" name="birthDate" value={teacherInfo.birthDate} onChange={handleChange} />

            <label>Giới tính:</label>
            <select name="gender" value={teacherInfo.gender} onChange={handleChange}>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>

            <button className="save-button" onClick={() => setIsEditing(false)}>💾 Lưu</button>
          </div>
        ) : (
          <div className="profile-view">
            <img src={teacherInfo.avatar} alt="Avatar" className="avatar-display" />
            <p><strong>Họ và tên:</strong> {teacherInfo.name}</p>
            <p><strong>Mã số giáo viên:</strong> {teacherInfo.teacherId}</p>
            <p><strong>Ngày sinh:</strong> {teacherInfo.birthDate}</p>
            <p><strong>Giới tính:</strong> {teacherInfo.gender}</p>
            <button className="edit-button" onClick={() => setIsEditing(true)}>✏️ Chỉnh sửa</button>
            <button className="logout-button" onClick={handleLogout}>🚪 Đăng xuất</button>
          </div>
        )}
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

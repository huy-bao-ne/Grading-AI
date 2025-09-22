import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Component imports
import StudentTest from "./StudentTest.js";
import StudentCalendar from "./StudentCalendar.js";
import NotificationSystem from "./NotificationSystem.js";
import ChatSystem from "./ChatSystem.js";

// Utility imports
import ClassDataManager from "../utils/classDataManager.js";

// Style imports
import "../style/globals.css";
import "../style/student.css";

/**
 * Student Dashboard Component
 * Main dashboard for student users with tabs for classes, tests, calendar, and profile
 */
const Student = () => {
  const navigate = useNavigate();
  
  // Tab management states
  const [activeTab, setActiveTab] = useState("classes");
  const [activeClassTab, setActiveClassTab] = useState("assignments");
  const [selectedClassId, setSelectedClassId] = useState(null);
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);

  // Class management states
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [classCode, setClassCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  // Assignment states
  const [assignments, setAssignments] = useState([]);

  // Student information state
  const [studentInfo, setStudentInfo] = useState({
    id: localStorage.getItem('studentId') || 'student_' + Date.now(),
    name: localStorage.getItem('userName') || "Nguyễn Văn A",
    studentId: "20251234",
    birthDate: "2003-05-12",
    gender: "Nam",
    email: localStorage.getItem('userEmail') || "student@email.com",
    avatar: "https://via.placeholder.com/100"
  });

  // Load data when component mounts
  useEffect(() => {
    loadStudentClasses();
    // Save studentId to localStorage if not exists
    if (!localStorage.getItem('studentId')) {
      localStorage.setItem('studentId', studentInfo.id);
    }
  }, []);

  /**
   * Load classes that the student has joined
   */
  const loadStudentClasses = () => {
    const studentId = localStorage.getItem('studentId') || studentInfo.id;
    const classes = ClassDataManager.getStudentClasses(studentId);
    setJoinedClasses(classes);
  };

  /**
   * Handle viewing class details
   * @param {string} classId - The ID of the class to view
   */
  const handleViewClass = (classId) => {
    setSelectedClassId(classId);
    setActiveTab("classDetails");
    loadClassAssignments(classId);
  };

  /**
   * Load assignments for a specific class
   * @param {string} classId - The ID of the class
   */
  const loadClassAssignments = (classId) => {
    // Mock data - trong thực tế sẽ load từ server
    const mockAssignments = [
      {
        id: 1,
        title: "Bài tập 1: Viết đoạn văn mô tả",
        description: "Viết một đoạn văn 200-300 từ mô tả về quê hương của em",
        dueDate: "2024-01-20",
        status: "pending", // pending, submitted, graded
        maxScore: 10,
        score: null,
        feedback: null
      },
      {
        id: 2,
        title: "Bài tập 2: Phân tích văn bản",
        description: "Phân tích bài thơ 'Tây Tiến' của Quang Dũng",
        dueDate: "2024-01-25",
        status: "submitted",
        maxScore: 10,
        score: 8.5,
        feedback: "Bài làm tốt, cần phân tích sâu hơn về hình ảnh"
      }
    ];
    setAssignments(mockAssignments);
  };

  // Tìm kiếm lớp học
  const handleSearchClass = () => {
    if (classCode.trim() === '') {
      alert('Vui lòng nhập mã lớp!');
      return;
    }

    const foundClass = ClassDataManager.findClassByCode(classCode.trim());
    
    if (foundClass) {
      setSearchResult(foundClass);
    } else {
      setSearchResult(null);
      alert('Không tìm thấy lớp học với mã này!');
    }
  };

  // Tham gia lớp học
  const handleJoinClass = async () => {
    if (!searchResult) return;

    setIsJoining(true);

    try {
      const studentData = {
        id: studentInfo.id,
        name: studentInfo.name,
        email: studentInfo.email
      };

      const result = ClassDataManager.joinClass(searchResult.code, studentData);

      if (result.success) {
        // Reload classes
        loadStudentClasses();
        
        // Reset form
        setClassCode('');
        setSearchResult(null);
        
        alert(`Tham gia lớp học "${result.class.name}" thành công!`);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error joining class:', error);
      alert('Có lỗi xảy ra khi tham gia lớp học!');
    } finally {
      setIsJoining(false);
    }
  };

  /**
   * Handle form input changes for student info
   * @param {Event} e - The input change event
   */
  const handleChange = (e) => {
    setStudentInfo({ ...studentInfo, [e.target.name]: e.target.value });
  };

  /**
   * Handle avatar image upload
   * @param {Event} e - The file input change event
   */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setStudentInfo({ ...studentInfo, avatar: imageUrl });
    }
  };

  /**
   * Handle user logout - clears all user data and redirects to homepage
   */
  const handleLogout = () => {
    // Xóa tất cả dữ liệu người dùng
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('studentId');
    
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
    <div className="student-container">
      {/* Thanh công cụ */}
      <nav className="student-navbar">
        <div className="navbar-left">
          <button className={activeTab === "classes" ? "active" : ""} onClick={() => setActiveTab("classes")}>
            📚 Lớp học của tôi
          </button>
          <button className={activeTab === "pending" ? "active" : ""} onClick={() => setActiveTab("pending")}>
            📌 Làm bài kiểm tra
          </button>
          <button className={activeTab === "calendar" ? "active" : ""} onClick={() => setActiveTab("calendar")}>
            📅 Lịch nộp bài
          </button>
          <button className={activeTab === "completed" ? "active" : ""} onClick={() => setActiveTab("completed")}>
            ✅ Bài đã hoàn thành
          </button>
          <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
            👤 Thông tin tài khoản
          </button>
        </div>
        
        <div className="navbar-right">
          {/* Hệ thống thông báo */}
          <div className="notification-wrapper">
            <NotificationSystem 
              userRole="student" 
              classes={joinedClasses} 
              currentUser={studentInfo} 
            />
          </div>
        </div>
      </nav>

      {/* Nội dung từng tab */}
      <div className={`content ${activeTab === "classes" ? "active" : ""}`}>
        <h2>📚 Quản lý lớp học</h2>
        
        {/* Form tham gia lớp học */}
        <div className="join-class-section">
          <h3>Tham gia lớp học mới</h3>
          <div className="join-class-form">
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã lớp (VD: ABC123)"
              maxLength={10}
            />
            <button onClick={handleSearchClass} className="btn-search">
              🔍 Tìm kiếm
            </button>
          </div>

          {/* Kết quả tìm kiếm */}
          {searchResult && (
            <div className="search-result">
              <h4>Tìm thấy lớp học:</h4>
              <div className="class-info-card">
                <h5>{searchResult.name}</h5>
                <p><strong>Môn học:</strong> {searchResult.subject}</p>
                <p><strong>Giáo viên:</strong> {searchResult.teacherName}</p>
                <p><strong>Số học sinh:</strong> {searchResult.students.length}</p>
                {searchResult.description && (
                  <p><strong>Mô tả:</strong> {searchResult.description}</p>
                )}
                <button 
                  onClick={handleJoinClass}
                  disabled={isJoining}
                  className="btn-join"
                >
                  {isJoining ? 'Đang tham gia...' : 'Tham gia lớp học'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Danh sách lớp đã tham gia */}
        <div className="joined-classes-section">
          <h3>Lớp học đã tham gia ({joinedClasses.length})</h3>
          {joinedClasses.length === 0 ? (
            <p className="no-classes">Bạn chưa tham gia lớp học nào. Hãy sử dụng mã lớp để tham gia!</p>
          ) : (
            <div className="classes-grid">
              {joinedClasses.map((cls) => (
                <div key={cls.id} className="class-card">
                  <h4>{cls.name}</h4>
                  <p><strong>Mã lớp:</strong> {cls.code}</p>
                  <p><strong>Môn học:</strong> {cls.subject}</p>
                  <p><strong>Giáo viên:</strong> {cls.teacherName}</p>
                  <p><strong>Số bài tập:</strong> {cls.assignments.length}</p>
                  <p><strong>Ngày tham gia:</strong> {
                    new Date(cls.students.find(s => s.id === studentInfo.id)?.joinedAt || cls.createdAt)
                      .toLocaleDateString('vi-VN')
                  }</p>
                  <div className="class-actions">
                    <button 
                      className="btn-view-assignments"
                      onClick={() => handleViewClass(cls.id)}
                    >
                      📚 Xem chi tiết lớp
                    </button>
                    <button className="btn-assignments-count">
                      📝 {cls.assignments.length} bài tập
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`content ${activeTab === "pending" ? "active" : ""}`}>
        <StudentTest />
      </div>

      <div className={`content ${activeTab === "calendar" ? "active" : ""}`}>
        <StudentCalendar />
      </div>

      <div className={`content ${activeTab === "completed" ? "active" : ""}`}>
        <h2>✅ Bài đã hoàn thành</h2>
        <p>Danh sách các bài luận bạn đã nộp.</p>
      </div>

      <div className={`content ${activeTab === "profile" ? "active" : ""}`}>
        <h2>👤 Thông tin tài khoản</h2>

        {isEditing ? (
          <div className="edit-form">
            {/* Upload ảnh đại diện */}
            <div className="avatar-upload">
              <img src={studentInfo.avatar} alt="Avatar" className="avatar-preview" />
              <label className="upload-btn">
                📷 Chọn ảnh
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>

            <label>Họ và tên:</label>
            <input type="text" name="name" value={studentInfo.name} onChange={handleChange} />

            <label>Mã số sinh viên:</label>
            <input type="text" name="studentId" value={studentInfo.studentId} onChange={handleChange} />

            <label>Ngày sinh:</label>
            <input type="date" name="birthDate" value={studentInfo.birthDate} onChange={handleChange} />

            <label>Giới tính:</label>
            <select name="gender" value={studentInfo.gender} onChange={handleChange}>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>

            <button className="save-button" onClick={() => setIsEditing(false)}>💾 Lưu</button>
          </div>
        ) : (
          <div className="profile-view">
            <img src={studentInfo.avatar} alt="Avatar" className="avatar-display" />
            <p><strong>Họ và tên:</strong> {studentInfo.name}</p>
            <p><strong>Mã số sinh viên:</strong> {studentInfo.studentId}</p>
            <p><strong>Ngày sinh:</strong> {studentInfo.birthDate}</p>
            <p><strong>Giới tính:</strong> {studentInfo.gender}</p>
            <button className="edit-button" onClick={() => setIsEditing(true)}>✏️ Chỉnh sửa</button>
            <button className="logout-button" onClick={handleLogout}>🚪 Đăng xuất</button>
          </div>
        )}
      </div>

      {/* Chi tiết lớp học và bài tập */}
      <div className={`content ${activeTab === "classDetails" ? "active" : ""}`}>
        {selectedClassId && (
          <div className="class-details">
            <div className="class-header">
              <button 
                className="back-button"
                onClick={() => setActiveTab("classes")}
              >
                ← Quay lại danh sách lớp
              </button>
              <h2>Chi tiết lớp học</h2>
            </div>

            {/* Tab navigation cho lớp học */}
            <div className="class-tabs">
              <button 
                className={activeClassTab === "assignments" ? "active" : ""}
                onClick={() => setActiveClassTab("assignments")}
              >
                📝 Bài tập
              </button>
              <button 
                className={activeClassTab === "grades" ? "active" : ""}
                onClick={() => setActiveClassTab("grades")}
              >
                📊 Điểm số
              </button>
            </div>

            {/* Danh sách bài tập */}
            {activeClassTab === "assignments" && (
              <div className="assignments-section">
                <h3>Danh sách bài tập</h3>
                <div className="assignments-grid">
                  {assignments.map(assignment => (
                    <div key={assignment.id} className={`assignment-card ${assignment.status}`}>
                      <div className="assignment-header">
                        <h4>{assignment.title}</h4>
                        <span className={`status-badge ${assignment.status}`}>
                          {assignment.status === 'pending' && '⏳ Chưa nộp'}
                          {assignment.status === 'submitted' && '✅ Đã nộp'}
                          {assignment.status === 'graded' && '📊 Đã chấm'}
                        </span>
                      </div>
                      
                      <p className="assignment-description">{assignment.description}</p>
                      
                      <div className="assignment-meta">
                        <span className="due-date">📅 Hạn nộp: {assignment.dueDate}</span>
                        <span className="max-score">📈 Điểm tối đa: {assignment.maxScore}</span>
                      </div>

                      {assignment.status === 'pending' && (
                        <button 
                          className="submit-button"
                          onClick={() => navigate(`/assignment/${assignment.id}`)}
                        >
                          📝 Làm bài
                        </button>
                      )}

                      {assignment.status === 'graded' && (
                        <div className="grade-info">
                          <div className="score">Điểm: {assignment.score}/{assignment.maxScore}</div>
                          {assignment.feedback && (
                            <div className="feedback">
                              <strong>Nhận xét:</strong> {assignment.feedback}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bảng điểm */}
            {activeClassTab === "grades" && (
              <div className="grades-section">
                <h3>Bảng điểm</h3>
                <div className="grades-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Bài tập</th>
                        <th>Ngày nộp</th>
                        <th>Điểm</th>
                        <th>Nhận xét</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.filter(a => a.status === 'graded').map(assignment => (
                        <tr key={assignment.id}>
                          <td>{assignment.title}</td>
                          <td>{assignment.submittedAt ? new Date(assignment.submittedAt).toLocaleDateString() : '-'}</td>
                          <td className="score-cell">{assignment.score}/{assignment.maxScore}</td>
                          <td>{assignment.feedback || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hệ thống Chat */}
      <ChatSystem 
        userRole="student" 
        currentUser={studentInfo} 
        classes={joinedClasses} 
      />
    </div>
  );
};

export default Student;

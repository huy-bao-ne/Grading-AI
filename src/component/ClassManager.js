import React, { useState, useEffect } from 'react';
import ClassStructure from './ClassStructure.js';
import ClassDataManager from '../utils/classDataManager.js';
import '../style/globals.css';
import '../style/classmanager.css';

function ClassManager() {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState('');
  const [classSubject, setClassSubject] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [selectedClassIdx, setSelectedClassIdx] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [showClassStructure, setShowClassStructure] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Load classes từ storage khi component mount
  useEffect(() => {
    loadTeacherClasses();
  }, []);

  const loadTeacherClasses = () => {
    // Lấy teacher ID từ localStorage hoặc tạm thời dùng fixed ID
    const teacherId = localStorage.getItem('teacherId') || 'teacher_001';
    const teacherClasses = ClassDataManager.getTeacherClasses(teacherId);
    setClasses(teacherClasses);
  };

  // Tạo lớp học mới
  const handleAddClass = async () => {
    if (className.trim() === '' || classSubject.trim() === '') {
      alert('Vui lòng nhập đầy đủ tên lớp và môn học!');
      return;
    }

    setIsCreating(true);

    try {
      const teacherId = localStorage.getItem('teacherId') || 'teacher_001';
      const teacherName = localStorage.getItem('userName') || 'Giáo viên';
      
      const classData = {
        name: className.trim(),
        subject: classSubject.trim(),
        description: classDescription.trim(),
        teacherName: teacherName
      };

      const newClass = ClassDataManager.createClass(classData, teacherId);
      
      if (newClass) {
        // Cập nhật danh sách lớp
        loadTeacherClasses();
        
        // Reset form
        setClassName('');
        setClassSubject('');
        setClassDescription('');
        setShowCreateForm(false);
        
        alert(`Tạo lớp học thành công!\nMã lớp: ${newClass.code}\nHãy chia sẻ mã này với học sinh để họ tham gia lớp.`);
      } else {
        alert('Lỗi khi tạo lớp học. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Có lỗi xảy ra khi tạo lớp học!');
    } finally {
      setIsCreating(false);
    }
  };

  // Chọn lớp để quản lý
  const handleSelectClass = (idx) => {
    setSelectedClassIdx(idx);
  };

  // Mở cấu trúc lớp học chi tiết
  const handleOpenClassStructure = (cls) => {
    setSelectedClass(cls);
    setShowClassStructure(true);
  };

  // Quay lại danh sách lớp
  const handleBackToClassList = () => {
    setShowClassStructure(false);
    setSelectedClass(null);
    loadTeacherClasses(); // Reload để cập nhật dữ liệu mới nhất
  };

  // Thêm học sinh vào lớp được chọn (thực tế học sinh sẽ tự tham gia bằng mã lớp)
  const handleAddStudent = () => {
    if (studentName.trim() !== '' && selectedClassIdx !== null) {
      const studentData = {
        id: 'student_' + Date.now(),
        name: studentName.trim(),
        email: '',
      };

      const classId = classes[selectedClassIdx].id;
      const result = ClassDataManager.joinClass(classes[selectedClassIdx].code, studentData);
      
      if (result.success) {
        loadTeacherClasses(); // Reload classes
        setStudentName('');
        alert('Thêm học sinh thành công!');
      } else {
        alert(result.message);
      }
    }
  };

  // Xóa lớp học
  const handleDeleteClass = (classId, className) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa lớp "${className}"?`)) {
      const teacherId = localStorage.getItem('teacherId') || 'teacher_001';
      const success = ClassDataManager.deleteClass(classId, teacherId);
      
      if (success) {
        loadTeacherClasses();
        alert('Xóa lớp học thành công!');
      } else {
        alert('Lỗi khi xóa lớp học!');
      }
    }
  };

  // Hiển thị ClassStructure nếu được chọn
  if (showClassStructure && selectedClass) {
    return (
      <ClassStructure 
        selectedClass={selectedClass} 
        onBack={handleBackToClassList}
      />
    );
  }

  return (
    <div className="class-manager">
      <div className="class-manager-header">
        <h2>Quản lý lớp học</h2>
        <div className="class-stats">
          <span>Tổng số lớp: {classes.length}</span>
          <span>Tổng học sinh: {classes.reduce((sum, cls) => sum + cls.students.length, 0)}</span>
        </div>
      </div>

      {/* Form tạo lớp học mới */}
      <div className="create-class-section">
        {!showCreateForm ? (
          <button 
            className="btn-create-class"
            onClick={() => setShowCreateForm(true)}
          >
            + Tạo lớp học mới
          </button>
        ) : (
          <div className="create-class-form">
            <h3>Tạo lớp học mới</h3>
            <div className="form-group">
              <label>Tên lớp học:</label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="VD: Toán cao cấp A1"
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label>Môn học:</label>
              <input
                type="text"
                value={classSubject}
                onChange={(e) => setClassSubject(e.target.value)}
                placeholder="VD: Toán học, Văn học, Lịch sử..."
                maxLength={30}
              />
            </div>

            <div className="form-group">
              <label>Mô tả (tùy chọn):</label>
              <textarea
                value={classDescription}
                onChange={(e) => setClassDescription(e.target.value)}
                placeholder="Mô tả về lớp học..."
                rows={3}
                maxLength={200}
              />
            </div>

            <div className="form-actions">
              <button 
                onClick={handleAddClass}
                disabled={isCreating}
                className="btn-submit"
              >
                {isCreating ? 'Đang tạo...' : 'Tạo lớp học'}
              </button>
              <button 
                onClick={() => {
                  setShowCreateForm(false);
                  setClassName('');
                  setClassSubject('');
                  setClassDescription('');
                }}
                className="btn-cancel"
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Danh sách lớp học */}
      <div className="classes-list">
        {classes.length === 0 ? (
          <div className="no-classes">
            <p>Chưa có lớp học nào. Hãy tạo lớp học đầu tiên!</p>
          </div>
        ) : (
          classes.map((cls, index) => (
            <div key={cls.id} className="class-card">
              <div className="class-header">
                <h3>{cls.name}</h3>
                <div className="class-actions">
                  <button 
                    onClick={() => handleOpenClassStructure(cls)}
                    className="btn-manage"
                  >
                    Quản lý
                  </button>
                  <button 
                    onClick={() => handleDeleteClass(cls.id, cls.name)}
                    className="btn-delete"
                  >
                    Xóa
                  </button>
                </div>
              </div>
              
              <div className="class-info">
                <div className="class-detail">
                  <span className="label">Mã lớp:</span>
                  <span className="class-code">{cls.code}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(cls.code);
                      alert('Đã copy mã lớp!');
                    }}
                    className="btn-copy"
                  >
                    📋
                  </button>
                </div>
                <div className="class-detail">
                  <span className="label">Môn học:</span>
                  <span>{cls.subject}</span>
                </div>
                <div className="class-detail">
                  <span className="label">Số học sinh:</span>
                  <span>{cls.students.length}</span>
                </div>
                <div className="class-detail">
                  <span className="label">Bài tập:</span>
                  <span>{cls.assignments.length}</span>
                </div>
                {cls.description && (
                  <div className="class-detail">
                    <span className="label">Mô tả:</span>
                    <span>{cls.description}</span>
                  </div>
                )}
                <div className="class-detail">
                  <span className="label">Ngày tạo:</span>
                  <span>{new Date(cls.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Debug info (có thể ẩn trong production) */}
      <div className="debug-info" style={{marginTop: '20px', padding: '10px', background: '#f0f0f0', fontSize: '12px'}}>
        <strong>Debug Info:</strong> {JSON.stringify(ClassDataManager.getStorageInfo())}
      </div>
    </div>
  );
}

export default ClassManager;
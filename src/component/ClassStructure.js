import React, { useState } from 'react';
import '../style/class-structure.css';

const ClassStructure = ({ selectedClass, onBack, setClasses }) => {
  const [expandedFolders, setExpandedFolders] = useState({
    general: true,
    assignments: false,
    materials: false,
    grades: false,
    students: false
  });

  // State cho việc tạo bài tập mới
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    deadline: '',
    timeLimit: '',
    maxScore: 10,
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    sampleAnswer: ''
  });

  // State cho thông báo
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    priority: 'normal'
  });

  // State cho tài liệu
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    description: '',
    category: 'lecture',
    date: new Date().toISOString().split('T')[0],
    files: []
  });

  // Toggle mở/đóng folder
  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // Thêm câu hỏi vào bài tập
  const handleAddQuestion = () => {
    if (currentQuestion.question.trim()) {
      setNewAssignment({
        ...newAssignment,
        questions: [...newAssignment.questions, {
          id: Date.now(),
          question: currentQuestion.question,
          sampleAnswer: currentQuestion.sampleAnswer
        }]
      });
      setCurrentQuestion({ question: '', sampleAnswer: '' });
    }
  };

  // Xóa câu hỏi
  const handleRemoveQuestion = (questionId) => {
    setNewAssignment({
      ...newAssignment,
      questions: newAssignment.questions.filter(q => q.id !== questionId)
    });
  };

  // Tạo bài tập mới
  const handleCreateAssignment = () => {
    if (newAssignment.title.trim() && newAssignment.questions.length > 0) {
      const assignment = {
        ...newAssignment,
        id: Date.now(),
        createdAt: new Date().toLocaleDateString()
      };

      // Cập nhật class assignments
      if (setClasses) {
        setClasses(prevClasses => 
          prevClasses.map(cls => 
            cls.code === selectedClass.code 
              ? { ...cls, assignments: [...(cls.assignments || []), assignment] }
              : cls
          )
        );
      }

      // Reset form
      setNewAssignment({
        title: '',
        description: '',
        deadline: '',
        timeLimit: '',
        maxScore: 10,
        questions: []
      });
      setShowCreateAssignment(false);
      setActiveContent({ type: 'assignment-list' });
    }
  };

  // Tạo thông báo mới
  const handleCreateAnnouncement = () => {
    if (newAnnouncement.title.trim() && newAnnouncement.content.trim()) {
      const announcement = {
        ...newAnnouncement,
        id: Date.now(),
        createdAt: new Date().toLocaleDateString(),
        createdTime: new Date().toLocaleTimeString()
      };

      // Cập nhật class announcements
      if (setClasses) {
        setClasses(prevClasses => 
          prevClasses.map(cls => 
            cls.code === selectedClass.code 
              ? { ...cls, announcements: [...(cls.announcements || []), announcement] }
              : cls
          )
        );
      }

      // Reset form
      setNewAnnouncement({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        priority: 'normal'
      });
      setActiveContent({ type: 'announcements' });
    }
  };

  // Upload tài liệu mới
  const handleUploadMaterials = () => {
    if (newMaterial.name.trim() && newMaterial.files.length > 0) {
      const material = {
        ...newMaterial,
        id: Date.now(),
        uploadedAt: new Date().toLocaleDateString(),
        files: newMaterial.files.map(file => ({
          name: file.name,
          size: file.size,
          url: URL.createObjectURL(file) // Trong thực tế sẽ upload lên server
        }))
      };

      // Cập nhật class materials
      if (setClasses) {
        setClasses(prevClasses => 
          prevClasses.map(cls => 
            cls.code === selectedClass.code 
              ? { ...cls, materials: [...(cls.materials || []), material] }
              : cls
          )
        );
      }

      // Reset form
      setNewMaterial({
        name: '',
        description: '',
        category: 'lecture',
        date: new Date().toISOString().split('T')[0],
        files: []
      });
      setActiveContent({ type: 'materials-list' });
    }
  };

  // Xóa học sinh khỏi lớp
  const handleRemoveStudent = (studentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này khỏi lớp?')) {
      if (setClasses) {
        setClasses(prevClasses => 
          prevClasses.map(cls => 
            cls.code === selectedClass.code 
              ? { 
                  ...cls, 
                  students: cls.students?.filter(student => student.id !== studentId) || []
                }
              : cls
          )
        );
      }
      alert('Đã xóa học sinh khỏi lớp thành công!');
    }
  };

  // Xóa bài tập
  const handleDeleteAssignment = (assignmentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài tập này? Tất cả dữ liệu liên quan sẽ bị mất vĩnh viễn.')) {
      if (setClasses) {
        setClasses(prevClasses => 
          prevClasses.map(cls => 
            cls.code === selectedClass.code 
              ? { 
                  ...cls, 
                  assignments: cls.assignments?.filter(assignment => assignment.id !== assignmentId) || []
                }
              : cls
          )
        );
      }
      alert('Đã xóa bài tập thành công!');
    }
  };

  // Gia hạn deadline bài tập
  const handleExtendDeadline = (assignmentId, newDeadline) => {
    if (setClasses) {
      setClasses(prevClasses => 
        prevClasses.map(cls => 
          cls.code === selectedClass.code 
            ? { 
                ...cls, 
                assignments: cls.assignments?.map(assignment => 
                  assignment.id === assignmentId 
                    ? { ...assignment, deadline: newDeadline }
                    : assignment
                ) || []
              }
            : cls
        )
      );
    }
    alert('Đã cập nhật deadline thành công!');
  };

  // Cấu trúc dữ liệu cho lớp học (đã được đơn giản hóa)
  const classStructure = {
    general: {
      icon: '📋',
      name: 'Thông tin chung',
      items: [
        { icon: '📄', name: 'Thông báo lớp học', type: 'announcements' },
        { icon: '➕', name: 'Tạo thông báo mới', type: 'create-announcement' }
      ]
    },
    assignments: {
      icon: '📝',
      name: 'Bài tập & Kiểm tra',
      items: [
        { icon: '📋', name: 'Danh sách bài tập', type: 'assignment-list', count: selectedClass?.assignments?.length || 0 },
        { icon: '➕', name: 'Tạo bài tập mới', type: 'create-assignment' }
      ]
    },
    materials: {
      icon: '📚',
      name: 'Tài liệu học tập',
      items: [
        { icon: '�', name: 'Danh sách tài liệu', type: 'materials-list' },
        { icon: '⬆️', name: 'Upload tài liệu mới', type: 'upload-materials' }
      ]
    },
    students: {
      icon: '👥',
      name: 'Quản lý học sinh',
      items: [
        { icon: '📋', name: 'Danh sách học sinh', type: 'student-list', count: selectedClass?.students?.length || 0 },
        { icon: '�️', name: 'Xóa học sinh', type: 'remove-student' }
      ]
    },
    grades: {
      icon: '📊',
      name: 'Quản lý điểm số',
      items: [
        { icon: '📈', name: 'Bảng điểm tổng kết', type: 'grade-summary' },
        { icon: '📋', name: 'Nhập điểm', type: 'grade-input' }
      ]
    }
  };

  const [activeContent, setActiveContent] = useState(null);

  // Xử lý click vào item
  const handleItemClick = (type, item) => {
    if (type === 'create-assignment') {
      setShowCreateAssignment(true);
      setActiveContent({ type: 'create-assignment' });
    } else {
      setActiveContent({ type, item, class: selectedClass });
    }
  };

  // Render nội dung chi tiết
  const renderContent = () => {
    if (!activeContent) {
      return (
        <div className="welcome-content">
          <div className="welcome-icon">🏫</div>
          <h2>Chào mừng đến với lớp {selectedClass.name}</h2>
          <p>Mã lớp: <strong>{selectedClass.code}</strong></p>
          <p>Số học sinh: <strong>{selectedClass.students?.length || 0}</strong></p>
          <p>Số bài tập: <strong>{selectedClass.assignments?.length || 0}</strong></p>
          <div className="quick-actions">
            <h3>🚀 Hành động nhanh:</h3>
            <button onClick={() => handleItemClick('assignment-list')} className="quick-btn">
              📝 Xem bài tập
            </button>
            <button onClick={() => handleItemClick('create-assignment')} className="quick-btn">
              ➕ Tạo bài tập mới
            </button>
            <button onClick={() => handleItemClick('student-list')} className="quick-btn">
              👥 Quản lý học sinh
            </button>
            <button onClick={() => handleItemClick('announcements')} className="quick-btn">
              📢 Thông báo
            </button>
          </div>
        </div>
      );
    }

    // Render nội dung dựa trên type
    switch (activeContent.type) {
      case 'assignment-list':
        return (
          <div className="content-panel">
            <h3>📋 Danh sách bài tập - {selectedClass.name}</h3>
            {selectedClass.assignments && selectedClass.assignments.length > 0 ? (
              <div className="assignment-grid">
                {selectedClass.assignments.map(assignment => (
                  <div key={assignment.id} className="assignment-card">
                    <div className="assignment-header">
                      <h4>{assignment.title}</h4>
                      <span className="assignment-status">📝</span>
                    </div>
                    <p className="assignment-description">{assignment.description}</p>
                    <div className="assignment-meta">
                      <span>⏰ Deadline: {assignment.deadline ? new Date(assignment.deadline).toLocaleString('vi-VN') : 'Chưa set'}</span>
                      <span>📊 Điểm tối đa: {assignment.maxScore}</span>
                      <span>❓ Số câu hỏi: {assignment.questions?.length || 0}</span>
                      {assignment.deadline && (
                        <span className={`deadline-status ${new Date(assignment.deadline) < new Date() ? 'overdue' : 'active'}`}>
                          {new Date(assignment.deadline) < new Date() 
                            ? '🔴 Đã quá hạn' 
                            : `🟢 Còn ${Math.ceil((new Date(assignment.deadline) - new Date()) / (1000 * 60 * 60 * 24))} ngày`
                          }
                        </span>
                      )}
                    </div>
                    
                    <div className="assignment-actions">
                      <div className="extend-deadline-section">
                        <label>🕐 Gia hạn deadline:</label>
                        <input
                          type="datetime-local"
                          defaultValue={assignment.deadline}
                          onChange={(e) => {
                            if (e.target.value && window.confirm('Bạn muốn cập nhật deadline mới cho bài tập này?')) {
                              handleExtendDeadline(assignment.id, e.target.value);
                            }
                          }}
                          className="deadline-input"
                        />
                      </div>
                      
                      <button 
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="delete-assignment-btn"
                        title="Xóa bài tập này"
                      >
                        🗑️ Xóa bài tập
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span>📭</span>
                <p>Chưa có bài tập nào</p>
              </div>
            )}
          </div>
        );

      case 'student-list':
        return (
          <div className="content-panel">
            <h3>👥 Danh sách học sinh - {selectedClass.name}</h3>
            {selectedClass.students && selectedClass.students.length > 0 ? (
              <div className="student-table">
                <table>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Họ và tên</th>
                      <th>Mã học sinh</th>
                      <th>Trạng thái</th>
                      <th>Điểm TB</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClass.students.map((student, index) => (
                      <tr key={student.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="student-info">
                            <span className="student-avatar">👤</span>
                            {student.name}
                          </div>
                        </td>
                        <td>{student.id}</td>
                        <td>
                          <span className="status-badge active">🟢 Đang học</span>
                        </td>
                        <td>
                          <span className="grade-badge">8.5</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <span>👥</span>
                <p>Chưa có học sinh nào</p>
              </div>
            )}
          </div>
        );

      case 'announcements':
        return (
          <div className="content-panel">
            <h3>📢 Thông báo lớp học - {selectedClass.name}</h3>
            {selectedClass.announcements && selectedClass.announcements.length > 0 ? (
              <div className="announcements-list">
                {selectedClass.announcements.map((announcement, index) => (
                  <div key={index} className={`announcement-item priority-${announcement.priority}`}>
                    <div className="announcement-header">
                      <h4>
                        {announcement.priority === 'urgent' ? '🚨' : 
                         announcement.priority === 'important' ? '⚠️' : '📢'} 
                        {announcement.title}
                      </h4>
                      <span className="announcement-date">{announcement.date}</span>
                    </div>
                    <p>{announcement.content}</p>
                  </div>
                ))}
                
                {/* Sample announcements for demo */}
                <div className="announcement-item">
                  <div className="announcement-header">
                    <h4>📝 Thông báo về bài kiểm tra giữa kỳ</h4>
                    <span className="announcement-date">10/09/2025</span>
                  </div>
                  <p>Bài kiểm tra giữa kỳ sẽ được tổ chức vào ngày 20/09/2025. Các em chuẩn bị tốt kiến thức đã học.</p>
                </div>
                <div className="announcement-item">
                  <div className="announcement-header">
                    <h4>📚 Tài liệu mới đã được cập nhật</h4>
                    <span className="announcement-date">08/09/2025</span>
                  </div>
                  <p>Đã cập nhật tài liệu mới cho chương 3. Các em có thể tải về trong mục tài liệu học tập.</p>
                </div>
              </div>
            ) : (
              <div className="announcements-list">
                {/* Sample announcements for demo */}
                <div className="announcement-item">
                  <div className="announcement-header">
                    <h4>📝 Thông báo về bài kiểm tra giữa kỳ</h4>
                    <span className="announcement-date">10/09/2025</span>
                  </div>
                  <p>Bài kiểm tra giữa kỳ sẽ được tổ chức vào ngày 20/09/2025. Các em chuẩn bị tốt kiến thức đã học.</p>
                </div>
                <div className="announcement-item">
                  <div className="announcement-header">
                    <h4>📚 Tài liệu mới đã được cập nhật</h4>
                    <span className="announcement-date">08/09/2025</span>
                  </div>
                  <p>Đã cập nhật tài liệu mới cho chương 3. Các em có thể tải về trong mục tài liệu học tập.</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'create-assignment':
        return (
          <div className="content-panel">
            <h3>➕ Tạo bài tập mới - {selectedClass.name}</h3>
            
            <div className="create-assignment-form">
              {/* Thông tin cơ bản */}
              <div className="form-section">
                <h4>📝 Thông tin bài tập</h4>
                <input
                  type="text"
                  placeholder="Tiêu đề bài tập"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  className="title-input"
                />
                
                <textarea
                  placeholder="Mô tả bài tập (tùy chọn)"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  className="description-input"
                />
                
                <div className="assignment-settings">
                  <div className="setting-item">
                    <label>⏰ Deadline:</label>
                    <input
                      type="datetime-local"
                      value={newAssignment.deadline}
                      onChange={(e) => setNewAssignment({...newAssignment, deadline: e.target.value})}
                    />
                  </div>
                  
                  <div className="setting-item">
                    <label>⏱️ Thời gian làm bài (phút):</label>
                    <input
                      type="number"
                      placeholder="60"
                      value={newAssignment.timeLimit}
                      onChange={(e) => setNewAssignment({...newAssignment, timeLimit: e.target.value})}
                    />
                  </div>
                  
                  <div className="setting-item">
                    <label>📊 Điểm tối đa:</label>
                    <input
                      type="number"
                      value={newAssignment.maxScore}
                      onChange={(e) => setNewAssignment({...newAssignment, maxScore: e.target.value})}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              {/* Thêm câu hỏi */}
              <div className="form-section">
                <h4>❓ Thêm câu hỏi</h4>
                <textarea
                  placeholder="Nhập câu hỏi..."
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                  className="question-input"
                />
                
                <textarea
                  placeholder="Gợi ý trả lời hoặc đáp án mẫu (tùy chọn)..."
                  value={currentQuestion.sampleAnswer}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, sampleAnswer: e.target.value})}
                  className="answer-input"
                />
                
                <button 
                  onClick={handleAddQuestion}
                  className="add-question-btn"
                  disabled={!currentQuestion.question.trim()}
                >
                  ➕ Thêm câu hỏi
                </button>
              </div>

              {/* Danh sách câu hỏi đã thêm */}
              {newAssignment.questions.length > 0 && (
                <div className="form-section">
                  <h4>📋 Câu hỏi đã thêm ({newAssignment.questions.length})</h4>
                  <div className="questions-list">
                    {newAssignment.questions.map((q, idx) => (
                      <div key={q.id} className="question-item">
                        <div className="question-header">
                          <strong>Câu {idx + 1}:</strong>
                          <button 
                            onClick={() => handleRemoveQuestion(q.id)}
                            className="remove-btn"
                          >
                            🗑️ Xóa
                          </button>
                        </div>
                        <p className="question-text">{q.question}</p>
                        {q.sampleAnswer && (
                          <div className="sample-answer">
                            <strong>💡 Gợi ý:</strong>
                            <p>{q.sampleAnswer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="form-actions">
                <button 
                  onClick={() => {
                    setShowCreateAssignment(false);
                    setActiveContent({ type: 'assignment-list' });
                  }}
                  className="cancel-btn"
                >
                  ❌ Hủy
                </button>
                
                <button 
                  onClick={handleCreateAssignment}
                  className="create-btn"
                  disabled={!newAssignment.title.trim() || newAssignment.questions.length === 0}
                >
                  📤 Tạo và giao bài tập
                </button>
              </div>
            </div>
          </div>
        );

      case 'create-announcement':
        return (
          <div className="content-panel">
            <h3>📢 Tạo thông báo mới - {selectedClass.name}</h3>
            
            <div className="create-announcement-form">
              <div className="form-section">
                <h4>📝 Nội dung thông báo</h4>
                <input
                  type="text"
                  placeholder="Tiêu đề thông báo"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  className="title-input"
                />
                
                <textarea
                  placeholder="Nội dung chi tiết thông báo..."
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  className="content-input"
                  rows="6"
                />
                
                <div className="announcement-settings">
                  <div className="setting-item">
                    <label>📅 Ngày đăng:</label>
                    <input
                      type="date"
                      value={newAnnouncement.date}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, date: e.target.value})}
                    />
                  </div>
                  
                  <div className="setting-item">
                    <label>🔔 Mức độ ưu tiên:</label>
                    <select
                      value={newAnnouncement.priority}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                    >
                      <option value="normal">🔔 Bình thường</option>
                      <option value="important">⚠️ Quan trọng</option>
                      <option value="urgent">🚨 Khẩn cấp</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  onClick={() => setActiveContent({ type: 'announcements' })}
                  className="cancel-btn"
                >
                  ❌ Hủy
                </button>
                
                <button 
                  onClick={handleCreateAnnouncement}
                  className="create-btn"
                  disabled={!newAnnouncement.title.trim() || !newAnnouncement.content.trim()}
                >
                  📤 Đăng thông báo
                </button>
              </div>
            </div>
          </div>
        );

      case 'upload-materials':
        return (
          <div className="content-panel">
            <h3>📚 Tải lên tài liệu - {selectedClass.name}</h3>
            
            <div className="upload-materials-form">
              <div className="form-section">
                <h4>📁 Thông tin tài liệu</h4>
                <input
                  type="text"
                  placeholder="Tên tài liệu"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                  className="title-input"
                />
                
                <textarea
                  placeholder="Mô tả tài liệu (tùy chọn)..."
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
                  className="description-input"
                  rows="3"
                />
                
                <div className="material-settings">
                  <div className="setting-item">
                    <label>📂 Danh mục:</label>
                    <select
                      value={newMaterial.category}
                      onChange={(e) => setNewMaterial({...newMaterial, category: e.target.value})}
                    >
                      <option value="lecture">📖 Bài giảng</option>
                      <option value="reference">📚 Tài liệu tham khảo</option>
                      <option value="exercise">📝 Bài tập</option>
                      <option value="exam">📊 Đề thi</option>
                      <option value="other">📄 Khác</option>
                    </select>
                  </div>
                  
                  <div className="setting-item">
                    <label>📅 Ngày tải lên:</label>
                    <input
                      type="date"
                      value={newMaterial.date}
                      onChange={(e) => setNewMaterial({...newMaterial, date: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="file-upload-area">
                  <label htmlFor="file-upload" className="file-upload-label">
                    <span className="upload-icon">📤</span>
                    <span>Chọn file để tải lên</span>
                    <span className="file-info">(PDF, DOC, PPT, ảnh...)</span>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={(e) => setNewMaterial({...newMaterial, files: Array.from(e.target.files)})}
                    className="file-input"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.png,.gif"
                  />
                  
                  {newMaterial.files.length > 0 && (
                    <div className="selected-files">
                      <h5>📎 File đã chọn:</h5>
                      {newMaterial.files.map((file, index) => (
                        <div key={index} className="file-item">
                          <span>📄 {file.name}</span>
                          <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button 
                  onClick={() => setActiveContent({ type: 'materials-list' })}
                  className="cancel-btn"
                >
                  ❌ Hủy
                </button>
                
                <button 
                  onClick={handleUploadMaterials}
                  className="create-btn"
                  disabled={!newMaterial.name.trim() || newMaterial.files.length === 0}
                >
                  📤 Tải lên tài liệu
                </button>
              </div>
            </div>
          </div>
        );

      case 'materials-list':
        return (
          <div className="content-panel">
            <h3>📚 Danh sách tài liệu - {selectedClass.name}</h3>
            {selectedClass.materials && selectedClass.materials.length > 0 ? (
              <div className="materials-list">
                {selectedClass.materials.map((material, index) => (
                  <div key={index} className="material-item">
                    <div className="material-header">
                      <span className="material-icon">
                        {material.category === 'lecture' ? '📖' : 
                         material.category === 'reference' ? '📚' :
                         material.category === 'exercise' ? '📝' :
                         material.category === 'exam' ? '📊' : '📄'}
                      </span>
                      <h4>{material.name}</h4>
                      <span className="material-date">{material.date}</span>
                    </div>
                    {material.description && (
                      <p className="material-description">{material.description}</p>
                    )}
                    <div className="material-files">
                      {material.files.map((file, fileIndex) => (
                        <div key={fileIndex} className="file-link">
                          <span>📎</span>
                          <span>{file.name}</span>
                          <button className="download-btn">⬇️ Tải về</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span>📚</span>
                <p>Chưa có tài liệu nào</p>
              </div>
            )}
          </div>
        );

      case 'remove-student':
        return (
          <div className="content-panel">
            <h3>🗑️ Xóa học sinh - {selectedClass.name}</h3>
            {selectedClass.students && selectedClass.students.length > 0 ? (
              <div className="remove-student-list">
                <div className="warning-message">
                  <span className="warning-icon">⚠️</span>
                  <p><strong>Cảnh báo:</strong> Việc xóa học sinh sẽ loại bỏ tất cả dữ liệu liên quan đến học sinh này trong lớp học (điểm số, bài nộp, v.v.)</p>
                </div>
                
                <div className="students-grid">
                  {selectedClass.students.map((student, index) => (
                    <div key={student.id || index} className="student-remove-card">
                      <div className="student-info">
                        <div className="student-avatar">
                          <span>👤</span>
                        </div>
                        <div className="student-details">
                          <h4>{student.name}</h4>
                          <p>ID: {student.id || `STD${index + 1}`}</p>
                          <p>Email: {student.email || 'Chưa có email'}</p>
                          {student.phone && <p>SĐT: {student.phone}</p>}
                        </div>
                      </div>
                      
                      <div className="student-stats">
                        <div className="stat-item">
                          <span className="stat-label">Điểm TB:</span>
                          <span className="stat-value">{student.averageScore || 'N/A'}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Bài nộp:</span>
                          <span className="stat-value">{student.submittedAssignments || 0}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleRemoveStudent(student.id || `STD${index + 1}`)}
                        className="remove-btn"
                        title="Xóa học sinh khỏi lớp"
                      >
                        🗑️ Xóa khỏi lớp
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <span>👥</span>
                <p>Không có học sinh nào trong lớp</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="content-panel">
            <h3>🚧 Tính năng đang phát triển</h3>
            <p>Tính năng "{activeContent.item?.name}" sẽ sớm được hoàn thiện.</p>
          </div>
        );
    }
  };

  return (
    <div className="class-structure">
      <div className="class-header">
        <button onClick={onBack} className="back-btn">
          ← Quay lại
        </button>
        <div className="class-info">
          <h2>🏫 {selectedClass.name}</h2>
          <span className="class-code">Mã lớp: {selectedClass.code}</span>
        </div>
      </div>

      <div className="class-layout">
        {/* Sidebar Navigation */}
        <div className="class-sidebar">
          <div className="navigation-title">📂 Điều hướng</div>
          
          {Object.entries(classStructure).map(([folderId, folder]) => (
            <div key={folderId} className="nav-folder">
              <div 
                className={`folder-header ${expandedFolders[folderId] ? 'expanded' : ''}`}
                onClick={() => toggleFolder(folderId)}
              >
                <span className="folder-toggle">
                  {expandedFolders[folderId] ? '📂' : '📁'}
                </span>
                <span className="folder-icon">{folder.icon}</span>
                <span className="folder-name">{folder.name}</span>
                <span className="toggle-arrow">
                  {expandedFolders[folderId] ? '▼' : '▶'}
                </span>
              </div>

              {expandedFolders[folderId] && (
                <div className="folder-items">
                  {folder.items.map((item, index) => (
                    <div 
                      key={index}
                      className={`nav-item ${activeContent?.type === item.type ? 'active' : ''}`}
                      onClick={() => handleItemClick(item.type, item)}
                    >
                      <span className="item-icon">{item.icon}</span>
                      <span className="item-name">{item.name}</span>
                      {item.count !== undefined && (
                        <span className="item-count">({item.count})</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="class-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ClassStructure;

import React, { useState, useEffect } from 'react';
import '../style/profile.css';

/**
 * Modern Profile Component for both Students and Teachers
 * @param {Object} props - Component props
 * @param {Object} props.userData - User information object
 * @param {Function} props.onUpdate - Function to update user info
 * @param {Function} props.onLogout - Function to handle logout
 * @param {string} props.userType - Type of user ('student' or 'teacher')
 */
const ProfileComponent = ({ userData, onUpdate, onLogout, userType }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(userData || {});
  const [activeSection, setActiveSection] = useState('basic');

  // Ensure userData is valid before rendering
  if (!userData) {
    return <div className="profile-modern">Loading...</div>;
  }

  // Update editData when userData changes
  useEffect(() => {
    setEditData(userData || {});
  }, [userData]);

  // Handle input changes
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditData({ ...editData, avatar: imageUrl });
    }
  };

  // Save changes
  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditData(userData || {});
    setIsEditing(false);
  };

  const getDisplayName = () => {
    return userType === 'student' ? 'Học sinh' : 'Giáo viên';
  };

  const getIdLabel = () => {
    return userType === 'student' ? 'Mã số sinh viên' : 'Mã số giáo viên';
  };

  const getIdField = () => {
    return userType === 'student' ? 'studentId' : 'teacherId';
  };

  return (
    <div className="profile-modern">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-bg"></div>
        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <div className="avatar-wrapper">
              <img 
                src={isEditing ? editData.avatar : userData?.avatar} 
                alt="Profile Avatar" 
                className="profile-avatar-large"
              />
              {isEditing && (
                <label className="avatar-upload-btn">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <span className="upload-icon">📷</span>
                </label>
              )}
              <div className="avatar-status-badge">
                {userType === 'student' ? '🎓' : '👨‍🏫'}
              </div>
            </div>
            <div className="profile-basic-info">
              <h1 className="profile-name">
                {isEditing ? editData.name : (userData?.name || 'Chưa cập nhật')}
              </h1>
              <p className="profile-role">{getDisplayName()}</p>
              <p className="profile-id">
                {getIdLabel()}: {isEditing ? editData[getIdField()] : (userData?.[getIdField()] || 'Chưa cập nhật')}
              </p>
            </div>
          </div>
          
          <div className="profile-actions">
            {!isEditing ? (
              <>
                <button 
                  className="btn-edit-profile"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Chỉnh sửa thông tin
                </button>
                <button 
                  className="btn-logout-profile"
                  onClick={onLogout}
                >
                  🚪 Đăng xuất
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn-save-profile"
                  onClick={handleSave}
                >
                  💾 Lưu thay đổi
                </button>
                <button 
                  className="btn-cancel-profile"
                  onClick={handleCancel}
                >
                  ❌ Hủy bỏ
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Profile Navigation */}
      <div className="profile-nav">
        <button 
          className={`profile-nav-btn ${activeSection === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveSection('basic')}
        >
          📋 Thông tin cơ bản
        </button>
        <button 
          className={`profile-nav-btn ${activeSection === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveSection('contact')}
        >
          📞 Thông tin liên hệ
        </button>
        <button 
          className={`profile-nav-btn ${activeSection === 'academic' ? 'active' : ''}`}
          onClick={() => setActiveSection('academic')}
        >
          🎓 Thông tin học tập
        </button>
        <button 
          className={`profile-nav-btn ${activeSection === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveSection('settings')}
        >
          ⚙️ Cài đặt
        </button>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        
        {/* Basic Information */}
        {activeSection === 'basic' && (
          <div className="profile-section active">
            <h3>📋 Thông tin cơ bản</h3>
            <div className="profile-form-grid">
              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                ) : (
                  <div className="form-display">{userData.name}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">{getIdLabel()}</label>
                {isEditing ? (
                  <input
                    type="text"
                    name={getIdField()}
                    value={editData[getIdField()]}
                    onChange={handleChange}
                    className="form-input"
                  />
                ) : (
                  <div className="form-display">{userData[getIdField()]}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Ngày sinh</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="birthDate"
                    value={editData.birthDate}
                    onChange={handleChange}
                    className="form-input"
                  />
                ) : (
                  <div className="form-display">
                    {userData?.birthDate ? new Date(userData.birthDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Giới tính</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={editData.gender}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                ) : (
                  <div className="form-display">{userData.gender}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        {activeSection === 'contact' && (
          <div className="profile-section active">
            <h3>📞 Thông tin liên hệ</h3>
            <div className="profile-form-grid">
              <div className="form-group">
                <label className="form-label">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email || ''}
                    onChange={handleChange}
                    className="form-input"
                  />
                ) : (
                  <div className="form-display">{userData?.email || 'Chưa cập nhật'}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0123456789"
                  />
                ) : (
                  <div className="form-display">{userData?.phone || 'Chưa cập nhật'}</div>
                )}
              </div>

              <div className="form-group full-width">
                <label className="form-label">Địa chỉ</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={editData.address || ''}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Nhập địa chỉ của bạn"
                    rows="3"
                  />
                ) : (
                  <div className="form-display">{userData?.address || 'Chưa cập nhật'}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Academic Information */}
        {activeSection === 'academic' && (
          <div className="profile-section active">
            <h3>🎓 Thông tin {userType === 'student' ? 'học tập' : 'giảng dạy'}</h3>
            <div className="profile-form-grid">
              {userType === 'student' ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Lớp</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="class"
                        value={editData.class || ''}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="VD: 12A1"
                      />
                    ) : (
                      <div className="form-display">{userData?.class || 'Chưa cập nhật'}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Khoa/Ngành</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="major"
                        value={editData.major || ''}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="VD: Công nghệ thông tin"
                      />
                    ) : (
                      <div className="form-display">{userData?.major || 'Chưa cập nhật'}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Năm học</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="academicYear"
                        value={editData.academicYear || ''}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="VD: 2024-2025"
                      />
                    ) : (
                      <div className="form-display">{userData?.academicYear || 'Chưa cập nhật'}</div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Chuyên môn</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="subject"
                        value={editData.subject || ''}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="VD: Toán học, Văn học"
                      />
                    ) : (
                      <div className="form-display">{userData?.subject || 'Chưa cập nhật'}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Trình độ</label>
                    {isEditing ? (
                      <select
                        name="degree"
                        value={editData.degree || ''}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Chọn trình độ</option>
                        <option value="Cử nhân">Cử nhân</option>
                        <option value="Thạc sĩ">Thạc sĩ</option>
                        <option value="Tiến sĩ">Tiến sĩ</option>
                      </select>
                    ) : (
                      <div className="form-display">{userData?.degree || 'Chưa cập nhật'}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Kinh nghiệm</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="experience"
                        value={editData.experience || ''}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="VD: 5 năm"
                      />
                    ) : (
                      <div className="form-display">{userData?.experience || 'Chưa cập nhật'}</div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Settings */}
        {activeSection === 'settings' && (
          <div className="profile-section active">
            <h3>⚙️ Cài đặt tài khoản</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>🔔 Thông báo</h4>
                  <p>Nhận thông báo về bài tập mới và thông tin lớp học</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>📧 Email thông báo</h4>
                  <p>Nhận email thông báo về deadline bài tập</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>🌙 Chế độ tối</h4>
                  <p>Sử dụng giao diện tối để bảo vệ mắt</p>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>🔒 Bảo mật hai lớp</h4>
                  <p>Thêm lớp bảo mật cho tài khoản của bạn</p>
                </div>
                <button className="btn-setup">Thiết lập</button>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>🗑️ Xóa tài khoản</h4>
                  <p>Xóa vĩnh viễn tài khoản và tất cả dữ liệu</p>
                </div>
                <button className="btn-danger">Xóa tài khoản</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileComponent;

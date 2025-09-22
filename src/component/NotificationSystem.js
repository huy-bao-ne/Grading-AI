import React, { useState, useEffect } from 'react';
import '../style/notification.css';

const NotificationSystem = ({ userRole, classes, currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Tạo thông báo deadline sắp tới
  const checkDeadlines = () => {
    const now = new Date();
    const upcomingNotifications = [];

    if (userRole === 'student') {
      // Kiểm tra deadline cho học sinh
      classes.forEach(cls => {
        if (cls.assignments) {
          cls.assignments.forEach(assignment => {
            if (assignment.deadline) {
              const deadlineDate = new Date(assignment.deadline);
              const timeDiff = deadlineDate.getTime() - now.getTime();
              const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

              if (daysDiff <= 3 && daysDiff > 0) {
                upcomingNotifications.push({
                  id: `deadline-${assignment.id}`,
                  type: 'deadline',
                  title: 'Deadline sắp tới!',
                  message: `Bài tập "${assignment.title}" sẽ hết hạn trong ${daysDiff} ngày`,
                  time: new Date().toLocaleString(),
                  className: cls.name,
                  priority: daysDiff === 1 ? 'high' : 'medium',
                  read: false
                });
              }
            }
          });
        }
      });
    }

    return upcomingNotifications;
  };

  // Tạo thông báo bài tập mới
  const createNewAssignmentNotification = (assignment, className) => {
    const newNotification = {
      id: `new-assignment-${assignment.id}`,
      type: 'new_assignment',
      title: 'Bài tập mới được giao!',
      message: `Bài tập "${assignment.title}" đã được giao trong lớp ${className}`,
      time: new Date().toLocaleString(),
      className: className,
      priority: 'medium',
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  // Tạo thông báo khi học sinh nộp bài
  const createSubmissionNotification = (studentName, assignmentTitle, className) => {
    const newNotification = {
      id: `submission-${Date.now()}`,
      type: 'submission',
      title: 'Học sinh đã nộp bài!',
      message: `${studentName} đã nộp bài "${assignmentTitle}" trong lớp ${className}`,
      time: new Date().toLocaleString(),
      className: className,
      priority: 'low',
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  // Đánh dấu đã đọc
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Đánh dấu tất cả đã đọc
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  // Xóa thông báo
  const deleteNotification = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    if (!notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // Kiểm tra deadline định kỳ
  useEffect(() => {
    const deadlineNotifications = checkDeadlines();
    if (deadlineNotifications.length > 0) {
      setNotifications(prev => {
        const existingIds = prev.map(n => n.id);
        const newNotifications = deadlineNotifications.filter(n => !existingIds.includes(n.id));
        if (newNotifications.length > 0) {
          setUnreadCount(prevCount => prevCount + newNotifications.length);
        }
        return [...newNotifications, ...prev];
      });
    }

    // Kiểm tra mỗi giờ
    const interval = setInterval(checkDeadlines, 3600000);
    return () => clearInterval(interval);
  }, [classes]);

  // Hiển thị icon thông báo với số lượng chưa đọc
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return 'ℹ️';
      default: return '📢';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deadline': return '⏰';
      case 'new_assignment': return '📝';
      case 'submission': return '📤';
      default: return '📢';
    }
  };

  return (
    <div className="notification-system">
      {/* Bell Icon với số thông báo */}
      <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </div>

      {/* Dropdown thông báo */}
      {showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Thông báo ({unreadCount} chưa đọc)</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="mark-all-read">
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <span>📭</span>
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              notifications.slice(0, 10).map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''} priority-${notification.priority}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="notification-content">
                    <div className="notification-title">
                      {getPriorityIcon(notification.priority)} {notification.title}
                    </div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-meta">
                      <span className="notification-time">{notification.time}</span>
                      {notification.className && (
                        <span className="notification-class">📚 {notification.className}</span>
                      )}
                    </div>
                  </div>

                  <div className="notification-actions">
                    {!notification.read && (
                      <button 
                        onClick={(e) => {e.stopPropagation(); markAsRead(notification.id);}}
                        className="mark-read-btn"
                        title="Đánh dấu đã đọc"
                      >
                        ✓
                      </button>
                    )}
                    <button 
                      onClick={(e) => {e.stopPropagation(); deleteNotification(notification.id);}}
                      className="delete-btn"
                      title="Xóa thông báo"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 10 && (
            <div className="notification-footer">
              <button className="view-all-btn">
                Xem tất cả {notifications.length} thông báo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Export các hàm để các component khác có thể sử dụng
export const useNotifications = () => {
  const [notificationSystem, setNotificationSystem] = useState(null);

  const addNewAssignmentNotification = (assignment, className) => {
    if (notificationSystem) {
      notificationSystem.createNewAssignmentNotification(assignment, className);
    }
  };

  const addSubmissionNotification = (studentName, assignmentTitle, className) => {
    if (notificationSystem) {
      notificationSystem.createSubmissionNotification(studentName, assignmentTitle, className);
    }
  };

  return {
    setNotificationSystem,
    addNewAssignmentNotification,
    addSubmissionNotification
  };
};

export default NotificationSystem;

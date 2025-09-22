import React, { useState, useEffect } from 'react';
import '../style/calendar.css';

function StudentCalendar({ joinedClasses = [] }) {
  const [upcomingTests, setUpcomingTests] = useState([]);

  useEffect(() => {
    // Tổng hợp tất cả bài kiểm tra từ các lớp đã tham gia
    const tests = [];
    joinedClasses.forEach(cls => {
      cls.tests.forEach(test => {
        if (test.deadline) {
          tests.push({
            ...test,
            className: cls.name,
            classCode: cls.code
          });
        }
      });
    });

    // Sắp xếp theo deadline
    tests.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    setUpcomingTests(tests);
  }, [joinedClasses]);

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const target = new Date(deadline);
    const diff = target - now;

    if (diff <= 0) return 'Đã quá hạn';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} ngày ${hours} giờ`;
    if (hours > 0) return `${hours} giờ ${minutes} phút`;
    return `${minutes} phút`;
  };

  const getPriorityClass = (deadline) => {
    const now = new Date();
    const target = new Date(deadline);
    const diff = target - now;
    const hours = diff / (1000 * 60 * 60);

    if (hours <= 0) return 'overdue';
    if (hours <= 24) return 'urgent';
    if (hours <= 72) return 'soon';
    return 'normal';
  };

  return (
    <div className="student-calendar">
      <h2>📅 Lịch nộp bài</h2>

      {upcomingTests.length === 0 ? (
        <div className="no-tests">
          <p>🎉 Bạn không có bài kiểm tra nào sắp tới!</p>
        </div>
      ) : (
        <div className="tests-timeline">
          {upcomingTests.map(test => (
            <div key={`${test.id}-${test.classCode}`} className={`test-item ${getPriorityClass(test.deadline)}`}>
              <div className="test-info">
                <div className="test-header">
                  <h4>{test.name}</h4>
                  <span className="class-badge">{test.className}</span>
                </div>
                <div className="test-details">
                  <div className="deadline-info">
                    <strong>⏰ Deadline:</strong> {new Date(test.deadline).toLocaleString('vi-VN')}
                  </div>
                  <div className="time-remaining">
                    <strong>Còn lại:</strong> 
                    <span className={isOverdue(test.deadline) ? 'overdue-text' : 'time-text'}>
                      {getTimeRemaining(test.deadline)}
                    </span>
                  </div>
                  {test.timeLimit && (
                    <div className="time-limit">
                      <strong>⏱️ Thời gian:</strong> {test.timeLimit} phút
                    </div>
                  )}
                  <div className="test-stats">
                    <span>📝 {test.questions?.length || 0} câu hỏi</span>
                    {test.allowRetake && <span>🔄 Có thể làm lại</span>}
                  </div>
                </div>
              </div>
              <div className="test-actions">
                {!isOverdue(test.deadline) ? (
                  <button className="do-test-btn">Làm bài ngay</button>
                ) : (
                  <button className="overdue-btn" disabled>Đã quá hạn</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Thống kê nhanh */}
      <div className="quick-stats">
        <div className="stat-item urgent">
          <span className="number">{upcomingTests.filter(t => getPriorityClass(t.deadline) === 'urgent').length}</span>
          <span className="label">Khẩn cấp (24h)</span>
        </div>
        <div className="stat-item soon">
          <span className="number">{upcomingTests.filter(t => getPriorityClass(t.deadline) === 'soon').length}</span>
          <span className="label">Sắp tới (3 ngày)</span>
        </div>
        <div className="stat-item overdue">
          <span className="number">{upcomingTests.filter(t => getPriorityClass(t.deadline) === 'overdue').length}</span>
          <span className="label">Quá hạn</span>
        </div>
      </div>
    </div>
  );
}

export default StudentCalendar;

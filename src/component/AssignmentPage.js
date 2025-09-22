import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/assignment-page.css';

const AssignmentPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Load assignment data based on assignmentId
    loadAssignmentData();
    
    // Start timer if assignment has time limit
    const timer = setInterval(() => {
      if (timeRemaining > 0) {
        setTimeRemaining(prev => prev - 1);
      } else if (timeRemaining === 0) {
        handleAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [assignmentId, timeRemaining]);

  const loadAssignmentData = () => {
    // Mock assignment data - in real app, this would come from API
    const mockAssignment = {
      id: assignmentId,
      title: "Bài tập số 1: Toán học cơ bản",
      description: "Giải các bài tập về phép tính cơ bản và ứng dụng trong thực tế. Hãy trình bày chi tiết lời giải và giải thích các bước thực hiện.",
      dueDate: "2024-01-20",
      maxScore: 10,
      timeLimit: 3600, // 60 minutes in seconds
      requirements: [
        "Trình bày rõ ràng các bước giải",
        "Sử dụng đúng ký hiệu toán học",
        "Đưa ra kết luận cho mỗi bài",
        "File đính kèm phải có định dạng PDF hoặc DOCX"
      ],
      questions: [
        {
          id: 1,
          question: "Câu 1: Tính giá trị của biểu thức 2x + 3y khi x = 5, y = 2",
          points: 2
        },
        {
          id: 2,
          question: "Câu 2: Giải phương trình bậc nhất: 3x - 7 = 14",
          points: 3
        },
        {
          id: 3,
          question: "Câu 3: Một hình chữ nhật có chiều dài 12cm, chiều rộng 8cm. Tính diện tích và chu vi.",
          points: 3
        },
        {
          id: 4,
          question: "Câu 4: Trong một lớp có 30 học sinh, trong đó có 18 học sinh nam. Tính tỷ lệ phần trăm học sinh nữ.",
          points: 2
        }
      ]
    };
    
    setAssignment(mockAssignment);
    setTimeRemaining(mockAssignment.timeLimit);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (allowedTypes.includes(file.type)) {
        setSubmissionFile(file);
      } else {
        alert('Chỉ chấp nhận file PDF, DOC, DOCX hoặc TXT');
      }
    }
  };

  const handleSubmit = async () => {
    if (!submissionText.trim()) {
      alert('Vui lòng nhập nội dung bài làm');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      alert('Nộp bài thành công!');
      // Redirect back to student dashboard after 2 seconds
      setTimeout(() => {
        navigate('/student-dashboard');
      }, 2000);
    }, 1500);
  };

  const handleAutoSubmit = () => {
    if (!isSubmitted) {
      alert('Hết thời gian! Bài làm sẽ được tự động nộp.');
      handleSubmit();
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!assignment) {
    return (
      <div className="assignment-page loading">
        <div className="loading-spinner">Đang tải bài tập...</div>
      </div>
    );
  }

  return (
    <div className="assignment-page">
      {/* Header */}
      <div className="assignment-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate('/student-dashboard')}>
            ← Quay lại
          </button>
          <div className="assignment-info">
            <h1>{assignment.title}</h1>
            <div className="assignment-meta">
              <span className="due-date">📅 Hạn nộp: {assignment.dueDate}</span>
              <span className="max-score">📈 Điểm tối đa: {assignment.maxScore}</span>
            </div>
          </div>
        </div>
        
        <div className="header-right">
          {timeRemaining !== null && (
            <div className={`timer ${timeRemaining < 300 ? 'warning' : ''}`}>
              ⏰ Thời gian còn lại: {formatTime(timeRemaining)}
            </div>
          )}
        </div>
      </div>

      {/* Assignment Content */}
      <div className="assignment-content">
        <div className="assignment-details">
          <div className="description-section">
            <h3>📝 Mô tả bài tập</h3>
            <p>{assignment.description}</p>
          </div>

          <div className="requirements-section">
            <h3>📋 Yêu cầu</h3>
            <ul>
              {assignment.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="questions-section">
            <h3>❓ Câu hỏi</h3>
            {assignment.questions.map((q) => (
              <div key={q.id} className="question-item">
                <div className="question-header">
                  <span className="question-text">{q.question}</span>
                  <span className="question-points">({q.points} điểm)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Form */}
        <div className="submission-section">
          <h3>✍️ Bài làm của bạn</h3>
          
          <div className="form-group">
            <label>Nội dung bài làm:</label>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Nhập câu trả lời cho từng câu hỏi... 

Câu 1: 
[Nhập câu trả lời của bạn]

Câu 2: 
[Nhập câu trả lời của bạn]

Câu 3: 
[Nhập câu trả lời của bạn]

Câu 4: 
[Nhập câu trả lời của bạn]"
              rows="20"
              disabled={isSubmitted}
            />
          </div>

          <div className="form-group">
            <label>Đính kèm file (tùy chọn):</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
              disabled={isSubmitted}
            />
            {submissionFile && (
              <div className="file-info">
                📎 {submissionFile.name} ({(submissionFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>

          <div className="submission-actions">
            <button 
              className="cancel-button"
              onClick={() => navigate('/student-dashboard')}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button 
              className="submit-button"
              onClick={handleSubmit}
              disabled={isSubmitting || isSubmitted || !submissionText.trim()}
            >
              {isSubmitting ? '⏳ Đang nộp...' : isSubmitted ? '✅ Đã nộp' : '📤 Nộp bài'}
            </button>
          </div>

          {isSubmitted && (
            <div className="success-message">
              ✅ Bài tập đã được nộp thành công! Đang chuyển về trang chủ...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;
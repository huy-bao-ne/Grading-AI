import React, { useState } from 'react';
import '../style/classmanager.css';

function StudentTest() {
  const [joinCode, setJoinCode] = useState('');
  const [joinedClass, setJoinedClass] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [savedDrafts, setSavedDrafts] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [testStartTime, setTestStartTime] = useState(null);

  // Danh sách lớp học mẫu (trong thực tế sẽ lấy từ server/database)
  const [availableClasses] = useState([
    {
      id: 1,
      name: 'Toán 12A1',
      code: 'MATH12A1',
      tests: [
        {
          id: 1,
          name: 'Kiểm tra chương 1',
          questions: [
            {
              id: 1,
              question: 'Tính đạo hàm của f(x) = x²',
              options: ['f\'(x) = 2x', 'f\'(x) = x', 'f\'(x) = 2x²', 'f\'(x) = x²'],
              correctAnswer: 0,
              explanation: 'Đạo hàm của x² là 2x theo quy tắc đạo hàm cơ bản.'
            },
            {
              id: 2,
              question: 'Giới hạn của 1/x khi x tiến tới 0⁺ là?',
              options: ['+∞', '-∞', '0', '1'],
              correctAnswer: 0,
              explanation: 'Khi x tiến tới 0 từ phía dương, 1/x tiến tới +∞.'
            }
          ]
        }
      ]
    }
  ]);

  // Vào lớp học bằng mã lớp
  const handleJoinClass = () => {
    const foundClass = availableClasses.find(cls => cls.code === joinCode.toUpperCase());
    if (foundClass) {
      setJoinedClass(foundClass);
      setJoinCode('');
    } else {
      alert('Mã lớp không tồn tại!');
    }
  };

  // Chọn bài kiểm tra để làm
  const handleSelectTest = (test) => {
    setSelectedTest(test);
    setTestResult(null);
    setTestStartTime(Date.now());
    
    // Khôi phục nháp đã lưu (nếu có)
    const draftKey = `${joinedClass?.code}-${test.id}`;
    const savedDraft = savedDrafts[draftKey];
    if (savedDraft) {
      setAnswers(savedDraft.answers);
    } else {
      setAnswers({});
    }
    
    // Đặt thời gian làm bài
    if (test.timeLimit) {
      setTimeRemaining(parseInt(test.timeLimit) * 60); // chuyển phút sang giây
    }
  };

  // Lưu câu trả lời
  const handleAnswerChange = (questionId, answerIndex) => {
    const newAnswers = {
      ...answers,
      [questionId]: answerIndex
    };
    setAnswers(newAnswers);
    
    // Tự động lưu nháp
    handleSaveDraft(newAnswers);
  };

  // Lưu nháp
  const handleSaveDraft = (currentAnswers = answers) => {
    if (joinedClass && selectedTest) {
      const draftKey = `${joinedClass.code}-${selectedTest.id}`;
      setSavedDrafts({
        ...savedDrafts,
        [draftKey]: {
          answers: currentAnswers,
          savedAt: new Date().toISOString()
        }
      });
    }
  };

  // Đếm ngược thời gian
  React.useEffect(() => {
    if (timeRemaining > 0 && selectedTest && !testResult) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && selectedTest && !testResult) {
      // Tự động nộp bài khi hết thời gian
      handleSubmitTest();
    }
  }, [timeRemaining, selectedTest, testResult]);

  // Format thời gian còn lại
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Nộp bài và chấm điểm ngay
  const handleSubmitTest = () => {
    let correct = 0;
    const results = selectedTest.questions.map(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correct++;
      
      return {
        questionId: question.id,
        question: question.question,
        userAnswer: userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: isCorrect,
        explanation: question.explanation
      };
    });

    const score = (correct / selectedTest.questions.length) * 10;
    setTestResult({
      score: score,
      correct: correct,
      total: selectedTest.questions.length,
      results: results
    });
  };

  return (
    <div className="student-test">
      <h2>Học sinh - Làm bài kiểm tra</h2>

      {!joinedClass ? (
        <div>
          <h3>Vào lớp học</h3>
          <input
            type="text"
            placeholder="Nhập mã lớp (ví dụ: MATH12A1)"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value)}
          />
          <button onClick={handleJoinClass}>Vào lớp</button>
        </div>
      ) : !selectedTest ? (
        <div>
          <h3>Lớp: {joinedClass.name}</h3>
          <h4>Danh sách bài kiểm tra</h4>
          {joinedClass.tests.map(test => (
            <div key={test.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
              <h4>{test.name}</h4>
              <p>Số câu hỏi: {test.questions.length}</p>
              <button onClick={() => handleSelectTest(test)}>Làm bài</button>
            </div>
          ))}
          <button onClick={() => setJoinedClass(null)}>Thoát lớp</button>
        </div>
      ) : !testResult ? (
        <div>
          <h3>Bài kiểm tra: {selectedTest.name}</h3>
          {selectedTest.questions.map((question, idx) => (
            <div key={question.id} style={{ margin: '20px 0', padding: '15px', border: '1px solid #ddd' }}>
              <h4>Câu {idx + 1}: {question.question}</h4>
              {question.options.map((option, optionIdx) => (
                <label key={optionIdx} style={{ display: 'block', margin: '5px 0' }}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={optionIdx}
                    onChange={() => handleAnswerChange(question.id, optionIdx)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button onClick={handleSubmitTest} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Nộp bài
          </button>
          <button onClick={() => setSelectedTest(null)} style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}>
            Quay lại
          </button>
        </div>
      ) : (
        <div>
          <h3>Kết quả bài kiểm tra: {selectedTest.name}</h3>
          <h4>Điểm số: {testResult.score.toFixed(1)}/10 ({testResult.correct}/{testResult.total} câu đúng)</h4>
          
          <div>
            <h4>Chi tiết và gợi ý:</h4>
            {testResult.results.map((result, idx) => (
              <div key={result.questionId} style={{ 
                margin: '15px 0', 
                padding: '15px', 
                border: '1px solid #ddd',
                backgroundColor: result.isCorrect ? '#d4edda' : '#f8d7da'
              }}>
                <h5>Câu {idx + 1}: {result.question}</h5>
                <p><strong>Bạn chọn:</strong> {selectedTest.questions[idx].options[result.userAnswer] || 'Không trả lời'}</p>
                <p><strong>Đáp án đúng:</strong> {selectedTest.questions[idx].options[result.correctAnswer]}</p>
                <p><strong>Giải thích:</strong> {result.explanation}</p>
                {result.isCorrect ? (
                  <p style={{ color: 'green', fontWeight: 'bold' }}>✓ Chính xác!</p>
                ) : (
                  <p style={{ color: 'red', fontWeight: 'bold' }}>✗ Sai rồi</p>
                )}
              </div>
            ))}
          </div>
          
          <button onClick={() => {
            setSelectedTest(null);
            setTestResult(null);
          }}>
            Làm bài khác
          </button>
        </div>
      )}
    </div>
  );
}

export default StudentTest;

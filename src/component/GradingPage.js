import React, { useState } from "react";
import "../style/globals.css";
import "../style/gradingpage.css";

const GradingPage = () => {
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", answer: "" }]);
  };

  const handleInputChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  return (
    <div className="grading-container">
      <h2>📑 Tạo bài tập</h2>
      <p className="sub-heading">Nhập câu hỏi và câu trả lời mẫu</p>

      <div className="question-section">
        {questions.map((q, index) => (
          <div key={index} className="question-item">
            <div className="question-header">
              <span className="question-number">Câu hỏi {index + 1}</span>
              <button className="delete-button" onClick={() => deleteQuestion(index)}>🗑</button>
            </div>

            <input
              type="text"
              className="question-input"
              placeholder="Nhập nội dung câu hỏi..."
              value={q.question}
              onChange={(e) => handleInputChange(index, "question", e.target.value)}
            />

            <input
              type="text"
              className="answer-input"
              placeholder="Nhập câu trả lời mẫu..."
              value={q.answer}
              onChange={(e) => handleInputChange(index, "answer", e.target.value)}
            />
          </div>
        ))}

        <button className="add-question-button" onClick={addQuestion}>➕ Thêm câu hỏi</button>
      </div>

      <button className="submit-button">📤 Tạo</button>
    </div>
  );
};

export default GradingPage;

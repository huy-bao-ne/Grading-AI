import React from "react";
import "../style/globals.css";
import "../style/benefitsection.css";

const BenefitSection = () => {
  return (
    <section className="benefit-section">
      <h2 className="benefit-title">Why teachers choose EssayGrader</h2>
      <div className="benefit-container">
        <div className="benefit-card">
          <span className="benefit-icon">⏳</span>
          <h3>Time efficiency & streamlined grading</h3>
          <p>
            Simplify and speed up the grading process with our AI Grader, allowing you to focus on impactful teaching.
          </p>
        </div>
        <div className="benefit-card">
          <span className="benefit-icon">🏅</span>
          <h3>Consistency & fairness</h3>
          <p>
            Ensure fair essay grading by removing bias and aligning with state standards.
          </p>
        </div>
        <div className="benefit-card">
          <span className="benefit-icon">📊</span>
          <h3>Actionable insights & feedback</h3>
          <p>
            Receive detailed essay feedback and growth insights you can seamlessly share with your students.
          </p>
        </div>
      </div>
      <div className="benefit-stats">
        <div className="stat-item">
          <h3>1000+</h3>
          <p>Schools</p>
        </div>
        <div className="stat-item">
          <h3>100K+</h3>
          <p>Happy Teachers</p>
        </div>
        <div className="stat-item">
          <h3>1M+</h3>
          <p>Happy Students</p>
        </div>
      </div>
    </section>
  );
};

export default BenefitSection;

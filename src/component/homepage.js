import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/homepage_modern.css";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    if (isLoggedIn) {
      const savedRole = localStorage.getItem('userRole');
      if (savedRole) {
        if (savedRole === 'teacher') {
          navigate('/teacher-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      } else {
        navigate('/role-selector');
      }
    }
  }, [navigate]);

  return (
    <div className="homepage-new">
      {/* Navigation */}
      <nav className="nav-modern">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-icon">🎓</div>
            <span className="brand-text">GradingAI</span>
          </div>
          <div className="nav-actions">
            <button className="nav-link">Tính năng</button>
            <button className="nav-link">Giá cả</button>
            <button className="nav-link">Hỗ trợ</button>
            <button className="btn-login" onClick={() => navigate("/login")}>
              Đăng nhập
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Modern Minimal */}
      <section className="hero-modern">
        <div className="hero-grid">
          <div className="hero-content-modern">
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              <span>AI-Powered Grading Platform</span>
            </div>
            
            <h1 className="hero-title-modern">
              Chấm điểm bài luận
              <br />
              <span className="gradient-text">thông minh & chính xác</span>
            </h1>
            
            <p className="hero-desc-modern">
              Hệ thống AI tiên tiến giúp chấm điểm và phân tích bài luận lịch sử một cách 
              khách quan, nhanh chóng và đưa ra phản hồi chi tiết để cải thiện kỹ năng viết.
            </p>

            <div className="hero-actions-modern">
              <button className="btn-primary-modern" onClick={() => navigate("/login")}>
                <span>Thử ngay miễn phí</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L15 8L8 15M15 8H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <button className="btn-demo-modern">
                <div className="demo-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5V19L19 12L8 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Xem demo</span>
              </button>
            </div>

            <div className="trust-indicators">
              <div className="trust-item">
                <span className="trust-number">2,500+</span>
                <span className="trust-label">Bài luận đã chấm</span>
              </div>
              <div className="trust-divider"></div>
              <div className="trust-item">
                <span className="trust-number">98.5%</span>
                <span className="trust-label">Độ chính xác</span>
              </div>
              <div className="trust-divider"></div>
              <div className="trust-item">
                <span className="trust-number">4.9/5</span>
                <span className="trust-label">Đánh giá</span>
              </div>
            </div>
          </div>

          <div className="hero-visual-modern">
            <div className="visual-container">
              <div className="floating-card card-1">
                <div className="card-header">
                  <div className="score-circle">
                    <span className="score">8.5</span>
                  </div>
                  <div className="card-info">
                    <h4>Bài luận Cách mạng Tháng Tám</h4>
                    <p>Phân tích xuất sắc</p>
                  </div>
                </div>
                <div className="progress-bars">
                  <div className="progress-item">
                    <span>Nội dung</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  <div className="progress-item">
                    <span>Cấu trúc</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '90%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="floating-card card-2">
                <div className="ai-analysis">
                  <div className="ai-icon">🤖</div>
                  <div className="analysis-text">
                    <p>AI đang phân tích...</p>
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="floating-card card-3">
                <div className="feedback-preview">
                  <h5>💡 Gợi ý cải thiện</h5>
                  <ul>
                    <li>Bổ sung thêm dẫn chứng lịch sử</li>
                    <li>Cải thiện câu kết luận</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Clean Cards */}
      <section className="features-modern">
        <div className="container-modern">
          <div className="section-header-modern">
            <h2 className="section-title-modern">
              Tại sao chọn <span className="gradient-text">GradingAI</span>?
            </h2>
            <p className="section-subtitle-modern">
              Công nghệ AI tiên tiến kết hợp với hiểu biết sâu sắc về giáo dục lịch sử
            </p>
          </div>

          <div className="features-grid-modern">
            <div className="feature-card-modern">
              <div className="feature-icon-modern lightning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Chấm điểm tức thì</h3>
              <p>Nhận kết quả chấm điểm và phân tích chi tiết chỉ trong vài giây, tiết kiệm thời gian đáng kể.</p>
              <div className="feature-highlight">
                <span>⚡ Chỉ 3 giây</span>
              </div>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon-modern brain">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9.5 2A2.5 2.5 0 0 0 7 4.5V7A2.5 2.5 0 0 0 9.5 9.5H12V7A2.5 2.5 0 0 1 14.5 4.5A2.5 2.5 0 0 1 17 7V9.5A2.5 2.5 0 0 1 14.5 12H12V14.5A2.5 2.5 0 0 0 14.5 17A2.5 2.5 0 0 0 17 14.5V12A2.5 2.5 0 0 0 14.5 9.5H12V7A2.5 2.5 0 0 0 9.5 4.5Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Phân tích thông minh</h3>
              <p>AI hiểu sâu về ngữ cảnh lịch sử, đánh giá logic luận điểm và độ chính xác thông tin.</p>
              <div className="feature-highlight">
                <span>🧠 AI Learning</span>
              </div>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon-modern chart">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 9L12 6L16 10L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Báo cáo chi tiết</h3>
              <p>Nhận phản hồi cụ thể về từng khía cạnh: nội dung, cấu trúc, ngữ pháp và cách trình bày.</p>
              <div className="feature-highlight">
                <span>📊 Chi tiết 100%</span>
              </div>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon-modern growth">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Theo dõi tiến độ</h3>
              <p>Xem sự phát triển kỹ năng viết qua thời gian với biểu đồ và thống kê trực quan.</p>
              <div className="feature-highlight">
                <span>📈 Tiến bộ rõ ràng</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Step by Step */}
      <section className="process-modern">
        <div className="container-modern">
          <div className="section-header-modern">
            <h2 className="section-title-modern">
              Cách thức hoạt động
            </h2>
            <p className="section-subtitle-modern">
              3 bước đơn giản để có ngay kết quả chấm điểm chuyên nghiệp
            </p>
          </div>

          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Upload bài luận</h3>
                <p>Tải lên file Word, PDF hoặc paste trực tiếp văn bản bài luận lịch sử của bạn.</p>
                <div className="step-visual">
                  <div className="upload-demo">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 18V12" stroke="currentColor" strokeWidth="2"/>
                      <path d="M9 15L12 12L15 15" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="process-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="process-step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>AI phân tích</h3>
                <p>Hệ thống AI phân tích toàn diện: nội dung, cấu trúc, logic và độ chính xác lịch sử.</p>
                <div className="step-visual">
                  <div className="analysis-demo">
                    <div className="scanning-line"></div>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="process-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="process-step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Nhận kết quả</h3>
                <p>Xem điểm số, phản hồi chi tiết và lời khuyên cải thiện được cá nhân hóa.</p>
                <div className="step-visual">
                  <div className="result-demo">
                    <div className="score-display">8.5</div>
                    <div className="feedback-items">
                      <div className="feedback-item positive"></div>
                      <div className="feedback-item negative"></div>
                      <div className="feedback-item positive"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Simple & Powerful */}
      <section className="cta-modern">
        <div className="container-modern">
          <div className="cta-content-modern">
            <h2 className="cta-title-modern">
              Sẵn sàng cải thiện kỹ năng viết luận?
            </h2>
            <p className="cta-subtitle-modern">
              Tham gia cùng hàng ngàn sinh viên đang sử dụng GradingAI để đạt điểm cao hơn.
            </p>
            
            <div className="cta-actions-modern">
              <button className="btn-cta-primary" onClick={() => navigate("/login")}>
                Bắt đầu miễn phí ngay
              </button>
              <div className="cta-note">
                ✅ Miễn phí hoàn toàn • ✅ Không cần thẻ tín dụng
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="footer-modern">
        <div className="container-modern">
          <div className="footer-content-modern">
            <div className="footer-brand-modern">
              <div className="brand-icon">🎓</div>
              <span>GradingAI</span>
            </div>
            <div className="footer-links-modern">
              <a href="#">Về chúng tôi</a>
              <a href="#">Liên hệ</a>
              <a href="#">Hỗ trợ</a>
              <a href="#">Điều khoản</a>
            </div>
          </div>
          <div className="footer-bottom-modern">
            <p>&copy; 2024 GradingAI. Made with ❤️ for Vietnamese students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
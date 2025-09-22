import React, { useState, useEffect, useRef } from 'react';
import '../style/chat.css';

const ChatSystem = ({ userRole, currentUser, classes }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});
  const messagesEndRef = useRef(null);

  // Scroll xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  // Tìm kiếm người dùng
  const searchUsers = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = [];
    
    if (userRole === 'teacher') {
      // Giáo viên tìm kiếm học sinh và lớp học
      classes.forEach(cls => {
        // Tìm kiếm lớp học
        if (cls.name.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            id: `class-${cls.code}`,
            name: `Lớp ${cls.name}`,
            type: 'group',
            members: cls.students,
            avatar: '👥',
            classCode: cls.code,
            subtitle: `${cls.students?.length || 0} học sinh`
          });
        }

        // Tìm kiếm học sinh
        cls.students?.forEach(student => {
          if (student.name.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              id: `private-${student.id}`,
              name: student.name,
              type: 'private',
              avatar: '👤',
              studentId: student.id,
              className: cls.name,
              subtitle: `Học sinh - ${cls.name}`
            });
          }
        });
      });
    } else if (userRole === 'student') {
      // Học sinh tìm kiếm giáo viên và lớp học
      classes.forEach(cls => {
        // Tìm kiếm lớp học
        if (cls.name.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            id: `class-${cls.code}`,
            name: `Lớp ${cls.name}`,
            type: 'group',
            members: cls.students,
            avatar: '👥',
            classCode: cls.code,
            subtitle: `${cls.students?.length || 0} thành viên`
          });
        }

        // Tìm kiếm giáo viên (giả sử có tên giáo viên trong classes)
        if (cls.teacherName && cls.teacherName.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            id: `teacher-${cls.code}`,
            name: cls.teacherName || `GV ${cls.name}`,
            type: 'private',
            avatar: '👩‍🏫',
            classCode: cls.code,
            subtitle: `Giáo viên - ${cls.name}`
          });
        }

        // Tìm kiếm học sinh khác trong lớp
        cls.students?.forEach(student => {
          if (student.id !== currentUser.id && student.name.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              id: `student-${student.id}`,
              name: student.name,
              type: 'private',
              avatar: '👤',
              studentId: student.id,
              className: cls.name,
              subtitle: `Học sinh - ${cls.name}`
            });
          }
        });
      });
    }

    // Loại bỏ kết quả trùng lặp
    const uniqueResults = results.filter((result, index, self) => 
      index === self.findIndex(r => r.id === result.id)
    );

    setSearchResults(uniqueResults);
  };

  // Xử lý tìm kiếm
  useEffect(() => {
    searchUsers(searchQuery);
  }, [searchQuery, userRole, classes]);

  // Gửi tin nhắn
  const sendMessage = () => {
    if (newMessage.trim() && activeChat) {
      const message = {
        id: Date.now(),
        sender: currentUser.name || 'Unknown',
        senderId: currentUser.id || 'unknown',
        content: newMessage.trim(),
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), message]
      }));

      setNewMessage('');

      // Simulate response (trong thực tế sẽ là WebSocket hoặc API)
      if (activeChat.type === 'private' && userRole === 'student') {
        setTimeout(() => {
          const response = {
            id: Date.now() + 1,
            sender: 'Giáo viên',
            senderId: 'teacher',
            content: 'Cảm ơn bạn đã nhắn tin. Tôi sẽ trả lời sớm nhất có thể!',
            timestamp: new Date(),
            type: 'text'
          };

          setMessages(prev => ({
            ...prev,
            [activeChat.id]: [...(prev[activeChat.id] || []), response]
          }));
        }, 2000);
      }
    }
  };

  // Xử lý Enter để gửi
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Đánh dấu tin nhắn đã đọc
  const markAsRead = (chatId) => {
    setUnreadMessages(prev => ({
      ...prev,
      [chatId]: 0
    }));
  };

  // Chọn chat
  const selectChat = (chat) => {
    setActiveChat(chat);
    markAsRead(chat.id);
    setShowSearch(false);
    setShowChatWindow(true);
    
    // Thêm vào recent chats
    setRecentChats(prev => {
      const filtered = prev.filter(c => c.id !== chat.id);
      return [chat, ...filtered].slice(0, 10); // Giữ tối đa 10 cuộc trò chuyện gần đây
    });
  };

  // Tính tổng số tin nhắn chưa đọc
  const getTotalUnread = () => {
    return Object.values(unreadMessages).reduce((total, count) => total + count, 0);
  };

  // Format thời gian
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-system">
      {/* Chat Icon */}
      <div className="chat-toggle" onClick={() => setShowSearch(!showSearch)}>
        <span className="chat-icon">💬</span>
        {getTotalUnread() > 0 && (
          <span className="chat-badge">{getTotalUnread()}</span>
        )}
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="chat-search-modal">
          <div className="chat-search-header">
            <h3>💬 Tìm kiếm cuộc trò chuyện</h3>
            <button onClick={() => setShowSearch(false)} className="close-btn">✕</button>
          </div>
          
          {/* Search Input */}
          <div className="search-input-container">
            <input
              type="text"
              placeholder={userRole === 'teacher' ? "Tìm học sinh, lớp học..." : "Tìm giáo viên, học sinh, lớp học..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              autoFocus
            />
            <span className="search-icon">🔍</span>
          </div>

          {/* Search Results */}
          <div className="search-results">
            {!searchQuery.trim() ? (
              <div className="search-section">
                <h4>📨 Cuộc trò chuyện gần đây</h4>
                {recentChats.length === 0 ? (
                  <div className="no-results">
                    <span>📭</span>
                    <p>Chưa có cuộc trò chuyện nào</p>
                  </div>
                ) : (
                  recentChats.map(chat => (
                    <div 
                      key={chat.id} 
                      className="search-result-item"
                      onClick={() => selectChat(chat)}
                    >
                      <div className="result-avatar">{chat.avatar}</div>
                      <div className="result-info">
                        <div className="result-name">{chat.name}</div>
                        <div className="result-subtitle">{chat.subtitle}</div>
                      </div>
                      {unreadMessages[chat.id] > 0 && (
                        <div className="unread-badge">{unreadMessages[chat.id]}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="search-section">
                <h4>🔍 Kết quả tìm kiếm</h4>
                {searchResults.length === 0 ? (
                  <div className="no-results">
                    <span>�</span>
                    <p>Không tìm thấy kết quả cho "{searchQuery}"</p>
                  </div>
                ) : (
                  searchResults.map(result => (
                    <div 
                      key={result.id} 
                      className="search-result-item"
                      onClick={() => selectChat(result)}
                    >
                      <div className="result-avatar">{result.avatar}</div>
                      <div className="result-info">
                        <div className="result-name">{result.name}</div>
                        <div className="result-subtitle">{result.subtitle}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Window */}
      {activeChat && showChatWindow && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-info">
              <span className="chat-avatar">{activeChat.avatar}</span>
              <div>
                <div className="chat-name">{activeChat.name}</div>
                <div className="chat-status">
                  {activeChat.type === 'group' ? `${activeChat.members?.length || 0} thành viên` : 'Đang hoạt động'}
                </div>
              </div>
            </div>
            <div className="chat-actions">
              <button className="minimize-btn" onClick={() => setShowChatWindow(false)}>−</button>
              <button className="close-btn" onClick={() => {setActiveChat(null); setShowChatWindow(false)}}>✕</button>
            </div>
          </div>

          <div className="chat-messages">
            {messages[activeChat.id]?.length === 0 || !messages[activeChat.id] ? (
              <div className="no-messages">
                <span>💬</span>
                <p>Bắt đầu cuộc trò chuyện của bạn</p>
              </div>
            ) : (
              messages[activeChat.id].map(message => (
                <div 
                  key={message.id} 
                  className={`message ${message.senderId === (currentUser.id || 'unknown') ? 'own' : 'other'}`}
                >
                  <div className="message-content">
                    {message.senderId !== (currentUser.id || 'unknown') && (
                      <div className="message-sender">{message.sender}</div>
                    )}
                    <div className="message-text">{message.content}</div>
                    <div className="message-time">{formatTime(message.timestamp)}</div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                activeChat.type === 'group' 
                  ? `Nhắn tin đến lớp ${activeChat.name}...`
                  : `Nhắn tin đến ${activeChat.name}...`
              }
              rows="1"
            />
            <button 
              onClick={sendMessage} 
              disabled={!newMessage.trim()}
              className="send-btn"
            >
              📤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSystem;

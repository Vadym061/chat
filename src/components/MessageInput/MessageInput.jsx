import React, { useState } from 'react';
import { IoSendSharp } from 'react-icons/io5';
import './MessageInputStyle.scss';  // Import the styles

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="message-input-container">
      <input
        type="text"
        className="message-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter your message"
      />
      <button className="send-button" onClick={handleSendMessage}>
        <IoSendSharp />
      </button>
    </div>
  );
}

export default MessageInput;
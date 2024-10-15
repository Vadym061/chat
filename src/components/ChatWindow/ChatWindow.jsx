import React, { useState, useEffect } from 'react';
import MessageInput from '../MessageInput/MessageInput';
import Toast from '../Toast/Toast';
import './ChatWindowStyle.scss';
import { PiFinnTheHumanFill } from "react-icons/pi";

function ChatWindow({ selectedChat, selectedChatId, setChats, chats, onBack }) {
  const [messages, setMessages] = useState(selectedChat ? selectedChat.messages : []);
  const [ws, setWs] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isRandomMessagesEnabled, setIsRandomMessagesEnabled] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    const wsClient = new WebSocket('wss://server-chat-app-indol.vercel.app/');
    setWs(wsClient);

    wsClient.onmessage = (event) => {
      const { chatId, message } = JSON.parse(event.data);
      if (chatId === selectedChatId) {
        setMessages((prevMessages) => [...prevMessages, message]);
        setToastMessage('Нове повідомлення!');
      }
    };

    return () => {
      wsClient.close();
    };
  }, [selectedChatId]);

  const handleSendMessage = async (message) => {
    const newMessage = {
        _id: new Date().getTime(),
        text: message,
        isMe: true,
        time: new Date().toLocaleTimeString() 
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
        const response = await fetch(`https://server-chat-app-indol.vercel.app/api/chats/${selectedChatId}/messages`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: message, isMe: true }),
        });

        if (response.ok) {
            const updatedChat = await response.json();
            setChats(chats.map(chat =>
                chat._id === selectedChatId ? updatedChat : chat
            ));
            setMessages(updatedChat.messages);
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

  const handleEditMessage = (index) => {
    setEditIndex(index);
    setEditText(messages[index].text);
  };

  const handleEditChange = (event) => {
    setEditText(event.target.value);
  };

  const handleUpdateMessage = async () => {
    if (editIndex === null) return;

    const message = messages[editIndex];
    try {
      const response = await fetch(`https://server-chat-app-indol.vercel.app/api/chats/${selectedChatId}/messages/${message._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editText }),
      });

      if (response.ok) {
        const updatedChat = await response.json();
        setChats(chats.map(chat =>
          chat._id === selectedChatId ? updatedChat : chat
        ));
        setMessages(updatedChat.messages);
        setEditIndex(null);
        setEditText('');
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const handleToggleRandomMessages = async () => {
    try {
      const url = isRandomMessagesEnabled 
        ? 'https://server-chat-app-indol.vercel.app/api/stop-random-messages' 
        : 'https://server-chat-app-indol.vercel.app/api/start-random-messages';
        
      const response = await fetch(url, { method: 'POST' });
      
      if (response.ok) {
        const result = await response.json();
        setToastMessage(result.message);
        setIsRandomMessagesEnabled(!isRandomMessagesEnabled);
      }
    } catch (error) {
      console.error('Error toggling random messages:', error);
    }
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage('');
      }, 4000);
  
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const closeToast = () => {
    setToastMessage('');
  };

  return (
    <div className='chat-window'>
      {selectedChat && (
        <>
          <div className='chat-header'>
          
            <div className='chat-header-avatar'>
              {selectedChat.avatar ? (
                <img src={selectedChat.avatar} alt={`${selectedChat.firstName} ${selectedChat.lastName}`} />
              ) : (
                <div className='default-avatar'><PiFinnTheHumanFill /></div>
              )}
            </div>
            <h2 className='chat-header-name'>{selectedChat.firstName} {selectedChat.lastName}</h2>
            <button className='back-button' onClick={onBack}>Back</button>
          </div>
          <div className='chat-messages'>
            {messages.map((message, index) => (
              <div key={message._id} className={`message ${message.isMe ? 'me' : 'them'}`}>
                {!message.isMe && (
                  <div className='message-avatar'>
                    {selectedChat.avatar ? (
                      <img src={selectedChat.avatar} alt={`${selectedChat.firstName} ${selectedChat.lastName}`} />
                    ) : (
                      <PiFinnTheHumanFill />
                    )}
                  </div>
                )}
                <div className='message-bubble'>
                  <div className='message-text'>
                    {editIndex === index ? (
                      <input
                        type='text'
                        value={editText}
                        onChange={handleEditChange}
                        onBlur={handleUpdateMessage}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateMessage()}
                        autoFocus
                      />
                    ) : (
                      message.text
                    )}
                  </div>
                  {message.isMe && (
                    <button onClick={() => handleEditMessage(index)} className='edit-button'>Edit</button>
                  )}
                  <div className='message-time'>{message.time}</div>
                </div>
              </div>
            ))}
          </div>
          <MessageInput onSendMessage={handleSendMessage} />
          <button onClick={handleToggleRandomMessages}>
            {isRandomMessagesEnabled ? 'Вимкнути автоматичні повідомлення' : 'Увімкнути автоматичні повідомлення'}
          </button>
        </>
      )}
     
      {toastMessage && <Toast message={toastMessage} onClose={closeToast} />}
    </div>
  );
}

export default ChatWindow;
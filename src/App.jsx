import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './normalize.css';
import './App.scss';
import ChatSidebar from './components/ChatSidebar/ChatSidebar';
import ChatWindow from './components/ChatWindow/ChatWindow';
import ConfirmationModal from './components/ConfirmationModal/ConfirmationModal';

const App = () => {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [isChatWindowVisible, setIsChatWindowVisible] = useState(false);

  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await fetch('https://server-chat-app-indol.vercel.app/api/chats');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    }
    fetchChats();
  }, []);

  const selectedChat = chats.find(chat => chat._id === selectedChatId);

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    setIsChatWindowVisible(true); 
  };

  const handleCreateChat = async (newChat) => {
    try {
      const response = await fetch('https://server-chat-app-indol.vercel.app/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChat),
      });

      if (response.ok) {
        const createdChat = await response.json();
        setChats(prevChats => [...prevChats, createdChat]);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleUpdateChat = async (chatId, updatedInfo) => {
    try {
      const response = await fetch(`https://server-chat-app-indol.vercel.app/api/chats/${chatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInfo),
      });

      if (response.ok) {
        const updatedChat = await response.json();
        setChats(prevChats =>
          prevChats.map(chat => chat._id === chatId ? updatedChat : chat)
        );
      }
    } catch (error) {
      console.error('Error updating chat:', error);
    }
  };

  const handleDeleteChat = (chatId) => {
    setChatToDelete(chatId);
    setIsModalOpen(true);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;

    try {
      const response = await fetch(`https://server-chat-app-indol.vercel.app/api/chats/${chatToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setChats(prevChats => prevChats.filter(chat => chat._id !== chatToDelete));
        setChatToDelete(null);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleBackToChats = () => {
    setSelectedChatId(null);
    setIsChatWindowVisible(false); 
  };

  return (
    <BrowserRouter>
      <div className='app'>
        <div className='app__section'>
        {isChatWindowVisible ? null : (
          <ChatSidebar 
            chats={chats} 
            onSelectChat={handleSelectChat} 
            onCreateChat={handleCreateChat} 
            onUpdateChat={handleUpdateChat} 
            onDeleteChat={handleDeleteChat} 
          />
        )}

        {/* Chat Window */}
        {isChatWindowVisible && (
          <ChatWindow 
            selectedChat={selectedChat} 
            selectedChatId={selectedChatId} 
            setChats={setChats} 
            chats={chats} 
            onBack={handleBackToChats}
          />
        )}
        </div>
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDeleteChat}
          message="Are you sure you want to delete this chat?"
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
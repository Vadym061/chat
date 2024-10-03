import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NewChatDialog from '../NewChatDialog/NewChatDialog';
import EditChatDialog from '../EditChatDialog/EditChatDialog';
import { IoMdAdd } from "react-icons/io";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { PiFinnTheHumanFill } from "react-icons/pi";
import './CahtSidebarStyle.scss';


function ChatSidebar({ chats, onSelectChat, onCreateChat, onUpdateChat, onDeleteChat }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [chatToEdit, setChatToEdit] = useState(null);

    const handleEditClick = (chat) => {
        setChatToEdit(chat);
        setIsEditDialogOpen(true);
    };

    return (
        <aside className='sidebar'>
            
            <div className='sidebar__wrapper-create'>
                <h2 className='sidebar__wrapper-title'>Chats</h2>
                <div className='sidebar__create-chat'>
                    <button className='sidebar__create-chat--btn' onClick={() => setIsDialogOpen(true)}><IoMdAdd /></button>
                    <NewChatDialog 
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        onCreate={onCreateChat}
                    />
                </div>
            </div>

            <nav className='chats'>
                <ul className='chats__list'>
                    {chats.map((chat, index) => (
                        
                        <li key={index} className='chats__item'>
                            <Link to='#' onClick={() => onSelectChat(chat._id)} className='chats__link'>
                                <div className='chat-avatar'>
                                    {chat.avatar ? (
                                        <img src={chat.avatar} alt={`${chat.firstName} ${chat.lastName}`} />
                                    ) : (
                                        <div className='default-avatar'>{<PiFinnTheHumanFill/>}</div>
                                    )}
                                </div>
                                <div className='chats__info'>
                                    <div className='chats__name'>{chat.firstName} {chat.lastName}</div>
                                    <div className='chas__last-message'>{chat.lastMessage}</div>
                                </div>
                            </Link>
                            <button onClick={() => handleEditClick(chat)} className='chats__btn edit'><AiOutlineEdit /></button>
                            <button onClick={() => onDeleteChat(chat._id)} className='chats__btn delet'><AiOutlineDelete/></button>
                           
                        </li>
                        
                    ))}
                </ul>
            </nav>

            <EditChatDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                onUpdateChat={onUpdateChat}
                chat={chatToEdit}
            />
        </aside>
    );
}

export default ChatSidebar;
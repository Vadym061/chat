import React, { useState } from 'react';
import './EditChatDialogStyle.scss'; 

function EditChatDialog({ isOpen, onClose, onUpdateChat, chat }) {
    const [firstName, setFirstName] = useState(chat?.firstName || '');
    const [lastName, setLastName] = useState(chat?.lastName || '');

    const handleUpdate = () => {
        onUpdateChat(chat._id, { firstName, lastName });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="edit-chat-dialog-overlay" onClick={onClose}>
            <div className="edit-chat-dialog" onClick={(e) => e.stopPropagation()}>
                <h2 className="edit-chat-dialog__title">Edit chat</h2>
                <input 
                    type="text" 
                    className="edit-chat-dialog__input" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    placeholder="First Name"
                />
                <input 
                    type="text" 
                    className="edit-chat-dialog__input" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    placeholder="Last Name"
                />
                <div className="edit-chat-dialog__actions">
                    <button className="edit-chat-dialog__button save" onClick={handleUpdate}>Save</button>
                    <button className="edit-chat-dialog__button cancel" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default EditChatDialog;
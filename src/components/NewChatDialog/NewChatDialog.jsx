import React, { useState } from 'react';
import './NewChatDialogStyle.scss';

function NewChatDialog({ isOpen, onClose, onCreate }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');

    const handleCreate = () => {
        if (!firstName || !lastName) {
            setError('Both fields are required');
            return;
        }

        onCreate({ firstName, lastName });
        setFirstName('');
        setLastName('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <h3 className='dialog-title'>Create New Chat</h3>
                <div className='dialog-field'>
                    <label className='dialog-label'>
                        First Name:
                        <input
                            className='dialog-input'
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className='dialog-field'>
                    <label className='dialog-label'>
                        Last Name:
                        <input
                            className='dialog-input'
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                {error && <p className='dialog-error'>{error}</p>}
                <div className="dialog-actions">
                    <button className='dialog-button cancel' onClick={onClose}>Cancel</button>
                    <button className='dialog-button create' onClick={handleCreate}>Create</button>
                </div>
            </div>
        </div>
    );
}

export default NewChatDialog;
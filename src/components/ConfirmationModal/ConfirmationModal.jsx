import React from 'react';
import './ConfirmationModalStyle.scss';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-modal">
      <div className="confirmation-modal__overlay" onClick={onClose}></div>
      <div className="confirmation-modal__content">
        <h3 className="confirmation-modal__message">{message}</h3>
        <div className="confirmation-modal__buttons">
          <button className="confirmation-modal__button confirm" onClick={onConfirm}>Confirm</button>
          <button className="confirmation-modal__button cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
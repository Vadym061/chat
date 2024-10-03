import React from 'react';
import './ToastStyle.scss'; // Файл стилів для оформлення сповіщення

function Toast({ message, onClose }) {
  return (
    <div className="toast">
      <p>{message}</p>
      <button onClick={onClose}>Закрити</button>
    </div>
  );
}

export default Toast;
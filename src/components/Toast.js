import React, { useEffect, useState } from 'react';
import './Toast.css';

const ICONS = {
  warning: '⚠️',
  error:   '❌',
  success: '✅',
  info:    'ℹ️',
};

const Toast = ({ message, type = 'warning', onDismiss }) => {
  const [visible, setVisible] = useState(false);

  // Trigger enter animation on mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    // Wait for exit animation before calling onDismiss
    setTimeout(onDismiss, 280);
  };

  return (
    <div
      className={`toast toast--${type} ${visible ? 'toast--in' : 'toast--out'}`}
      role="alert"
      aria-live="assertive"
    >
      <span className="toast__icon">{ICONS[type] || ICONS.warning}</span>
      <span className="toast__message">{message}</span>
      <button
        className="toast__close"
        onClick={handleClose}
        aria-label="Fechar"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;

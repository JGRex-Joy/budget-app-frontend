import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  type = 'button',
  loading = false,
  className = ''
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${disabled ? 'btn-disabled' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="btn-spinner"></div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
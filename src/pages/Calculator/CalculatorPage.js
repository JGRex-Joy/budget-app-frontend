import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { operationsAPI } from '../../services/api';
import './CalculatorPage.css';

const CalculatorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, account } = location.state || {};
  const [amount, setAmount] = useState('0');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumberPress(e.key);
      } else if (e.key === '.') {
        handleNumberPress('.');
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [amount]);

  const handleNumberPress = (num) => {
    setError('');
    if (num === '.' && amount.includes('.')) return;
    
    if (amount === '0' && num !== '.') {
      setAmount(num);
    } else {
      setAmount(amount + num);
    }
  };

  const handleDelete = () => {
    setError('');
    if (amount.length === 1) {
      setAmount('0');
    } else {
      setAmount(amount.slice(0, -1));
    }
  };

  const handleClear = () => {
    setAmount('0');
    setError('');
  };

  const handleSubmit = async () => {
    if (!account || !account.id) {
      setError('Счет не найден');
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount === 0 || isNaN(numAmount)) {
      setError('Введите корректную сумму');
      return;
    }

    try {
      await operationsAPI.create({
        account_id: account.id,
        category_id: category.id,
        amount: numAmount,
        description: `${category.name} операция`,
        operation_date: new Date().toISOString(),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 500);
    } catch (error) {
      console.error('Error creating operation:', error);
      setError(error.response?.data?.detail || 'Не удалось создать операцию');
    }
  };

  return (
    <div className="calculator-page">
      <div className="calculator-container">
        <div className="calculator-hint">
          Подсказка: используйте клавиатуру для ввода
        </div>

        <div className="calculator-header">
          <div className="calculator-category-badge">
            <span className="calculator-category-icon">{category?.icon}</span>
            <span className="calculator-category-name">{category?.name}</span>
          </div>
          <button className="calculator-close" onClick={() => navigate(-1)}>✕</button>
        </div>

        <div className="calculator-account-info">
          <div className="calculator-account-label">Счет:</div>
          <div className="calculator-account-name">{account?.icon} {account?.name}</div>
          <div className="calculator-account-balance">Баланс: {account?.balance} {account?.currency}</div>
        </div>

        <div className="calculator-display">
          <div className="calculator-display-text">{amount}с</div>
        </div>

        {error && (
          <div className="calculator-error">
            {error}
          </div>
        )}

        {success && (
          <div className="calculator-success">
            Операция успешно добавлена!
          </div>
        )}

        <div className="calculator-keyboard">
          <div className="calculator-top-controls">
            <button className="calculator-clear-button" onClick={handleClear}>AC</button>
            <button className="calculator-delete-button" onClick={handleDelete}>⌫</button>
          </div>

          {['789', '456', '123'].map((row, idx) => (
            <div key={idx} className="calculator-row">
              {row.split('').map((num) => (
                <button
                  key={num}
                  className="calculator-number-button"
                  onClick={() => handleNumberPress(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          ))}

          <div className="calculator-bottom-row">
            <button className="calculator-number-button zero" onClick={() => handleNumberPress('0')}>0</button>
            <button className="calculator-number-button" onClick={() => handleNumberPress('.')}>.</button>
            <button className="calculator-submit-button" onClick={handleSubmit} disabled={success}>✓</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CalculatorPage;
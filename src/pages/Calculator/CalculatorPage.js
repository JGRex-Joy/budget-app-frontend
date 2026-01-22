import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { operationsAPI } from '../../services/api';
import './CalculatorPage.css';

const CalculatorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, account } = location.state || {};
  const [amount, setAmount] = useState('0');

  const handleNumberPress = (num) => {
    if (amount === '0') {
      setAmount(num);
    } else {
      setAmount(amount + num);
    }
  };

  const handleDelete = () => {
    if (amount.length === 1) {
      setAmount('0');
    } else {
      setAmount(amount.slice(0, -1));
    }
  };

  const handleClear = () => {
    setAmount('0');
  };

  const handleSubmit = async () => {
    if (!account || !account.id) {
      alert('Счет не найден');
      return;
    }

    if (parseFloat(amount) === 0) {
      alert('Введите сумму');
      return;
    }

    try {
      await operationsAPI.create({
        account_id: account.id,
        category_id: category.id,
        amount: parseFloat(amount),
        description: `${category.name} операция`,
        operation_date: new Date().toISOString(),
      });

      alert('Операция добавлена');
      // Возвращаемся на главную страницу
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error creating operation:', error);
      alert(error.response?.data?.detail || 'Не удалось создать операцию');
    }
  };

  return (
    <div className="calculator-page">
      <div className="calculator-container">
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
            <button className="calculator-submit-button" onClick={handleSubmit}>✓</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
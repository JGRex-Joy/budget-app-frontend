import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { accountsAPI } from '../../services/api';
import './AccountSelectorPage.css';

const AccountSelectorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = location.state || {};
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const response = await accountsAPI.getAll();
      setAccounts(response.data || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSelect = (account) => {
    navigate('/calculator', {
      state: { category, account }
    });
  };

  if (loading) {
    return <div className="account-selector-loading">Загрузка...</div>;
  }

  return (
    <div className="account-selector-page">
      <div className="account-selector-container">
        <div className="account-selector-header">
          <div className="account-selector-category-info">
            <span className="account-selector-category-icon">{category?.icon}</span>
            <div>
              <div className="account-selector-category-name">{category?.name}</div>
              <div className="account-selector-category-type">
                {category?.type === 'expense' ? 'Расход' : 'Доход'}
              </div>
            </div>
          </div>
          <button className="account-selector-close" onClick={() => navigate(-1)}>✕</button>
        </div>

        <h2 className="account-selector-title">Выберите счет</h2>

        <div className="account-selector-list">
          {accounts.map((account) => (
            <button
              key={account.id}
              className="account-selector-card"
              onClick={() => handleAccountSelect(account)}
            >
              <div className="account-selector-left">
                <div className="account-selector-icon-container">
                  <span className="account-selector-icon">{account.icon}</span>
                </div>
                <div>
                  <div className="account-selector-name">{account.name}</div>
                  <div className="account-selector-currency">{account.currency}</div>
                </div>
              </div>
              <div className="account-selector-right">
                <div className="account-selector-balance">{account.balance}</div>
                <div className="account-selector-balance-label">Баланс</div>
              </div>
            </button>
          ))}

          {accounts.length === 0 && (
            <div className="account-selector-empty">
              <div className="account-selector-empty-icon">💳</div>
              <div className="account-selector-empty-text">Нет доступных счетов</div>
              <div className="account-selector-empty-hint">Добавьте счет в настройках</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSelectorPage;
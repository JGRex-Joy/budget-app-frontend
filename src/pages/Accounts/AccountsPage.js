import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountsAPI } from '../../services/api';
import Button from '../../components/common/Button/Button';
import './AccountsPage.css';

const AccountsPage = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountsAPI.getAll();
      setAccounts(response.data || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот счет?')) return;
    
    try {
      await accountsAPI.delete(id);
      alert('Счет удален');
      loadAccounts();
    } catch (error) {
      alert(error.response?.data?.detail || 'Не удалось удалить счет');
    }
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  };

  if (loading) {
    return <div className="accounts-loading">Загрузка...</div>;
  }

  return (
    <div className="accounts-page">
      <div className="accounts-container">
        <h1 className="accounts-title">Мои счета</h1>

        <div className="accounts-total-card">
          <div>
            <div className="accounts-total-label">Общий бюджет</div>
            <div className="accounts-total-count">
              {accounts.length} {accounts.length === 1 ? 'счет' : 'счетов'}
            </div>
          </div>
          <div className="accounts-total-amount">{getTotalBalance()} с</div>
        </div>

        <div className="accounts-list">
          {accounts.map((account) => (
            <div key={account.id} className="account-card">
              <div className="account-left">
                <div className="account-icon-container">
                  <span className="account-icon">{account.icon}</span>
                </div>
                <div className="account-info">
                  <div className="account-name">{account.name}</div>
                  <div className="account-currency">{account.currency}</div>
                </div>
              </div>
              <div className="account-right">
                <div className="account-balance">{account.balance} с</div>
                <button 
                  className="account-delete"
                  onClick={() => handleDelete(account.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {accounts.length === 0 && (
          <div className="accounts-empty">
            <div className="accounts-empty-icon">💳</div>
            <div className="accounts-empty-text">Нет счетов</div>
            <div className="accounts-empty-hint">Добавьте первый счет</div>
          </div>
        )}

        <div className="accounts-add-button">
          <Button onClick={() => navigate('/add-account', { state: { onComplete: loadAccounts } })}>
            + Добавить счет
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
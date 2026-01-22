import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountsAPI } from '../../services/api';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Modal/Modal';
import './AccountsPage.css';

const AccountsPage = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      if (!loading) {
        loadAccounts();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loading]);

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

  const handleDeleteClick = (account) => {
    setAccountToDelete(account);
    setDeleteModalOpen(true);
    setDeleteError('');
  };

  const handleDeleteConfirm = async () => {
    if (!accountToDelete) return;
    
    try {
      await accountsAPI.delete(accountToDelete.id);
      await loadAccounts();
      setDeleteModalOpen(false);
      setAccountToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message ||
                          'Не удалось удалить счет';
      setDeleteError(errorMessage);
    }
  };

  const handleAddAccount = () => {
    navigate('/add-account');
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
                  onClick={() => handleDeleteClick(account)}
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
          <Button onClick={handleAddAccount}>
            + Добавить счет
          </Button>
        </div>
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setAccountToDelete(null);
          setDeleteError('');
        }}
        title="Удалить счет?"
      >
        <div className="delete-modal-content">
          {accountToDelete && (
            <>
              <div className="delete-modal-account">
                <span className="delete-modal-icon">{accountToDelete.icon}</span>
                <div>
                  <div className="delete-modal-name">{accountToDelete.name}</div>
                  <div className="delete-modal-balance">Баланс: {accountToDelete.balance} с</div>
                </div>
              </div>
              
              {deleteError && (
                <div className="delete-modal-error">
                  {deleteError}
                </div>
              )}

              <div className="delete-modal-buttons">
                <Button 
                  variant="secondary"
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setAccountToDelete(null);
                    setDeleteError('');
                  }}
                >
                  Отмена
                </Button>
                <Button 
                  variant="danger"
                  onClick={handleDeleteConfirm}
                >
                  Удалить
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AccountsPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountsAPI } from '../../services/api';
import { ACCOUNT_ICONS } from '../../utils/constants';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import './AddAccountPage.css';

const AddAccountPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !selectedIcon) {
      alert('Заполните все обязательные поля');
      return;
    }

    setLoading(true);
    try {
      await accountsAPI.create({
        name,
        currency: 'KGS',
        icon: selectedIcon,
      });

      alert('Счет добавлен');
      navigate('/accounts');
    } catch (error) {
      alert('Не удалось создать счет');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-account-page">
      <div className="add-account-container">
        <h1 className="add-account-title">Новый счет</h1>

        <form onSubmit={handleSubmit} className="add-account-form">
          <div className="add-account-field">
            <label className="add-account-label">Название счета</label>
            <Input
              placeholder="Например: Основной счет"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="add-account-field">
            <label className="add-account-label">Выберите иконку</label>
            <div className="add-account-icons-grid">
              {ACCOUNT_ICONS.map((icon, index) => (
                <button
                  key={index}
                  type="button"
                  className={`add-account-icon-button ${selectedIcon === icon ? 'active' : ''}`}
                  onClick={() => setSelectedIcon(icon)}
                  disabled={loading}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" loading={loading}>
            Создать счет
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddAccountPage;
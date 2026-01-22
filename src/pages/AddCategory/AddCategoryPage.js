import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { categoriesAPI } from '../../services/api';
import { CATEGORY_ICONS } from '../../utils/constants';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import './AddCategoryPage.css';

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = location.state || { type: 'expense' };
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !selectedIcon) {
      setError('Заполните все поля');
      return;
    }

    setLoading(true);
    try {
      await categoriesAPI.create({
        name,
        type,
        icon: selectedIcon,
        color: '#FF9500',
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.detail || 'Не удалось создать категорию');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-category-page">
      <div className="add-category-container">
        <h1 className="add-category-title">
          Добавить категорию ({type === 'expense' ? 'Расход' : 'Доход'})
        </h1>

        {error && (
          <div className="add-category-error">
            {error}
          </div>
        )}

        {success && (
          <div className="add-category-success">
            Категория успешно добавлена!
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-category-form">
          <div className="add-category-field">
            <label className="add-category-label">Название</label>
            <Input
              placeholder="Введите название"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading || success}
            />
          </div>

          <div className="add-category-field">
            <label className="add-category-label">Выберите иконку</label>
            <div className="add-category-icons-grid">
              {CATEGORY_ICONS.map((icon, index) => (
                <button
                  key={index}
                  type="button"
                  className={`add-category-icon-button ${selectedIcon === icon ? 'active' : ''}`}
                  onClick={() => setSelectedIcon(icon)}
                  disabled={loading || success}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" loading={loading} disabled={success}>
            Добавить
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryPage;
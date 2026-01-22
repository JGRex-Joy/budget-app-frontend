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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !selectedIcon) {
      alert('Заполните все поля');
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

      alert('Категория добавлена');
      // Возвращаемся назад
      navigate('/', { replace: true });
    } catch (error) {
      alert('Не удалось создать категорию');
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

        <form onSubmit={handleSubmit} className="add-category-form">
          <div className="add-category-field">
            <label className="add-category-label">Название</label>
            <Input
              placeholder="Введите название"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
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
                  disabled={loading}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" loading={loading}>
            Добавить
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryPage;
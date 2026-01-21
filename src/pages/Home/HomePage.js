import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesAPI, accountsAPI, userAPI } from '../../services/api';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../../utils/constants';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('expense');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const userResponse = await userAPI.getProfile();
      setUserName(userResponse.data.username || 'Пользователь');

      await ensureAccountExists();
      await createDefaultCategories();
      await loadData();
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setLoading(false);
    }
  };

  const ensureAccountExists = async () => {
    try {
      const accountsResponse = await accountsAPI.getAll();
      if (!accountsResponse.data || accountsResponse.data.length === 0) {
        await accountsAPI.create({
          name: 'Основной счет',
          balance: 0,
          currency: 'KGS',
          icon: '💳'
        });
      }
    } catch (error) {
      console.error('Error ensuring account:', error);
    }
  };

  const createDefaultCategories = async () => {
    try {
      const existingCategories = await categoriesAPI.getAll();
      
      if (!existingCategories.data || existingCategories.data.length === 0) {
        for (const cat of DEFAULT_EXPENSE_CATEGORIES) {
          await categoriesAPI.create({ ...cat, type: 'expense' });
        }
        for (const cat of DEFAULT_INCOME_CATEGORIES) {
          await categoriesAPI.create({ ...cat, type: 'income' });
        }
      }
    } catch (error) {
      console.error('Error creating default categories:', error);
    }
  };

  const loadData = async () => {
    try {
      const [expenseCats, incomeCats] = await Promise.all([
        categoriesAPI.getWithBalances('expense'),
        categoriesAPI.getWithBalances('income'),
      ]);

      setExpenseCategories(expenseCats.data || []);
      setIncomeCategories(incomeCats.data || []);

      const totalExpense = (expenseCats.data || []).reduce((sum, cat) => sum + (cat.total_amount || 0), 0);
      const totalIncome = (incomeCats.data || []).reduce((sum, cat) => sum + (cat.total_amount || 0), 0);
      
      setExpenses(totalExpense);
      setIncome(totalIncome);
      setBalance(totalIncome - totalExpense);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleCategoryPress = (category) => {
    navigate('/account-selector', {
      state: { category, onComplete: loadData }
    });
  };

  const handleAddCategory = () => {
    navigate('/add-category', {
      state: { type: activeTab, onComplete: loadData }
    });
  };

  const currentCategories = activeTab === 'expense' ? expenseCategories : incomeCategories;

  if (loading) {
    return <div className="home-loading">Загрузка...</div>;
  }

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-greeting">
          <h2 className="home-greeting-text">Добро пожаловать,</h2>
          <h1 className="home-user-name">{userName}!</h1>
        </div>
        
        <div className="home-balance-card">
          <div className="home-balance-header">
            <div>
              <div className="home-balance-label">Общий бюджет</div>
              <div className="home-balance-amount">{balance}с</div>
            </div>
            <div className="home-money-icon">💰</div>
          </div>
        </div>

        <div className="home-summary-card">
          <button 
            className={`home-summary-item ${activeTab === 'expense' ? 'active' : ''}`}
            onClick={() => setActiveTab('expense')}
          >
            <span className="home-summary-icon">📉</span>
            <div>
              <div className="home-summary-label">Расход</div>
              <div className="home-summary-amount">{expenses}с</div>
            </div>
          </button>
          <div className="home-divider" />
          <button 
            className={`home-summary-item ${activeTab === 'income' ? 'active' : ''}`}
            onClick={() => setActiveTab('income')}
          >
            <span className="home-summary-icon">📈</span>
            <div>
              <div className="home-summary-label">Доход</div>
              <div className="home-summary-amount">{income}с</div>
            </div>
          </button>
        </div>

        <h3 className="home-section-title">
          {activeTab === 'expense' ? 'Расходы' : 'Доходы'}
        </h3>

        <div className="home-categories-grid">
          {currentCategories.map((cat) => (
            <button
              key={cat.id}
              className="home-category-item"
              onClick={() => handleCategoryPress(cat)}
            >
              <span className="home-category-icon">{cat.icon}</span>
              <div className="home-category-info">
                <div className="home-category-name">{cat.name}</div>
                <div className="home-category-amount">{cat.total_amount || 0}с</div>
              </div>
            </button>
          ))}
          
          <button 
            className="home-add-category" 
            onClick={handleAddCategory}
          >
            <span className="home-add-icon">+</span>
            <span className="home-add-text">Добавить</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
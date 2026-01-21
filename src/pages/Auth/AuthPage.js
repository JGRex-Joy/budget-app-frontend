import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import './AuthPage.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }

    if (!isLogin && !username) {
      setError('Введите имя пользователя');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const response = await authAPI.login({ email, password });
        if (response.data && response.data.access_token) {
          login(response.data.access_token, response.data.user);
          navigate('/');
        }
      } else {
        await authAPI.register({ email, username, password });
        alert('Регистрация завершена. Войдите в систему.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message ||
                          'Произошла ошибка';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">💰</div>
          <h1 className="auth-app-name">Budget App</h1>
        </div>

        <div className="auth-card">
          <h2 className="auth-title">{isLogin ? 'Вход' : 'Регистрация'}</h2>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
            
            {!isLogin && (
              <Input
                type="text"
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="username"
              />
            )}
            
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
            
            <Button type="submit" loading={loading}>
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </form>
          
          <button 
            className="auth-switch"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            disabled={loading}
          >
            {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Есть аккаунт? Войдите'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
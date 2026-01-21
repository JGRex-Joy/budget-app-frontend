import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import Modal from '../../components/common/Modal/Modal';
import { LANGUAGES, THEMES } from '../../utils/constants';
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Русский');
  const [selectedTheme, setSelectedTheme] = useState('Темная');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await userAPI.getProfile();
      setUserEmail(response.data.email || '');
      setUserName(response.data.username || 'Пользователь');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      logout();
      navigate('/auth');
    }
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setLanguageModalOpen(false);
    alert(`Язык изменен на ${lang}`);
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    setThemeModalOpen(false);
    alert(`Тема изменена на ${theme}`);
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">Настройки</h1>

        <div className="settings-profile-card">
          <div className="settings-profile-info">
            <div className="settings-profile-name">{userName}</div>
            <div className="settings-profile-email">{userEmail}</div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Приложение</div>
          
          <button 
            className="settings-item"
            onClick={() => setThemeModalOpen(true)}
          >
            <div className="settings-item-left">
              <span className="settings-item-icon">🎨</span>
              <span className="settings-item-title">Тема</span>
            </div>
            <div className="settings-item-right">
              <span className="settings-item-value">{selectedTheme}</span>
              <span className="settings-item-arrow">›</span>
            </div>
          </button>

          <button 
            className="settings-item"
            onClick={() => setLanguageModalOpen(true)}
          >
            <div className="settings-item-left">
              <span className="settings-item-icon">🌐</span>
              <span className="settings-item-title">Язык</span>
            </div>
            <div className="settings-item-right">
              <span className="settings-item-value">{selectedLanguage}</span>
              <span className="settings-item-arrow">›</span>
            </div>
          </button>
        </div>

        <button className="settings-logout-button" onClick={handleLogout}>
          Выйти
        </button>

        <div className="settings-version">Версия 1.0.0</div>
      </div>

      <Modal
        isOpen={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
        title="Выберите язык"
      >
        <div className="settings-modal-options">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              className={`settings-modal-option ${selectedLanguage === lang ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang)}
            >
              <span>{lang}</span>
              {selectedLanguage === lang && <span className="settings-modal-check">✓</span>}
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        title="Выберите тему"
      >
        <div className="settings-modal-options">
          {THEMES.map((theme) => (
            <button
              key={theme}
              className={`settings-modal-option ${selectedTheme === theme ? 'active' : ''}`}
              onClick={() => handleThemeChange(theme)}
            >
              <span>{theme}</span>
              {selectedTheme === theme && <span className="settings-modal-check">✓</span>}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;
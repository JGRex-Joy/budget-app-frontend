import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TabBar.css';

const TabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/', label: 'Главная', icon: '🏠' },
    { path: '/history', label: 'История', icon: '📋' },
    { path: '/accounts', label: 'Счета', icon: '💳' },
    { path: '/settings', label: 'Настройки', icon: '⚙️' },
  ];

  return (
    <div className="tabbar">
      <div className="tabbar-container">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            className={`tabbar-item ${location.pathname === tab.path ? 'tabbar-item-active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="tabbar-icon">{tab.icon}</span>
            <span className="tabbar-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabBar;
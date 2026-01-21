import React, { useState, useEffect } from 'react';
import { operationsAPI } from '../../services/api';
import { groupByDate, formatTime } from '../../utils/formatters';
import './HistoryPage.css';

const HistoryPage = () => {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOperations();
  }, []);

  const loadOperations = async () => {
    try {
      setLoading(true);
      const response = await operationsAPI.getDetails();
      setOperations(response.data || []);
    } catch (error) {
      console.error('Error loading operations:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedOperations = groupByDate(operations);

  if (loading) {
    return <div className="history-loading">Загрузка...</div>;
  }

  return (
    <div className="history-page">
      <div className="history-container">
        <h1 className="history-title">История операций</h1>

        {Object.keys(groupedOperations).map((date) => (
          <div key={date} className="history-date-group">
            <div className="history-date-label">{date}</div>
            {groupedOperations[date].map((operation) => (
              <div key={operation.id} className="history-operation-card">
                <div className="history-operation-left">
                  <div className="history-icon-container">
                    <span className="history-operation-icon">💰</span>
                  </div>
                  <div>
                    <div className="history-operation-description">
                      {operation.description}
                    </div>
                    <div className="history-operation-time">
                      {formatTime(operation.created_at)}
                    </div>
                  </div>
                </div>
                <div
                  className={`history-operation-amount ${
                    operation.category_type === 'income' ? 'income' : 'expense'
                  }`}
                >
                  {operation.category_type === 'income' ? '+' : '-'}
                  {operation.amount} с
                </div>
              </div>
            ))}
          </div>
        ))}

        {operations.length === 0 && (
          <div className="history-empty">
            <div className="history-empty-icon">📊</div>
            <div className="history-empty-text">Пока нет операций</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
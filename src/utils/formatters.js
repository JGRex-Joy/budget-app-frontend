// Форматирование даты
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Сегодня';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Вчера';
  } else {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  }
};

// Форматирование времени
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Форматирование суммы
export const formatAmount = (amount, currency = 'с') => {
  return `${amount} ${currency}`;
};

// Группировка операций по датам
export const groupByDate = (operations) => {
  const grouped = {};
  operations.forEach((op) => {
    const date = formatDate(op.created_at);
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(op);
  });
  return grouped;
};
// Format date
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format number with commas
export const formatNumber = (num) => {
  if (!num) return '0';
  return num.toLocaleString('en-US');
};

// Format currency
export const formatCurrency = (amount) => {
  if (!amount) return '$0';
  return `$${amount.toLocaleString('en-US')}`;
};

// Truncate text
export const truncate = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validate email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Get status badge color
export const getStatusColor = (status) => {
  const colors = {
    planned: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    new: 'bg-blue-100 text-blue-800',
    read: 'bg-gray-100 text-gray-800',
    replied: 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Get category label
export const getCategoryLabel = (category) => {
  const labels = {
    'borehole-donation': 'Borehole Donation',
    'borehole-repair': 'Borehole Repair',
    'education': 'Education',
    'babies': 'Babies',
    'other': 'Other',
  };
  return labels[category] || category;
};

export default {
  formatDate,
  formatNumber,
  formatCurrency,
  truncate,
  debounce,
  isValidEmail,
  getStatusColor,
  getCategoryLabel,
};

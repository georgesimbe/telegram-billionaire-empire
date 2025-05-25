// Format large numbers with abbreviations
export const formatNumber = (num) => {
  // Handle undefined, null, or non-numeric values
  if (num === undefined || num === null || isNaN(num)) {
    return '0';
  }

  // Convert to number if it's a string
  const number = typeof num === 'string' ? parseFloat(num) : num;

  if (number >= 1e9) {
    return (number / 1e9).toFixed(2) + 'B';
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(2) + 'M';
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(1) + 'K';
  }
  return number.toLocaleString();
};

// Format time in MM:SS or HH:MM:SS
export const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const m = minutes % 60;
    const s = seconds % 60;
    return `${hours}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  } else {
    const s = seconds % 60;
    return `${minutes}:${s.toString().padStart(2, '0')}`;
  }
};

// Format date relative to now
export const formatRelativeTime = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return 'just now';
  }
};

// Format TON amount
export const formatTON = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0.0000 TON';
  }
  const number = typeof amount === 'string' ? parseFloat(amount) : amount;
  return number.toFixed(4) + ' TON';
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  return value.toFixed(decimals) + '%';
};
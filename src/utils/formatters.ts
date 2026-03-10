/**
 * Превращает возраст в ЧАСАХ (из API) в человекочитаемую строку
 */
export const formatAge = (hours: number): string => {
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

export const formatPrice = (price: number): string => {
  return price?.toFixed(3);
};

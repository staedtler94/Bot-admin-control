export const formatDate = (timestamp: number | string): string => {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    ENABLED: '✓ Enabled',
    DISABLED: '✗ Disabled',
    PAUSED: '⏸ Paused',
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    ENABLED: 'bg-green-100 text-green-800',
    DISABLED: 'bg-red-100 text-red-800',
    PAUSED: 'bg-yellow-100 text-yellow-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

export const truncate = (text: string, length: number = 100): string => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

/**
 * Formate le temps en secondes en format lisible
 * @param {number} seconds - Le temps en secondes
 * @returns {string} - Le temps formaté (ex: "5m 30s")
 */
export const formatTime = (seconds) => {
  if (!seconds || seconds === 0) return '0m 0s';

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

/**
 * Formate le temps en format long (heures incluses si nécessaire)
 * @param {number} seconds - Le temps en secondes
 * @returns {string} - Le temps formaté (ex: "1h 30m")
 */
export const formatTimeLong = (seconds) => {
  if (!seconds || seconds === 0) return '0 minutes';

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}m`);
  if (secs > 0 && hours === 0) parts.push(`${secs}s`);

  return parts.join(' ') || '0 minutes';
};

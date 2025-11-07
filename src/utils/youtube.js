/**
 * Extrait l'ID YouTube d'une URL
 * @param {string} url - L'URL YouTube
 * @returns {string|null} - L'ID de la vidéo ou null si invalide
 */
export const extractYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Génère l'URL de la miniature YouTube
 * @param {string} videoId - L'ID de la vidéo YouTube
 * @returns {string} - L'URL de la miniature
 */
export const getYouTubeThumbnail = (videoId) => {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
};

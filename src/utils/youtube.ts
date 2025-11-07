import { YouTubeApiResponse } from '../types';

export const extractYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
};

export const fetchYouTubeTitle = async (videoId: string): Promise<string | null> => {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  if (!apiKey || apiKey === 'votre_youtube_api_key_ici') {
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
    );

    if (!response.ok) {
      return null;
    }

    const data: YouTubeApiResponse = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items[0].snippet.title;
    }

    return null;
  } catch (error) {
    console.error('Error fetching YouTube title:', error);
    return null;
  }
};

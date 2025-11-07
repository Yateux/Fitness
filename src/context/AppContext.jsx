import { createContext, useContext, useState, useEffect } from 'react';
import { extractYouTubeId } from '../utils/youtube';
import {
  subscribeToCategories,
  subscribeToVideos,
  subscribeToWatchTime,
  saveCategories,
  saveVideos,
  saveWatchTime,
  deleteVideoFromFirebase,
  deleteCategoryFromFirebase
} from '../services/firebaseService';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [watchTime, setWatchTime] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // S'abonner aux données Firebase en temps réel
  useEffect(() => {
    const unsubscribeCategories = subscribeToCategories((data) => {
      // Trier par ordre si disponible, sinon par date de création
      const sorted = data.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      setCategories(sorted);
      setIsLoading(false);
    });

    const unsubscribeVideos = subscribeToVideos((data) => {
      // Trier par ordre si disponible, sinon par date de création
      const sorted = data.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      setVideos(sorted);
    });

    const unsubscribeWatchTime = subscribeToWatchTime((data) => {
      setWatchTime(data);
    });

    // Nettoyage lors du démontage
    return () => {
      unsubscribeCategories();
      unsubscribeVideos();
      unsubscribeWatchTime();
    };
  }, []);

  // Actions pour les catégories
  const addCategory = async (name) => {
    const newCategory = {
      id: Date.now().toString(),
      name: name.trim(),
      order: categories.length,
      createdAt: new Date().toISOString()
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
    return newCategory;
  };

  const reorderCategories = async (newOrder) => {
    const reordered = newOrder.map((cat, index) => ({ ...cat, order: index }));
    setCategories(reordered);
    await saveCategories(reordered);
  };

  const deleteCategory = async (categoryId) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    const updatedVideos = videos.filter(vid => vid.categoryId !== categoryId);

    setCategories(updatedCategories);
    setVideos(updatedVideos);

    await deleteCategoryFromFirebase(categoryId);
    await saveCategories(updatedCategories);
    await saveVideos(updatedVideos);
  };

  const updateCategory = async (categoryId, name) => {
    const updatedCategories = categories.map(cat =>
      cat.id === categoryId ? { ...cat, name: name.trim() } : cat
    );
    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
  };

  // Actions pour les vidéos
  const addVideo = async (title, url, categoryId) => {
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      throw new Error('URL YouTube invalide');
    }

    const categoryVideos = videos.filter(v => v.categoryId === categoryId);
    const newVideo = {
      id: Date.now().toString(),
      title: title.trim(),
      url,
      videoId,
      categoryId,
      order: categoryVideos.length,
      createdAt: new Date().toISOString()
    };
    const updatedVideos = [...videos, newVideo];
    setVideos(updatedVideos);
    await saveVideos(updatedVideos);
    return newVideo;
  };

  const reorderVideos = async (categoryId, newOrder) => {
    const reordered = newOrder.map((vid, index) => ({ ...vid, order: index }));
    const otherVideos = videos.filter(v => v.categoryId !== categoryId);
    const allVideos = [...otherVideos, ...reordered];
    setVideos(allVideos);
    await saveVideos(allVideos);
  };

  const deleteVideo = async (videoId) => {
    const updatedVideos = videos.filter(vid => vid.id !== videoId);
    setVideos(updatedVideos);
    await deleteVideoFromFirebase(videoId);
  };

  const updateVideo = async (videoId, updates) => {
    const updatedVideos = videos.map(vid =>
      vid.id === videoId ? { ...vid, ...updates } : vid
    );
    setVideos(updatedVideos);
    await saveVideos(updatedVideos);
  };

  // Actions pour le temps de visionnage
  const addWatchTime = async (videoId, seconds) => {
    const updatedWatchTime = {
      ...watchTime,
      [videoId]: (watchTime[videoId] || 0) + seconds
    };
    setWatchTime(updatedWatchTime);
    await saveWatchTime(updatedWatchTime);
  };

  const updateWatchTime = async (newWatchTime) => {
    setWatchTime(newWatchTime);
    await saveWatchTime(newWatchTime);
  };

  // Utilitaires
  const getCategoryVideos = (categoryId) => {
    return videos
      .filter(vid => vid.categoryId === categoryId)
      .sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
  };

  const getCategoryTotalTime = (categoryId) => {
    const categoryVideos = getCategoryVideos(categoryId);
    return categoryVideos.reduce((total, vid) => total + (watchTime[vid.id] || 0), 0);
  };

  const getVideoById = (videoId) => {
    return videos.find(vid => vid.id === videoId);
  };

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const value = {
    // State
    categories,
    videos,
    watchTime,
    isLoading,

    // Category actions
    addCategory,
    deleteCategory,
    updateCategory,
    reorderCategories,

    // Video actions
    addVideo,
    deleteVideo,
    updateVideo,
    reorderVideos,

    // Watch time actions
    addWatchTime,
    setWatchTime: updateWatchTime,

    // Utils
    getCategoryVideos,
    getCategoryTotalTime,
    getVideoById,
    getCategoryById
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collection de référence pour un utilisateur (vous pouvez ajouter l'auth plus tard)
const USER_ID = 'default-user'; // Pour l'instant, un seul utilisateur

// Références aux collections
const categoriesRef = collection(db, 'users', USER_ID, 'categories');
const videosRef = collection(db, 'users', USER_ID, 'videos');
const watchTimeRef = doc(db, 'users', USER_ID, 'data', 'watchTime');

// ============ CATEGORIES ============

export const saveCategories = async (categories) => {
  try {
    const batch = categories.map(category =>
      setDoc(doc(categoriesRef, category.id), category)
    );
    await Promise.all(batch);
    console.log('Categories saved to Firebase');
  } catch (error) {
    console.error('Error saving categories:', error);
    throw error;
  }
};

export const loadCategories = async () => {
  try {
    const snapshot = await getDocs(categoriesRef);
    const categories = [];
    snapshot.forEach(doc => {
      categories.push(doc.data());
    });
    return categories;
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
};

export const subscribeToCategories = (callback) => {
  return onSnapshot(categoriesRef, (snapshot) => {
    const categories = [];
    snapshot.forEach(doc => {
      categories.push(doc.data());
    });
    callback(categories);
  });
};

// ============ VIDEOS ============

export const saveVideos = async (videos) => {
  try {
    const batch = videos.map(video =>
      setDoc(doc(videosRef, video.id), video)
    );
    await Promise.all(batch);
    console.log('Videos saved to Firebase');
  } catch (error) {
    console.error('Error saving videos:', error);
    throw error;
  }
};

export const loadVideos = async () => {
  try {
    const snapshot = await getDocs(videosRef);
    const videos = [];
    snapshot.forEach(doc => {
      videos.push(doc.data());
    });
    return videos;
  } catch (error) {
    console.error('Error loading videos:', error);
    return [];
  }
};

export const subscribeToVideos = (callback) => {
  return onSnapshot(videosRef, (snapshot) => {
    const videos = [];
    snapshot.forEach(doc => {
      videos.push(doc.data());
    });
    callback(videos);
  });
};

export const deleteVideoFromFirebase = async (videoId) => {
  try {
    await deleteDoc(doc(videosRef, videoId));
    console.log('Video deleted from Firebase');
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

// ============ WATCH TIME ============

export const saveWatchTime = async (watchTime) => {
  try {
    await setDoc(watchTimeRef, { data: watchTime });
    console.log('Watch time saved to Firebase');
  } catch (error) {
    console.error('Error saving watch time:', error);
    throw error;
  }
};

export const loadWatchTime = async () => {
  try {
    const docSnap = await getDoc(watchTimeRef);
    if (docSnap.exists()) {
      return docSnap.data().data || {};
    }
    return {};
  } catch (error) {
    console.error('Error loading watch time:', error);
    return {};
  }
};

export const subscribeToWatchTime = (callback) => {
  return onSnapshot(watchTimeRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data().data || {});
    } else {
      callback({});
    }
  });
};

// ============ CATEGORY OPERATIONS ============

export const deleteCategoryFromFirebase = async (categoryId) => {
  try {
    await deleteDoc(doc(categoriesRef, categoryId));
    console.log('Category deleted from Firebase');
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  CollectionReference,
  DocumentReference,
  QuerySnapshot,
  DocumentData,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Category, Video, WatchTime } from '../types';

const USER_ID = 'default-user';

const categoriesRef: CollectionReference = collection(db, 'users', USER_ID, 'categories');
const videosRef: CollectionReference = collection(db, 'users', USER_ID, 'videos');
const watchTimeRef: DocumentReference = doc(db, 'users', USER_ID, 'data', 'watchTime');

export const saveCategories = async (categories: Category[]): Promise<void> => {
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

export const loadCategories = async (): Promise<Category[]> => {
  try {
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(categoriesRef);
    const categories: Category[] = [];
    snapshot.forEach(doc => {
      categories.push(doc.data() as Category);
    });
    return categories;
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
};

export const subscribeToCategories = (callback: (categories: Category[]) => void): Unsubscribe => {
  return onSnapshot(categoriesRef, (snapshot: QuerySnapshot<DocumentData>) => {
    const categories: Category[] = [];
    snapshot.forEach(doc => {
      categories.push(doc.data() as Category);
    });
    callback(categories);
  });
};

export const saveVideos = async (videos: Video[]): Promise<void> => {
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

export const loadVideos = async (): Promise<Video[]> => {
  try {
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(videosRef);
    const videos: Video[] = [];
    snapshot.forEach(doc => {
      videos.push(doc.data() as Video);
    });
    return videos;
  } catch (error) {
    console.error('Error loading videos:', error);
    return [];
  }
};

export const subscribeToVideos = (callback: (videos: Video[]) => void): Unsubscribe => {
  return onSnapshot(videosRef, (snapshot: QuerySnapshot<DocumentData>) => {
    const videos: Video[] = [];
    snapshot.forEach(doc => {
      videos.push(doc.data() as Video);
    });
    callback(videos);
  });
};

export const deleteVideoFromFirebase = async (videoId: string): Promise<void> => {
  try {
    await deleteDoc(doc(videosRef, videoId));
    console.log('Video deleted from Firebase');
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

export const saveWatchTime = async (watchTime: WatchTime): Promise<void> => {
  try {
    await setDoc(watchTimeRef, { data: watchTime });
    console.log('Watch time saved to Firebase');
  } catch (error) {
    console.error('Error saving watch time:', error);
    throw error;
  }
};

export const loadWatchTime = async (): Promise<WatchTime> => {
  try {
    const docSnap = await getDoc(watchTimeRef);
    if (docSnap.exists()) {
      return (docSnap.data().data as WatchTime) || {};
    }
    return {};
  } catch (error) {
    console.error('Error loading watch time:', error);
    return {};
  }
};

export const subscribeToWatchTime = (callback: (watchTime: WatchTime) => void): Unsubscribe => {
  return onSnapshot(watchTimeRef, (doc) => {
    if (doc.exists()) {
      callback((doc.data().data as WatchTime) || {});
    } else {
      callback({});
    }
  });
};

export const deleteCategoryFromFirebase = async (categoryId: string): Promise<void> => {
  try {
    await deleteDoc(doc(categoriesRef, categoryId));
    console.log('Category deleted from Firebase');
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

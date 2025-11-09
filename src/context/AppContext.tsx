import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { extractYouTubeId } from "../utils/youtube";
import {
    subscribeToCategories,
    subscribeToVideos,
    subscribeToWatchTime,
    saveCategories,
    saveVideos,
    saveWatchTime,
    deleteVideoFromFirebase,
    deleteCategoryFromFirebase,
} from "../services/firebaseService";
import { Category, Video, WatchTime, AppContextType } from "../types";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within AppProvider");
    }
    return context;
};

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [watchTime, setWatchTime] = useState<WatchTime>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribeCategories = subscribeToCategories((data) => {
            const sorted = data.sort((a, b) => {
                if (a.order !== undefined && b.order !== undefined) {
                    return a.order - b.order;
                }
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
            setCategories(sorted);
            setIsLoading(false);
        });

        const unsubscribeVideos = subscribeToVideos((data) => {
            const sorted = data.sort((a, b) => {
                if (a.order !== undefined && b.order !== undefined) {
                    return a.order - b.order;
                }
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
            setVideos(sorted);
        });

        const unsubscribeWatchTime = subscribeToWatchTime((data) => {
            setWatchTime(data);
        });

        return () => {
            unsubscribeCategories();
            unsubscribeVideos();
            unsubscribeWatchTime();
        };
    }, []);

    const addCategory = async (name: string): Promise<Category> => {
        const newCategory: Category = {
            id: Date.now().toString(),
            name: name.trim(),
            order: categories.length,
            createdAt: new Date().toISOString(),
        };
        const updatedCategories = [...categories, newCategory];
        setCategories(updatedCategories);
        await saveCategories(updatedCategories);
        return newCategory;
    };

    const reorderCategories = async (newOrder: Category[]): Promise<void> => {
        const reordered = newOrder.map((cat, index) => ({ ...cat, order: index }));
        setCategories(reordered);
        await saveCategories(reordered);
    };

    const deleteCategory = async (categoryId: string): Promise<void> => {
        const updatedCategories = categories.filter((cat) => cat.id !== categoryId);
        const updatedVideos = videos.filter((vid) => vid.categoryId !== categoryId);

        setCategories(updatedCategories);
        setVideos(updatedVideos);

        await deleteCategoryFromFirebase(categoryId);
        await saveCategories(updatedCategories);
        await saveVideos(updatedVideos);
    };

    const updateCategory = async (categoryId: string, name: string): Promise<void> => {
        const updatedCategories = categories.map((cat) =>
            cat.id === categoryId ? { ...cat, name: name.trim() } : cat
        );
        setCategories(updatedCategories);
        await saveCategories(updatedCategories);
    };

    const addVideo = async (title: string, url: string, categoryId: string, notes?: string, imageUrl?: string): Promise<Video> => {
        const videoId = extractYouTubeId(url);
        if (!videoId) {
            throw new Error("Invalid YouTube URL");
        }

        const categoryVideos = videos.filter((v) => v.categoryId === categoryId);
        const newVideo: Video = {
            id: Date.now().toString(),
            title: title.trim(),
            url,
            videoId,
            categoryId,
            order: categoryVideos.length,
            createdAt: new Date().toISOString(),
            isNoteOnly: false,
            ...(notes && { notes: notes.trim() }),
            ...(imageUrl && { imageUrl: imageUrl.trim() })
        };
        const updatedVideos = [...videos, newVideo];
        setVideos(updatedVideos);
        await saveVideos(updatedVideos);
        return newVideo;
    };

    const addNote = async (title: string, categoryId: string, notes: string, imageUrl?: string): Promise<Video> => {
        const categoryVideos = videos.filter((v) => v.categoryId === categoryId);
        const newNote: Video = {
            id: Date.now().toString(),
            title: title.trim(),
            categoryId,
            order: categoryVideos.length,
            createdAt: new Date().toISOString(),
            notes: notes.trim(),
            isNoteOnly: true,
            ...(imageUrl && { imageUrl: imageUrl.trim() })
        };
        const updatedVideos = [...videos, newNote];
        setVideos(updatedVideos);
        await saveVideos(updatedVideos);
        return newNote;
    };

    const reorderVideos = async (categoryId: string, newOrder: Video[]): Promise<void> => {
        const reordered = newOrder.map((vid, index) => ({ ...vid, order: index }));
        const otherVideos = videos.filter((v) => v.categoryId !== categoryId);
        const allVideos = [...otherVideos, ...reordered];
        setVideos(allVideos);
        await saveVideos(allVideos);
    };

    const deleteVideo = async (videoId: string): Promise<void> => {
        const updatedVideos = videos.filter((vid) => vid.id !== videoId);
        setVideos(updatedVideos);
        await deleteVideoFromFirebase(videoId);
    };

    const updateVideo = async (videoId: string, updates: Partial<Video>): Promise<void> => {
        const updatedVideos = videos.map((vid) => (vid.id === videoId ? { ...vid, ...updates } : vid));
        setVideos(updatedVideos);
        await saveVideos(updatedVideos);
    };

    const addWatchTime = async (videoId: string, seconds: number): Promise<void> => {
        const updatedWatchTime: WatchTime = {
            ...watchTime,
            [videoId]: (watchTime[videoId] || 0) + seconds,
        };
        setWatchTime(updatedWatchTime);
        await saveWatchTime(updatedWatchTime);
    };

    const updateWatchTime = async (newWatchTime: WatchTime): Promise<void> => {
        setWatchTime(newWatchTime);
        await saveWatchTime(newWatchTime);
    };

    const getCategoryVideos = (categoryId: string): Video[] => {
        return videos
            .filter((vid) => vid.categoryId === categoryId)
            .sort((a, b) => {
                if (a.order !== undefined && b.order !== undefined) {
                    return a.order - b.order;
                }
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
    };

    const getCategoryTotalTime = (categoryId: string): number => {
        const categoryVideos = getCategoryVideos(categoryId);
        return categoryVideos.reduce((total, vid) => total + (watchTime[vid.id] || 0), 0);
    };

    const getVideoById = (videoId: string | undefined): Video | undefined => {
        return videos.find((vid) => vid.id === videoId);
    };

    const getCategoryById = (categoryId: string | null | undefined): Category | undefined => {
        if (!categoryId) return undefined;
        return categories.find((cat) => cat.id === categoryId);
    };

    const value: AppContextType = {
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
        addNote,
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
        getCategoryById,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

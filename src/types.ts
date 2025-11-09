export interface Category {
  id: string;
  name: string;
  order: number;
  createdAt: string;
}

export interface Video {
  id: string;
  title: string;
  url?: string; // Optional for notes-only entries
  videoId?: string; // Optional for notes-only entries
  categoryId: string;
  order: number;
  createdAt: string;
  notes?: string;
  imageUrl?: string; // Optional image link for notes
  isNoteOnly?: boolean; // Flag to distinguish notes from videos
}

export interface WatchTime {
  [videoId: string]: number;
}

export interface AppContextType {
  // State
  categories: Category[];
  videos: Video[];
  watchTime: WatchTime;
  workoutSessions: WorkoutSession[];
  isLoading: boolean;

  // Category actions
  addCategory: (name: string) => Promise<Category>;
  deleteCategory: (categoryId: string) => Promise<void>;
  updateCategory: (categoryId: string, name: string) => Promise<void>;
  reorderCategories: (newOrder: Category[]) => Promise<void>;

  // Video actions
  addVideo: (title: string, url: string, categoryId: string, notes?: string, imageUrl?: string) => Promise<Video>;
  addNote: (title: string, categoryId: string, notes: string, imageUrl?: string) => Promise<Video>;
  deleteVideo: (videoId: string) => Promise<void>;
  updateVideo: (videoId: string, updates: Partial<Video>) => Promise<void>;
  reorderVideos: (categoryId: string, newOrder: Video[]) => Promise<void>;

  // Watch time actions
  addWatchTime: (videoId: string, seconds: number) => Promise<void>;
  setWatchTime: (newWatchTime: WatchTime) => Promise<void>;

  // Planning actions
  addWorkoutSession: (session: Omit<WorkoutSession, 'id' | 'createdAt'>) => Promise<WorkoutSession>;
  updateWorkoutSession: (sessionId: string, updates: Partial<WorkoutSession>) => Promise<void>;
  deleteWorkoutSession: (sessionId: string) => Promise<void>;
  getSessionsByDate: (date: string) => WorkoutSession[];

  // Utils
  getCategoryVideos: (categoryId: string) => Video[];
  getCategoryTotalTime: (categoryId: string) => number;
  getVideoById: (videoId: string | undefined) => Video | undefined;
  getCategoryById: (categoryId: string | null | undefined) => Category | undefined;
}

export interface YouTubeVideoSnippet {
  title: string;
}

export interface YouTubeVideoItem {
  snippet: YouTubeVideoSnippet;
}

export interface YouTubeApiResponse {
  items: YouTubeVideoItem[];
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO date string
  time: string; // HH:MM format
  categoryIds: string[]; // Multiple categories for the session
  videoIds?: string[]; // Optional specific videos
  notes?: string;
  completed?: boolean;
  createdAt: string;
}

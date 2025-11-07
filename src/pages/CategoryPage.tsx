import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Video } from '../types';
import VideoCard from '../components/VideoCard';
import AddVideoModal from '../components/AddVideoModal';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/CategoryPage.css';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { getCategoryById, getCategoryVideos, reorderVideos, isLoading } = useApp();
  const [isAddingVideo, setIsAddingVideo] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const category = getCategoryById(categoryId);
  const videos = getCategoryVideos(categoryId || '');

  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;
    const query = searchQuery.toLowerCase();
    return videos.filter(video =>
      video.title.toLowerCase().includes(query) ||
      (video.notes && video.notes.toLowerCase().includes(query))
    );
  }, [videos, searchQuery]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredVideos.findIndex((vid) => vid.id === active.id);
      const newIndex = filteredVideos.findIndex((vid) => vid.id === over.id);
      const newOrder = arrayMove(filteredVideos, oldIndex, newIndex);
      if (categoryId) {
        reorderVideos(categoryId, newOrder);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="category-page">
        <LoadingSpinner size="large" text="Loading videos..." />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="category-page">
        <div className="error-message">
          <h2>Category not found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const handlePlayVideo = (video: Video) => {
    navigate(`/video/${video.id}`);
  };

  return (
    <div className="category-page">
      <div className="category-header">
        <div className="category-title-section">
          <h2>{category.name}</h2>
          <p className="video-count-text">{videos.length} video{videos.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredVideos.length === 0 && searchQuery.trim() ? (
        <div className="no-results">
          <p>No videos found for "{searchQuery}"</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredVideos.map(v => v.id)}
            strategy={rectSortingStrategy}
          >
            <div className="video-grid">
              {filteredVideos.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlay={handlePlayVideo}
                />
              ))}
              {!searchQuery.trim() && (
                <div className="add-video-card" onClick={() => setIsAddingVideo(true)}>
                  <Plus size={48} />
                  <span>Add Video</span>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {isAddingVideo && (
        <AddVideoModal
          isOpen={isAddingVideo}
          onClose={() => setIsAddingVideo(false)}
          preselectedCategoryId={categoryId}
        />
      )}
    </div>
  );
};

export default CategoryPage;

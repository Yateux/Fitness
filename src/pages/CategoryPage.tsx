import { useState } from 'react';
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
import { Plus } from 'lucide-react';
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

  const category = getCategoryById(categoryId);
  const videos = getCategoryVideos(categoryId || '');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = videos.findIndex((vid) => vid.id === active.id);
      const newIndex = videos.findIndex((vid) => vid.id === over.id);
      const newOrder = arrayMove(videos, oldIndex, newIndex);
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
        <h2>{category.name}</h2>
        <p className="video-count-text">{videos.length} video{videos.length !== 1 ? 's' : ''}</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={videos.map(v => v.id)}
          strategy={rectSortingStrategy}
        >
          <div className="video-grid">
            {videos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={handlePlayVideo}
              />
            ))}
            <div className="add-video-card" onClick={() => setIsAddingVideo(true)}>
              <Plus size={48} />
              <span>Add Video</span>
            </div>
          </div>
        </SortableContext>
      </DndContext>

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

import { useNavigate, useParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useApp } from '../context/AppContext';
import VideoCard from '../components/VideoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/CategoryPage.css';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { getCategoryById, getCategoryVideos, reorderVideos, isLoading } = useApp();

  const category = getCategoryById(categoryId);
  const videos = getCategoryVideos(categoryId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = videos.findIndex((vid) => vid.id === active.id);
      const newIndex = videos.findIndex((vid) => vid.id === over.id);
      const newOrder = arrayMove(videos, oldIndex, newIndex);
      reorderVideos(categoryId, newOrder);
    }
  };

  if (isLoading) {
    return (
      <div className="category-page">
        <LoadingSpinner size="large" text="Chargement des vidéos..." />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="category-page">
        <div className="error-message">
          <h2>Catégorie introuvable</h2>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const handlePlayVideo = (video) => {
    navigate(`/video/${video.id}`);
  };

  return (
    <div className="category-page">
      <div className="category-header">
        <h2>{category.name}</h2>
        <p className="video-count-text">{videos.length} vidéo{videos.length !== 1 ? 's' : ''}</p>
      </div>

      {videos.length === 0 ? (
        <p className="empty-state">Aucune vidéo dans cette catégorie</p>
      ) : (
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
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default CategoryPage;

import { useState } from 'react';
import { Play, Clock, Trash2, Edit2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/time';
import { getYouTubeThumbnail } from '../utils/youtube';
import EditVideoModal from './EditVideoModal';
import '../styles/VideoCard.css';

const VideoCard = ({ video, onPlay }) => {
  const { watchTime, deleteVideo } = useApp();
  const [isEditingVideo, setIsEditingVideo] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      deleteVideo(video.id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditingVideo(true);
  };

  return (
    <div ref={setNodeRef} style={style} className="video-card">
      <div className="video-thumbnail">
        <img
          src={getYouTubeThumbnail(video.videoId)}
          alt={video.title}
        />
        <button
          className="play-overlay"
          onClick={() => onPlay(video)}
        >
          <Play size={48} />
        </button>
      </div>
      <div className="video-card-content">
        <div className="video-card-header">
          <h3>{video.title}</h3>
          <div className="video-drag-handle" {...attributes} {...listeners}>
            <GripVertical size={18} />
          </div>
        </div>
        <div className="video-card-footer">
          <span className="time-badge">
            <Clock size={14} />
            {formatTime(watchTime[video.id] || 0)}
          </span>
          <div className="video-actions">
            <button
              className="btn-icon"
              onClick={handleEdit}
              title="Modifier"
            >
              <Edit2 size={16} />
            </button>
            <button
              className="btn-icon btn-danger"
              onClick={handleDelete}
              title="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {isEditingVideo && (
        <EditVideoModal
          video={video}
          onClose={() => setIsEditingVideo(false)}
        />
      )}
    </div>
  );
};

export default VideoCard;

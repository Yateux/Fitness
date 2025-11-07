import { useState, MouseEvent } from 'react';
import { Play, Clock, Trash2, Edit2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/time';
import { getYouTubeThumbnail } from '../utils/youtube';
import { Video } from '../types';
import EditVideoModal from './EditVideoModal';
import '../styles/VideoCard.css';

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
}

const VideoCard = ({ video, onPlay }: VideoCardProps) => {
  const { watchTime, deleteVideo } = useApp();
  const [isEditingVideo, setIsEditingVideo] = useState<boolean>(false);

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

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this video?')) {
      deleteVideo(video.id);
    }
  };

  const handleEdit = (e: MouseEvent<HTMLButtonElement>) => {
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
        {video.notes && (
          <div className="video-notes">
            {video.notes}
          </div>
        )}
        <div className="video-card-footer">
          <span className="time-badge">
            <Clock size={14} />
            {formatTime(watchTime[video.id] || 0)}
          </span>
          <div className="video-actions">
            <button
              className="btn-icon"
              onClick={handleEdit}
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              className="btn-icon btn-danger"
              onClick={handleDelete}
              title="Delete"
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

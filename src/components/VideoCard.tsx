import { useState, MouseEvent } from 'react';
import { Play, Clock, Trash2, Edit2, GripVertical, FileText } from 'lucide-react';
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
    <div ref={setNodeRef} style={style} className={`video-card ${video.isNoteOnly ? 'note-card' : ''}`}>
      <div className="video-thumbnail">
        {video.isNoteOnly ? (
          <div className="note-thumbnail">
            {video.imageUrl ? (
              <img
                src={video.imageUrl}
                alt={video.title}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.innerHTML = '<div class="note-icon-fallback"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg></div>';
                  }
                }}
              />
            ) : (
              <div className="note-icon-fallback">
                <FileText size={48} />
              </div>
            )}
            <div className="note-badge">
              <FileText size={14} />
              <span>Note</span>
            </div>
          </div>
        ) : (
          <img
            src={getYouTubeThumbnail(video.videoId)}
            alt={video.title}
          />
        )}
        <button
          className="play-overlay"
          onClick={() => onPlay(video)}
        >
          {video.isNoteOnly ? <FileText size={48} /> : <Play size={48} />}
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
            {video.notes.length > 100 ? `${video.notes.substring(0, 100)}...` : video.notes}
          </div>
        )}
        <div className="video-card-footer">
          {!video.isNoteOnly && (
            <span className="time-badge">
              <Clock size={14} />
              {formatTime(watchTime[video.id] || 0)}
            </span>
          )}
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

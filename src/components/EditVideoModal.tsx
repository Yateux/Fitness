import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { extractYouTubeId } from '../utils/youtube';
import { Video } from '../types';
import YouTubePreview from './YouTubePreview';
import '../styles/Modal.css';

interface EditVideoModalProps {
  video: Video | null;
  onClose: () => void;
}

const EditVideoModal = ({ video, onClose }: EditVideoModalProps) => {
  const { updateVideo } = useApp();
  const [title, setTitle] = useState<string>(video?.title || '');
  const [url, setUrl] = useState<string>(video?.url || '');
  const [notes, setNotes] = useState<string>(video?.notes || '');
  const [error, setError] = useState<string>('');
  const [currentVideoId, setCurrentVideoId] = useState<string>(video?.videoId || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setUrl(video.url);
      setNotes(video.notes || '');
      setCurrentVideoId(video.videoId);
    }
  }, [video]);

  useEffect(() => {
    const videoId = extractYouTubeId(url);
    setCurrentVideoId(videoId || '');
  }, [url]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!url.trim()) {
      setError('YouTube URL is required');
      return;
    }

    const videoId = extractYouTubeId(url);
    if (!videoId) {
      setError('Invalid YouTube URL. Use a URL like: https://www.youtube.com/watch?v=...');
      return;
    }

    if (!video) return;

    setIsSubmitting(true);
    try {
      await updateVideo(video.id, {
        title: title.trim(),
        url: url.trim(),
        videoId,
        notes: notes.trim()
      });
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!video) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Video</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <YouTubePreview videoId={currentVideoId} title={title} />

          <div className="form-group">
            <label htmlFor="video-title">Video title</label>
            <input
              id="video-title"
              type="text"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Ex: Arm Workout"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="video-url">YouTube URL</label>
            <input
              id="video-url"
              type="url"
              value={url}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <small className="form-hint">
              Paste the full YouTube video URL
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="video-notes">Notes (Optional)</label>
            <textarea
              id="video-notes"
              value={notes}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              placeholder="Ex: 3 sets x 12 reps, 20kg dumbbell..."
              rows={4}
            />
            <small className="form-hint">
              Track sets, reps, weights, or any other notes
            </small>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditVideoModal;

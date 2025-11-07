import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { extractYouTubeId } from '../utils/youtube';
import YouTubePreview from './YouTubePreview';
import '../styles/Modal.css';

const EditVideoModal = ({ video, onClose }) => {
  const { updateVideo } = useApp();
  const [title, setTitle] = useState(video?.title || '');
  const [url, setUrl] = useState(video?.url || '');
  const [error, setError] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState(video?.videoId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setUrl(video.url);
      setCurrentVideoId(video.videoId);
    }
  }, [video]);

  // Update preview in real-time as user types URL
  useEffect(() => {
    const videoId = extractYouTubeId(url);
    setCurrentVideoId(videoId || '');
  }, [url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }

    if (!url.trim()) {
      setError('L\'URL YouTube est requise');
      return;
    }

    const videoId = extractYouTubeId(url);
    if (!videoId) {
      setError('URL YouTube invalide. Utilisez une URL comme: https://www.youtube.com/watch?v=...');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateVideo(video.id, {
        title: title.trim(),
        url: url.trim(),
        videoId
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!video) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Modifier la vidéo</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <YouTubePreview videoId={currentVideoId} title={title} />

          <div className="form-group">
            <label htmlFor="video-title">Titre de la vidéo</label>
            <input
              id="video-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Entraînement des bras"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="video-url">URL YouTube</label>
            <input
              id="video-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <small className="form-hint">
              Collez l'URL complète de la vidéo YouTube
            </small>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVideoModal;

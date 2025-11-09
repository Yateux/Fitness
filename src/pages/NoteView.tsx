import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/NoteView.css';

const NoteView = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { getVideoById, isLoading } = useApp();

  const note = getVideoById(videoId);

  if (isLoading) {
    return (
      <div className="note-view-page">
        <LoadingSpinner size="large" text="Loading note..." />
      </div>
    );
  }

  if (!note || !note.isNoteOnly) {
    return (
      <div className="note-view-page">
        <div className="note-error">
          <h2>Note not found</h2>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="note-view-page">
      <div className="note-header">
        <button className="btn-icon" onClick={() => navigate(-1)} title="Back">
          <ArrowLeft size={24} />
        </button>
        <h1>{note.title}</h1>
      </div>

      <div className="note-metadata">
        <div className="note-meta-item">
          <FileText size={16} />
          <span>Session Note</span>
        </div>
        <div className="note-meta-item">
          <Calendar size={16} />
          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {note.imageUrl && (
        <div className="note-image-container">
          <img
            src={note.imageUrl}
            alt={note.title}
            className="note-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="note-content">
        <h3>Notes</h3>
        <div className="note-text">
          {note.notes?.split('\n').map((line, index) => (
            <p key={index}>{line || '\u00A0'}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteView;

import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { extractYouTubeId, fetchYouTubeTitle } from '../utils/youtube';
import Modal from './Modal';
import YouTubePreview from './YouTubePreview';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCategoryId?: string;
}

interface FormData {
  title: string;
  url: string;
  categoryId: string;
  notes: string;
  imageUrl: string;
}

type EntryType = 'video' | 'note';

const AddVideoModal = ({ isOpen, onClose, preselectedCategoryId = '' }: AddVideoModalProps) => {
  const [entryType, setEntryType] = useState<EntryType>('video');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    url: '',
    categoryId: preselectedCategoryId,
    notes: '',
    imageUrl: ''
  });
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { categories, addVideo, addNote } = useApp();

  useEffect(() => {
    if (preselectedCategoryId) {
      setFormData(prev => ({ ...prev, categoryId: preselectedCategoryId }));
    }
  }, [preselectedCategoryId]);

  useEffect(() => {
    const videoId = extractYouTubeId(formData.url);
    setCurrentVideoId(videoId || '');

    if (videoId && !formData.title.trim()) {
      fetchYouTubeTitle(videoId).then(title => {
        if (title) {
          setFormData(prev => ({ ...prev, title }));
        }
      });
    }
  }, [formData.url, formData.title]);

  const handleSubmit = async () => {
    if (entryType === 'video') {
      if (formData.title.trim() && formData.url.trim() && formData.categoryId) {
        setIsSubmitting(true);
        try {
          await addVideo(formData.title, formData.url, formData.categoryId, formData.notes, formData.imageUrl);
          setFormData({ title: '', url: '', categoryId: '', notes: '', imageUrl: '' });
          onClose();
        } catch (error) {
          if (error instanceof Error) {
            alert(error.message);
          }
        } finally {
          setIsSubmitting(false);
        }
      }
    } else {
      if (formData.title.trim() && formData.notes.trim() && formData.categoryId) {
        setIsSubmitting(true);
        try {
          await addNote(formData.title, formData.categoryId, formData.notes, formData.imageUrl);
          setFormData({ title: '', url: '', categoryId: '', notes: '', imageUrl: '' });
          onClose();
        } catch (error) {
          if (error instanceof Error) {
            alert(error.message);
          }
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={entryType === 'video' ? 'Add Video' : 'Add Note'}>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button
          className={`btn ${entryType === 'video' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setEntryType('video')}
          type="button"
          style={{ flex: 1 }}
        >
          Video
        </button>
        <button
          className={`btn ${entryType === 'note' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setEntryType('note')}
          type="button"
          style={{ flex: 1 }}
        >
          Note
        </button>
      </div>

      {entryType === 'video' && (
        <YouTubePreview videoId={currentVideoId} title={formData.title} />
      )}

      <input
        type="text"
        placeholder={entryType === 'video' ? 'Video title' : 'Note title'}
        value={formData.title}
        onChange={e => handleChange('title', e.target.value)}
      />

      {entryType === 'video' && (
        <input
          type="text"
          placeholder="YouTube URL"
          value={formData.url}
          onChange={e => handleChange('url', e.target.value)}
        />
      )}

      <select
        value={formData.categoryId}
        onChange={e => handleChange('categoryId', e.target.value)}
      >
        <option value="">Select a category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <textarea
        placeholder={entryType === 'video'
          ? 'Notes (Optional): Ex: 3 sets x 12 reps, 20kg dumbbell...'
          : 'Session notes: Ex: 3 sets x 12 reps, rest 90s, felt strong today...'
        }
        value={formData.notes}
        onChange={e => handleChange('notes', e.target.value)}
        rows={entryType === 'note' ? 5 : 3}
        required={entryType === 'note'}
      />

      <input
        type="text"
        placeholder="Image URL (Optional)"
        value={formData.imageUrl}
        onChange={e => handleChange('imageUrl', e.target.value)}
      />

      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </div>
    </Modal>
  );
};

export default AddVideoModal;

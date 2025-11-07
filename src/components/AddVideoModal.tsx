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
}

const AddVideoModal = ({ isOpen, onClose, preselectedCategoryId = '' }: AddVideoModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    url: '',
    categoryId: preselectedCategoryId,
    notes: ''
  });
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { categories, addVideo } = useApp();

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
    if (formData.title.trim() && formData.url.trim() && formData.categoryId) {
      setIsSubmitting(true);
      try {
        await addVideo(formData.title, formData.url, formData.categoryId, formData.notes);
        setFormData({ title: '', url: '', categoryId: '', notes: '' });
        onClose();
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Video">
      <YouTubePreview videoId={currentVideoId} title={formData.title} />

      <input
        type="text"
        placeholder="Video title"
        value={formData.title}
        onChange={e => handleChange('title', e.target.value)}
      />
      <input
        type="text"
        placeholder="YouTube URL"
        value={formData.url}
        onChange={e => handleChange('url', e.target.value)}
      />
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
        placeholder="Notes (Optional): Ex: 3 sets x 12 reps, 20kg dumbbell..."
        value={formData.notes}
        onChange={e => handleChange('notes', e.target.value)}
        rows={3}
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

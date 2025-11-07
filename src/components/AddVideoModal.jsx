import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { extractYouTubeId } from '../utils/youtube';
import Modal from './Modal';
import YouTubePreview from './YouTubePreview';

const AddVideoModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    categoryId: ''
  });
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { categories, addVideo } = useApp();

  // Update preview in real-time as user types URL
  useEffect(() => {
    const videoId = extractYouTubeId(formData.url);
    setCurrentVideoId(videoId || '');
  }, [formData.url]);

  const handleSubmit = async () => {
    if (formData.title.trim() && formData.url.trim() && formData.categoryId) {
      setIsSubmitting(true);
      try {
        await addVideo(formData.title, formData.url, formData.categoryId);
        setFormData({ title: '', url: '', categoryId: '' });
        onClose();
      } catch (error) {
        alert(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter une vidéo">
      <YouTubePreview videoId={currentVideoId} title={formData.title} />

      <input
        type="text"
        placeholder="Titre de la vidéo"
        value={formData.title}
        onChange={e => handleChange('title', e.target.value)}
      />
      <input
        type="text"
        placeholder="URL YouTube"
        value={formData.url}
        onChange={e => handleChange('url', e.target.value)}
      />
      <select
        value={formData.categoryId}
        onChange={e => handleChange('categoryId', e.target.value)}
      >
        <option value="">Sélectionner une catégorie</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
          Annuler
        </button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
        </button>
      </div>
    </Modal>
  );
};

export default AddVideoModal;

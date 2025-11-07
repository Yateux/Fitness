import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import '../styles/Modal.css';

const EditCategoryModal = ({ category, onClose }) => {
  const { updateCategory } = useApp();
  const [name, setName] = useState(category?.name || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Le nom de la catégorie est requis');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateCategory(category.id, name);
      onClose();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!category) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Modifier la catégorie</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category-name">Nom de la catégorie</label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Musculation, Cardio, Yoga..."
              autoFocus
            />
            {error && <p className="error-message">{error}</p>}
          </div>

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

export default EditCategoryModal;

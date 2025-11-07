import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from './Modal';

const AddCategoryModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addCategory } = useApp();

  const handleSubmit = async () => {
    if (name.trim()) {
      setIsSubmitting(true);
      try {
        await addCategory(name);
        setName('');
        onClose();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouvelle catégorie">
      <input
        type="text"
        placeholder="Nom de la catégorie"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
          Annuler
        </button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Création...' : 'Créer'}
        </button>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;

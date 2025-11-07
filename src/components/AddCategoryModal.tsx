import { useState, KeyboardEvent } from 'react';
import { useApp } from '../context/AppContext';
import Modal from './Modal';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCategoryModal = ({ isOpen, onClose }: AddCategoryModalProps) => {
  const [name, setName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Category">
      <input
        type="text"
        placeholder="Category name"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create'}
        </button>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;

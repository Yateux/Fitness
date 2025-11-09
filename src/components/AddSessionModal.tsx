import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from './Modal';

interface AddSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDate?: string;
}

const AddSessionModal = ({ isOpen, onClose, preselectedDate = '' }: AddSessionModalProps) => {
  const { categories, addWorkoutSession } = useApp();
  const [date, setDate] = useState<string>(preselectedDate || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('09:00');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const setCurrentDateTime = () => {
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    setTime(now.toTimeString().slice(0, 5));
  };

  const handleSubmit = async () => {
    if (selectedCategories.length === 0) {
      alert('Select at least one category');
      return;
    }

    setIsSubmitting(true);
    try {
      const sessionData: any = {
        date,
        time,
        categoryIds: selectedCategories,
        completed: false,
      };

      if (notes.trim()) {
        sessionData.notes = notes.trim();
      }

      await addWorkoutSession(sessionData);
      setDate(new Date().toISOString().split('T')[0]);
      setTime('09:00');
      setSelectedCategories([]);
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Error adding session:', error);
      alert('Error adding session');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule a Session">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={setCurrentDateTime}
        style={{ width: '100%', marginBottom: '1rem' }}
      >
        Starting now!
      </button>

      <div className="form-group">
        <label htmlFor="session-date">Date</label>
        <input
          id="session-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="session-time">Time</label>
        <input
          id="session-time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Categories (select one or more)</label>
        <div className="category-select-grid">
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              className={`category-select-btn ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
              onClick={() => toggleCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        {categories.length === 0 && (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            No categories available. Create one first.
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="session-notes">Notes (optional)</label>
        <textarea
          id="session-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="E.g., Goal: improve strength, focus on technique..."
          rows={3}
        />
      </div>

      <div className="modal-actions">
        <button
          className="btn btn-secondary"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isSubmitting || selectedCategories.length === 0}
        >
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </div>
    </Modal>
  );
};

export default AddSessionModal;

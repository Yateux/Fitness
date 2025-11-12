import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WorkoutSession } from '../types';
import Modal from './Modal';

interface EditSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: WorkoutSession;
}

const EditSessionModal = ({ isOpen, onClose, session }: EditSessionModalProps) => {
  const { categories, updateWorkoutSession } = useApp();
  const [date, setDate] = useState<string>(session.date);
  const [time, setTime] = useState<string>(session.time);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(session.categoryIds);
  const [notes, setNotes] = useState<string>(session.notes || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setDate(session.date);
    setTime(session.time);
    setSelectedCategories(session.categoryIds);
    setNotes(session.notes || '');
  }, [session]);

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
      const updates: any = {
        date,
        time,
        categoryIds: selectedCategories,
      };

      if (notes.trim()) {
        updates.notes = notes.trim();
      } else {
        updates.notes = '';
      }

      await updateWorkoutSession(session.id, updates);
      onClose();
    } catch (error) {
      console.error('Error updating session:', error);
      alert('Error updating session');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Session">
      <button
        type="button"
        className="btn btn-secondary quick-start-btn"
        onClick={setCurrentDateTime}
        style={{ width: '100%', marginBottom: '1rem' }}
      >
        Starting now!
      </button>

      <div className="form-row">
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
          {isSubmitting ? 'Updating...' : 'Update'}
        </button>
      </div>
    </Modal>
  );
};

export default EditSessionModal;

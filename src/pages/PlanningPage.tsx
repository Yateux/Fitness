import { useState, useMemo } from 'react';
import { Calendar, Plus, Clock, CheckCircle, Circle, Trash2, Edit2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WorkoutSession } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import AddSessionModal from '../components/AddSessionModal';
import EditSessionModal from '../components/EditSessionModal';
import '../styles/PlanningPage.css';

const PlanningPage = () => {
  const { workoutSessions, isLoading, deleteWorkoutSession, updateWorkoutSession, getCategoryById } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingSession, setEditingSession] = useState<WorkoutSession | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const weekDates = useMemo(() => {
    const current = new Date(selectedDate);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));

    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [selectedDate]);

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  };

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getSessionsForDate = (date: Date) => {
    const dateStr = getDateString(date);
    return workoutSessions.filter(session => session.date === dateStr);
  };

  const toggleComplete = async (session: WorkoutSession) => {
    await updateWorkoutSession(session.id, { completed: !session.completed });
  };

  const handleDelete = async (sessionId: string) => {
    if (window.confirm('Delete this session?')) {
      await deleteWorkoutSession(sessionId);
    }
  };

  const nextPeriod = () => {
    const current = new Date(selectedDate);
    const daysToAdd = viewMode === 'day' ? 1 : 7;
    current.setDate(current.getDate() + daysToAdd);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const prevPeriod = () => {
    const current = new Date(selectedDate);
    const daysToSubtract = viewMode === 'day' ? 1 : 7;
    current.setDate(current.getDate() - daysToSubtract);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  if (isLoading) {
    return (
      <div className="planning-page">
        <LoadingSpinner size="large" text="Loading schedule..." />
      </div>
    );
  }

  return (
    <div className="planning-page">
      <div className="planning-header">
        <div className="planning-title">
          <Calendar size={28} />
          <h2>Training Schedule</h2>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          <span>Add session</span>
        </button>
      </div>

      <div className="planning-controls">
        <div className="week-navigation">
          <button className="btn btn-secondary" onClick={prevPeriod}>
            &larr; {viewMode === 'day' ? 'Previous day' : 'Previous week'}
          </button>
          <button className="btn btn-secondary" onClick={goToToday}>
            Today
          </button>
          <button className="btn btn-secondary" onClick={nextPeriod}>
            {viewMode === 'day' ? 'Next day' : 'Next week'} &rarr;
          </button>
        </div>

        <div className="view-mode-toggle">
          <button
            className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
            onClick={() => setViewMode('week')}
          >
            Week
          </button>
          <button
            className={`view-btn ${viewMode === 'day' ? 'active' : ''}`}
            onClick={() => setViewMode('day')}
          >
            Day
          </button>
        </div>
      </div>

      {viewMode === 'week' ? (
        <div className="week-view">
          {weekDates.map((date) => {
            const sessions = getSessionsForDate(date);
            const isToday = getDateString(date) === new Date().toISOString().split('T')[0];

            return (
              <div key={getDateString(date)} className={`day-column ${isToday ? 'today' : ''}`}>
                <div className="day-header">
                  <div className="day-name">{getDayName(date)}</div>
                  <div className="day-date">{date.getDate()}</div>
                </div>

                <div className="day-sessions">
                  {sessions.length === 0 ? (
                    <div className="no-sessions">No session</div>
                  ) : (
                    sessions.map((session) => (
                      <div key={session.id} className={`session-card ${session.completed ? 'completed' : ''}`}>
                        <div className="session-time">
                          <Clock size={14} />
                          {session.time}
                        </div>
                        <div className="session-categories">
                          {session.categoryIds.map(catId => {
                            const cat = getCategoryById(catId);
                            return cat ? <span key={catId} className="category-tag">{cat.name}</span> : null;
                          })}
                        </div>
                        {session.notes && (
                          <div className="session-notes">{session.notes}</div>
                        )}
                        <div className="session-actions">
                          <button
                            className="btn-icon-small"
                            onClick={() => toggleComplete(session)}
                            title={session.completed ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {session.completed ? <CheckCircle size={16} /> : <Circle size={16} />}
                          </button>
                          <button
                            className="btn-icon-small"
                            onClick={() => setEditingSession(session)}
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="btn-icon-small btn-danger"
                            onClick={() => handleDelete(session.id)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="day-view">
          <div className="selected-day-header">
            <h3>{new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h3>
          </div>
          <div className="day-view-sessions">
            {getSessionsForDate(new Date(selectedDate)).map((session) => (
              <div key={session.id} className={`session-card-large ${session.completed ? 'completed' : ''}`}>
                <div className="session-card-header">
                  <div className="session-time-large">
                    <Clock size={20} />
                    {session.time}
                  </div>
                  <div className="session-actions">
                    <button
                      className="btn-icon"
                      onClick={() => toggleComplete(session)}
                      title={session.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {session.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => setEditingSession(session)}
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDelete(session.id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="session-categories-large">
                  {session.categoryIds.map(catId => {
                    const cat = getCategoryById(catId);
                    return cat ? <span key={catId} className="category-tag-large">{cat.name}</span> : null;
                  })}
                </div>
                {session.notes && (
                  <div className="session-notes-large">{session.notes}</div>
                )}
              </div>
            ))}
            {getSessionsForDate(new Date(selectedDate)).length === 0 && (
              <div className="no-sessions-large">No sessions scheduled for this day</div>
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <AddSessionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          preselectedDate={selectedDate}
        />
      )}

      {editingSession && (
        <EditSessionModal
          isOpen={!!editingSession}
          onClose={() => setEditingSession(null)}
          session={editingSession}
        />
      )}
    </div>
  );
};

export default PlanningPage;

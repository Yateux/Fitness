import { useMemo } from 'react';
import { TrendingUp, Target, Calendar as CalendarIcon, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getSmartSuggestions, getWeeklySummary } from '../utils/smartSuggestions';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/StatsPage.css';

const StatsPage = () => {
  const { workoutSessions, categories, isLoading } = useApp();

  const stats = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const thisWeekSessions = workoutSessions.filter(s => {
      const sessionDate = new Date(s.date);
      return sessionDate >= weekStart && sessionDate <= now;
    });

    const thisMonthSessions = workoutSessions.filter(s => {
      const sessionDate = new Date(s.date);
      return sessionDate >= monthStart && sessionDate <= now;
    });

    const completedThisWeek = thisWeekSessions.filter(s => s.completed).length;
    const completedThisMonth = thisMonthSessions.filter(s => s.completed).length;

    const categoryStats: Record<string, { total: number; completed: number }> = {};
    workoutSessions.forEach(session => {
      session.categoryIds.forEach(catId => {
        if (!categoryStats[catId]) {
          categoryStats[catId] = { total: 0, completed: 0 };
        }
        categoryStats[catId].total++;
        if (session.completed) {
          categoryStats[catId].completed++;
        }
      });
    });

    const currentStreak = calculateStreak(workoutSessions);

    return {
      thisWeek: { completed: completedThisWeek, total: thisWeekSessions.length },
      thisMonth: { completed: completedThisMonth, total: thisMonthSessions.length },
      categoryStats,
      currentStreak,
      totalCompleted: workoutSessions.filter(s => s.completed).length
    };
  }, [workoutSessions]);

  const suggestions = useMemo(() => {
    return getSmartSuggestions(workoutSessions, categories);
  }, [workoutSessions, categories]);

  const weeklySummary = useMemo(() => {
    return getWeeklySummary(workoutSessions, categories);
  }, [workoutSessions, categories]);

  if (isLoading) {
    return (
      <div className="stats-page">
        <LoadingSpinner size="large" text="Loading stats..." />
      </div>
    );
  }

  return (
    <div className="stats-page">
      <div className="stats-header">
        <TrendingUp size={28} />
        <h2>Performance & Stats</h2>
      </div>

      <div className="weekly-summary-card">
        <h3>📊 Weekly Summary</h3>
        <p>{weeklySummary}</p>
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions-section">
          <h3>💡 Smart Suggestions</h3>
          <div className="suggestions-grid">
            {suggestions.map((suggestion, index) => (
              <div key={index} className={`suggestion-card ${suggestion.type}`}>
                <span className="suggestion-icon">{suggestion.icon}</span>
                <p>{suggestion.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <CalendarIcon size={24} />
          </div>
          <div className="stat-content">
            <h3>This Week</h3>
            <p className="stat-value">{stats.thisWeek.completed}/{stats.thisWeek.total}</p>
            <p className="stat-label">
              {stats.thisWeek.total > 0
                ? `${Math.round((stats.thisWeek.completed / stats.thisWeek.total) * 100)}% completion`
                : 'No sessions planned'}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <h3>This Month</h3>
            <p className="stat-value">{stats.thisMonth.completed}/{stats.thisMonth.total}</p>
            <p className="stat-label">
              {stats.thisMonth.total > 0
                ? `${Math.round((stats.thisMonth.completed / stats.thisMonth.total) * 100)}% completion`
                : 'No sessions planned'}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Completed</h3>
            <p className="stat-value">{stats.totalCompleted}</p>
            <p className="stat-label">workouts finished</p>
          </div>
        </div>

        <div className="stat-card streak-card">
          <div className="stat-icon">
            <span className="streak-emoji">🔥</span>
          </div>
          <div className="stat-content">
            <h3>Current Streak</h3>
            <p className="stat-value">{stats.currentStreak}</p>
            <p className="stat-label">days in a row</p>
          </div>
        </div>
      </div>

      {Object.keys(stats.categoryStats).length > 0 && (
        <div className="category-breakdown">
          <h3>📈 Category Breakdown</h3>
          <div className="category-stats-grid">
            {Object.entries(stats.categoryStats)
              .sort(([, a], [, b]) => b.completed - a.completed)
              .map(([catId, data]) => {
                const category = categories.find(c => c.id === catId);
                if (!category) return null;

                const percentage = data.total > 0
                  ? Math.round((data.completed / data.total) * 100)
                  : 0;

                return (
                  <div key={catId} className="category-stat-card">
                    <div className="category-stat-header">
                      <h4>{category.name}</h4>
                      <span className="category-stat-percentage">{percentage}%</span>
                    </div>
                    <div className="category-stat-bar">
                      <div
                        className="category-stat-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="category-stat-label">
                      {data.completed} / {data.total} sessions
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

function calculateStreak(sessions: WorkoutSession[]): number {
  const completedSessions = sessions
    .filter(s => s.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (completedSessions.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentDate = new Date(today);
  const sessionDates = new Set(
    completedSessions.map(s => new Date(s.date).toDateString())
  );

  while (sessionDates.has(currentDate.toDateString())) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

export default StatsPage;

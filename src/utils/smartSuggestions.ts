import { WorkoutSession, Category } from '../types';

export interface Suggestion {
  type: 'warning' | 'success' | 'info' | 'motivation';
  message: string;
  icon: string;
}

export const getSmartSuggestions = (
  sessions: WorkoutSession[],
  categories: Category[]
): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  const now = new Date();

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);

  const thisWeekSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate >= weekStart && sessionDate <= now;
  });

  const completedThisWeek = thisWeekSessions.filter(s => s.completed);

  const categoryCount: Record<string, number> = {};
  completedThisWeek.forEach(session => {
    session.categoryIds.forEach(catId => {
      categoryCount[catId] = (categoryCount[catId] || 0) + 1;
    });
  });

  const neglectedCategories = categories.filter(cat => !categoryCount[cat.id]);
  if (neglectedCategories.length > 0) {
    const catNames = neglectedCategories.slice(0, 2).map(c => c.name).join(', ');
    suggestions.push({
      type: 'info',
      message: `You haven't trained ${catNames} this week yet 💪`,
      icon: '📋'
    });
  }

  if (sessions.length > 0) {
    const lastSession = [...sessions]
      .filter(s => s.completed && new Date(s.date) <= now)
      .sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime())[0];

    if (lastSession) {
      const daysSinceLastSession = Math.floor((now.getTime() - new Date(lastSession.date).getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceLastSession >= 4) {
        suggestions.push({
          type: 'warning',
          message: `It's been ${daysSinceLastSession} days since your last workout! Time to get back on track 🔥`,
          icon: '⚠️'
        });
      } else if (daysSinceLastSession === 0) {
        suggestions.push({
          type: 'success',
          message: `Great! You trained today. Keep the momentum going! 🎯`,
          icon: '✅'
        });
      }
    }
  }

  const completionRate = thisWeekSessions.length > 0
    ? Math.round((completedThisWeek.length / thisWeekSessions.length) * 100)
    : 0;

  if (completionRate >= 80 && thisWeekSessions.length >= 3) {
    suggestions.push({
      type: 'success',
      message: `${completionRate}% completion rate this week! You're crushing it! 🏆`,
      icon: '🔥'
    });
  } else if (completionRate < 50 && thisWeekSessions.length >= 2) {
    suggestions.push({
      type: 'warning',
      message: `Only ${completionRate}% completion rate. Let's improve that! 💪`,
      icon: '📊'
    });
  }

  const sameCategories = completedThisWeek.slice(-3);
  if (sameCategories.length >= 3) {
    const lastThreeCats = sameCategories.map(s => s.categoryIds.sort().join(','));
    if (lastThreeCats[0] === lastThreeCats[1] && lastThreeCats[1] === lastThreeCats[2]) {
      suggestions.push({
        type: 'info',
        message: `You've done the same workout 3 times in a row. Try mixing it up! 🔄`,
        icon: '💡'
      });
    }
  }

  const upcomingToday = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString() && !s.completed;
  });

  if (upcomingToday.length > 0) {
    suggestions.push({
      type: 'motivation',
      message: `You have ${upcomingToday.length} session${upcomingToday.length > 1 ? 's' : ''} planned for today! Let's do this! 💪`,
      icon: '🎯'
    });
  }

  return suggestions;
};

export const getWeeklySummary = (
  sessions: WorkoutSession[],
  categories: Category[]
): string => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);

  const thisWeekSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate >= weekStart && sessionDate <= now;
  });

  const completed = thisWeekSessions.filter(s => s.completed).length;
  const total = thisWeekSessions.length;

  if (total === 0) {
    return "No sessions planned this week. Time to create a schedule! 📅";
  }

  const categoryCount: Record<string, number> = {};
  thisWeekSessions.filter(s => s.completed).forEach(session => {
    session.categoryIds.forEach(catId => {
      categoryCount[catId] = (categoryCount[catId] || 0) + 1;
    });
  });

  const topCategories = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([catId]) => {
      const cat = categories.find(c => c.id === catId);
      return cat ? cat.name : '';
    })
    .filter(Boolean);

  const focusText = topCategories.length > 0
    ? ` Main focus: ${topCategories.join(' & ')}.`
    : '';

  const completionRate = Math.round((completed / total) * 100);

  return `This week: ${completed}/${total} sessions completed (${completionRate}%).${focusText}`;
};

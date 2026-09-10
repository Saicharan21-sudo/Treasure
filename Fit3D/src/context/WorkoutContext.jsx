import { createContext, useContext, useState, useEffect } from 'react';

const WorkoutContext = createContext(null);
const STORAGE_KEY = 'fit3d_workouts';

export function WorkoutProvider({ children }) {
  const [workouts, setWorkouts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  }, [workouts]);

  const logWorkout = (workout) => {
    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...workout,
      // workout shape: { planName, exercises: [{ name, sets: [{ weight, reps }] }], duration, totalVolume }
    };
    setWorkouts(prev => [entry, ...prev]);
    return entry;
  };

  const getStreak = () => {
    if (workouts.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i <= 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasWorkout = workouts.some(w => w.date.split('T')[0] === dateStr);
      if (hasWorkout) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  };

  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = new Array(7).fill(0);
    const today = new Date();

    workouts.forEach(w => {
      const wDate = new Date(w.date);
      const diffDays = Math.floor((today - wDate) / (1000 * 60 * 60 * 24));
      if (diffDays < 7 && diffDays >= 0) {
        const dayIndex = wDate.getDay();
        data[dayIndex] += w.totalVolume || w.exercises?.reduce((sum, ex) =>
          sum + ex.sets.reduce((s, set) => s + (set.weight || 0) * (set.reps || 0), 0), 0) || 50;
      }
    });
    return { labels: days, data };
  };

  const getMonthlyData = () => {
    const data = new Array(12).fill(0);
    const today = new Date();

    workouts.forEach(w => {
      const wDate = new Date(w.date);
      const diffWeeks = Math.floor((today - wDate) / (1000 * 60 * 60 * 24 * 7));
      if (diffWeeks < 12 && diffWeeks >= 0) {
        data[11 - diffWeeks] += 1;
      }
    });
    return data;
  };

  const getStats = () => {
    const now = new Date();
    const thisMonth = workouts.filter(w => {
      const d = new Date(w.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const totalCalories = thisMonth.reduce((sum, w) => sum + (w.calories || 0), 0);
    const totalTime = thisMonth.reduce((sum, w) => sum + (w.duration || 0), 0);
    const totalVolume = thisMonth.reduce((sum, w) => sum + (w.totalVolume || 0), 0);

    return {
      workoutsThisMonth: thisMonth.length,
      caloriesBurned: totalCalories || thisMonth.length * 350,
      totalTimeMinutes: totalTime || thisMonth.length * 45,
      totalVolume,
      streak: getStreak(),
    };
  };

  const getPersonalRecords = () => {
    const records = {};
    workouts.forEach(w => {
      w.exercises?.forEach(ex => {
        ex.sets?.forEach(set => {
          const key = ex.name;
          if (!records[key] || set.weight > records[key].weight) {
            records[key] = { weight: set.weight, reps: set.reps, date: w.date };
          }
        });
      });
    });
    return records;
  };

  const getRecentWorkouts = (limit = 5) => {
    return workouts.slice(0, limit);
  };

  return (
    <WorkoutContext.Provider value={{
      workouts, logWorkout, getStreak, getWeeklyData, getMonthlyData,
      getStats, getPersonalRecords, getRecentWorkouts,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkouts() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkouts must be used within WorkoutProvider');
  return ctx;
}

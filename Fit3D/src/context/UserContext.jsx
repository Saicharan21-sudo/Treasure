import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

const DEFAULT_USER = null;
const STORAGE_KEY = 'fit3d_user';

const LEVEL_THRESHOLDS = [
  { level: 1, name: 'Beginner', minXp: 0 },
  { level: 2, name: 'Beginner', minXp: 100 },
  { level: 3, name: 'Beginner', minXp: 250 },
  { level: 4, name: 'Intermediate', minXp: 500 },
  { level: 5, name: 'Intermediate', minXp: 800 },
  { level: 6, name: 'Intermediate', minXp: 1200 },
  { level: 7, name: 'Advanced', minXp: 1800 },
  { level: 8, name: 'Advanced', minXp: 2500 },
  { level: 9, name: 'Advanced', minXp: 3500 },
  { level: 10, name: 'Elite', minXp: 5000 },
];

function getLevelInfo(xp) {
  let current = LEVEL_THRESHOLDS[0];
  let next = LEVEL_THRESHOLDS[1];
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].minXp) {
      current = LEVEL_THRESHOLDS[i];
      next = LEVEL_THRESHOLDS[i + 1] || { ...current, minXp: current.minXp + 1000 };
      break;
    }
  }
  return {
    level: current.level,
    name: current.name,
    currentXp: xp - current.minXp,
    xpForNext: next.minXp - current.minXp,
    totalXp: xp,
  };
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_USER;
    } catch { return DEFAULT_USER; }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const signup = (data) => {
    const newUser = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      password: data.password, // In real app, hash this
      weight: data.weight || null,
      height: data.height || null,
      goal: data.goal || 'general',
      xp: 0,
      joinDate: new Date().toISOString(),
      achievements: ['first_login'],
      bodyMeasurements: [],
    };
    setUser(newUser);
    return newUser;
  };

  const login = (email, password) => {
    // Check localStorage for existing users
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const u = JSON.parse(stored);
      if (u.email === email && u.password === password) {
        setUser(u);
        return u;
      }
    }
    // Also check users list
    const users = JSON.parse(localStorage.getItem('fit3d_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return found;
    }
    return null;
  };

  const logout = () => setUser(null);

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addXp = (amount) => {
    setUser(prev => {
      if (!prev) return prev;
      const newXp = (prev.xp || 0) + amount;
      const oldLevel = getLevelInfo(prev.xp || 0).level;
      const newLevel = getLevelInfo(newXp).level;
      return {
        ...prev,
        xp: newXp,
        _leveledUp: newLevel > oldLevel ? newLevel : null,
      };
    });
  };

  const addAchievement = (achievementId) => {
    setUser(prev => {
      if (!prev) return prev;
      if (prev.achievements?.includes(achievementId)) return prev;
      return {
        ...prev,
        achievements: [...(prev.achievements || []), achievementId],
      };
    });
  };

  const levelInfo = user ? getLevelInfo(user.xp || 0) : null;

  return (
    <UserContext.Provider value={{
      user, signup, login, logout, updateProfile,
      addXp, addAchievement, levelInfo,
      isAuthenticated: !!user,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}

export { LEVEL_THRESHOLDS, getLevelInfo };

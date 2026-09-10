import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useWorkouts } from '../context/WorkoutContext';
import AuthModal from '../components/AuthModal';
import './Dashboard.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ALL_ACHIEVEMENTS = [
  { id: 'first_login', icon: '🎯', title: 'Welcome!', desc: 'Created your Fit3D account' },
  { id: 'first_workout', icon: '🏆', title: 'First Workout', desc: 'Complete your first workout' },
  { id: 'ten_workouts', icon: '💪', title: 'Dedicated', desc: 'Complete 10 workouts' },
  { id: 'thirty_workouts', icon: '🎯', title: '30 Strong', desc: 'Complete 30 workouts' },
  { id: 'speed_demon', icon: '⚡', title: 'Speed Demon', desc: 'Finish a workout under 20 min' },
  { id: 'volume_king', icon: '👑', title: 'Volume King', desc: 'Lift 5000kg+ in one session' },
  { id: 'seven_streak', icon: '🔥', title: '7-Day Streak', desc: 'Work out 7 days in a row' },
  { id: 'elite', icon: '💎', title: 'Elite Status', desc: 'Reach level 10' },
];

function AnimatedNumber({ target, duration = 1500 }) {
  const [val, setVal] = useState(0);
  const ref = useRef();
  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * target * 10) / 10);
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);
  return <span>{val % 1 === 0 ? val : val.toFixed(1)}</span>;
}

function BarChart({ data, labels, color = '#00d4ff' }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { setTimeout(() => setAnimate(true), 300); }, []);
  const max = Math.max(...data, 1);
  return (
    <div className="bar-chart">
      {data.map((v, i) => (
        <div key={i} className="bar-col">
          <div className="bar-wrapper">
            <div className="bar" style={{
              height: animate ? `${(v / max) * 100}%` : '0%',
              background: `linear-gradient(to top, ${color}, ${color}88)`,
              transitionDelay: `${i * 0.06}s`,
            }} />
          </div>
          <span className="bar-label">{labels?.[i] ?? i + 1}</span>
        </div>
      ))}
    </div>
  );
}

function CircularProgress({ value, max, color, size = 100, strokeWidth = 6 }) {
  const [animVal, setAnimVal] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animVal / max) * circumference;
  useEffect(() => { setTimeout(() => setAnimVal(value), 200); }, [value]);
  return (
    <svg width={size} height={size} className="circular-progress">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, levelInfo } = useUser();
  const { getStats, getWeeklyData, getMonthlyData, getRecentWorkouts, getStreak, getPersonalRecords } = useWorkouts();
  const [animateIn, setAnimateIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => { setTimeout(() => setAnimateIn(true), 100); }, []);

  // Auth guard
  if (!isAuthenticated) {
    return (
      <div className="dashboard-auth">
        <div className="auth-prompt glass-card">
          <h2>Welcome to <span className="glow-text">Fit3D</span></h2>
          <p>Sign in to track your workouts, earn XP, and unlock achievements.</p>
          <button className="neon-btn" onClick={() => setShowAuth(true)}>Get Started</button>
        </div>
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </div>
    );
  }

  const stats = getStats();
  const weeklyData = getWeeklyData();
  const monthlyData = getMonthlyData();
  const recentWorkouts = getRecentWorkouts(5);
  const streak = getStreak();
  const prs = getPersonalRecords();
  const prList = Object.entries(prs).slice(0, 5);

  const STATS = [
    { label: 'Calories Burned', value: stats.caloriesBurned, unit: 'kcal', icon: '🔥', color: '#f59e0b' },
    { label: 'Workouts', value: stats.workoutsThisMonth, unit: 'this month', icon: '💪', color: '#00d4ff' },
    { label: 'Time Trained', value: Math.round((stats.totalTimeMinutes / 60) * 10) / 10, unit: 'hours', icon: '⏱️', color: '#8b5cf6' },
    { label: 'Current Streak', value: streak, unit: 'days', icon: '🔥', color: '#10b981' },
  ];

  return (
    <div className={`dashboard ${animateIn ? 'animate-in' : ''}`}>
      <div className="section-container dash-container">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h2>Welcome Back, <span className="glow-text">{user.name?.split(' ')[0] || 'Athlete'}</span></h2>
            <p>Here's your fitness overview</p>
          </div>
          <div className="dash-level-badge">
            <div className="level-ring">
              <CircularProgress value={levelInfo?.currentXp || 0} max={levelInfo?.xpForNext || 1000} color="#8b5cf6" size={60} strokeWidth={4} />
              <span className="level-num">{levelInfo?.level || 1}</span>
            </div>
            <div>
              <span className="level-name">{levelInfo?.name || 'Beginner'}</span>
              <span className="level-xp">{levelInfo?.totalXp || 0} XP</span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="xp-bar-container glass-card">
          <div className="xp-info">
            <span className="xp-label">Level {levelInfo?.level} — {levelInfo?.name}</span>
            <span className="xp-value">{levelInfo?.currentXp || 0} / {levelInfo?.xpForNext || 1000} XP</span>
          </div>
          <div className="xp-track">
            <div className="xp-fill" style={{ width: `${((levelInfo?.currentXp || 0) / (levelInfo?.xpForNext || 1000)) * 100}%` }} />
          </div>
          <p className="xp-hint">Earn {(levelInfo?.xpForNext || 1000) - (levelInfo?.currentXp || 0)} more XP to reach Level {(levelInfo?.level || 1) + 1}</p>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="neon-btn quick-action" onClick={() => navigate('/plans')}>
            🏋️ Start Workout
          </button>
          <button className="quick-action-secondary" onClick={() => navigate('/body-map')}>
            🧬 Body Map
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="stat-card glass-card" style={{ animationDelay: `${i * 0.1}s`, '--accent': s.color }}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-info">
                <span className="stat-value"><AnimatedNumber target={s.value} /></span>
                <span className="stat-unit">{s.unit}</span>
                <span className="stat-label">{s.label}</span>
              </div>
              <div className="stat-glow" style={{ background: `radial-gradient(circle, ${s.color}15 0%, transparent 70%)` }} />
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="charts-row">
          <div className="chart-card glass-card">
            <div className="chart-header">
              <h3>Weekly Volume</h3>
              <span className="chart-tag">This Week</span>
            </div>
            <BarChart data={weeklyData.data} labels={DAYS} color="#00d4ff" />
          </div>
          <div className="chart-card glass-card">
            <div className="chart-header">
              <h3>Workout Frequency</h3>
              <span className="chart-tag">Last 12 Weeks</span>
            </div>
            <BarChart data={monthlyData} color="#8b5cf6" />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="bottom-row">
          {/* Recent Workouts */}
          <div className="workout-log glass-card">
            <h3>Recent Workouts</h3>
            {recentWorkouts.length === 0 ? (
              <div className="empty-state">
                <p>No workouts yet. Start your first workout!</p>
                <button className="neon-btn" onClick={() => navigate('/plans')}>Browse Plans</button>
              </div>
            ) : (
              <div className="workout-list">
                {recentWorkouts.map((w, i) => {
                  const date = new Date(w.date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <div key={w.id} className="workout-log-item" style={{ animationDelay: `${i * 0.08}s` }}>
                      <div className="wl-main">
                        <span className="wl-name">{w.planName}</span>
                        <span className="wl-date">{isToday ? 'Today' : date.toLocaleDateString()}</span>
                      </div>
                      <div className="wl-meta">
                        <span>{w.exercises?.length || 0} exercises</span>
                        <span>{w.duration || 0} min</span>
                        {w.xpEarned && <span className="wl-xp">+{w.xpEarned} XP</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Streak + PRs */}
          <div className="streak-card glass-card">
            <h3>Streak</h3>
            <div className="streak-display">
              <div className="streak-number"><AnimatedNumber target={streak} /></div>
              <span className="streak-label">Day Streak 🔥</span>
            </div>
            <div className="streak-days">
              {DAYS.map((d, i) => (
                <div key={i} className={`streak-day ${i <= streak && streak > 0 ? 'active' : ''}`} style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="streak-dot" />
                  <span>{d}</span>
                </div>
              ))}
            </div>

            {prList.length > 0 && (
              <div className="pr-section">
                <h4>Personal Records 🏅</h4>
                {prList.map(([name, pr], i) => (
                  <div key={i} className="pr-item">
                    <span className="pr-name">{name}</span>
                    <span className="pr-val">{pr.weight}kg × {pr.reps}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="achievements-section">
          <h3>Achievements</h3>
          <div className="achievements-grid">
            {ALL_ACHIEVEMENTS.map((a, i) => {
              const unlocked = user.achievements?.includes(a.id);
              return (
                <div key={i} className={`achievement-card glass-card ${unlocked ? 'unlocked' : 'locked'}`}
                  style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="achievement-icon">{a.icon}</div>
                  <div className="achievement-info">
                    <span className="achievement-title">{a.title}</span>
                    <span className="achievement-desc">{a.desc}</span>
                  </div>
                  {unlocked && <span className="achievement-check">✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

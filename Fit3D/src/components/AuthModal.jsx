import { useState } from 'react';
import { useUser } from '../context/UserContext';
import './AuthModal.css';

const GOALS = [
  { id: 'lose_weight', label: '🔥 Lose Weight', desc: 'Burn fat and get lean' },
  { id: 'build_muscle', label: '💪 Build Muscle', desc: 'Gain strength and size' },
  { id: 'stay_fit', label: '🏃 Stay Fit', desc: 'Maintain overall fitness' },
  { id: 'athletics', label: '🏆 Athletics', desc: 'Sport-specific training' },
];

export default function AuthModal({ isOpen, onClose }) {
  const { signup, login } = useUser();
  const [mode, setMode] = useState('login'); // login | signup | profile
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', weight: '', height: '', goal: 'stay_fit' });

  if (!isOpen) return null;

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const result = login(form.email, form.password);
    if (result) {
      onClose();
    } else {
      setError('Invalid email or password. Try signing up!');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    if (form.password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    setMode('profile');
  };

  const handleProfile = (e) => {
    e.preventDefault();
    signup(form);
    onClose();
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal glass-card" onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>✕</button>

        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-fit">FIT</span><span className="logo-3d">3D</span>
          </div>
          {mode === 'profile' ? (
            <p className="auth-subtitle">Set up your profile</p>
          ) : (
            <p className="auth-subtitle">
              {mode === 'login' ? 'Welcome back, athlete' : 'Join the future of fitness'}
            </p>
          )}
        </div>

        {mode !== 'profile' && (
          <div className="auth-tabs">
            <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>
              Log In
            </button>
            <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => { setMode('signup'); setError(''); }}>
              Sign Up
            </button>
          </div>
        )}

        {error && <div className="auth-error">{error}</div>}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="auth-field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="you@example.com" required />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
                placeholder="••••••••" required />
            </div>
            <button type="submit" className="neon-btn auth-submit">Log In</button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="auth-form">
            <div className="auth-field">
              <label>Name</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="Your name" required />
            </div>
            <div className="auth-field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="you@example.com" required />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
                placeholder="••••••••" required />
            </div>
            <button type="submit" className="neon-btn auth-submit">Continue →</button>
          </form>
        )}

        {mode === 'profile' && (
          <form onSubmit={handleProfile} className="auth-form">
            <div className="auth-row">
              <div className="auth-field">
                <label>Weight (kg)</label>
                <input type="number" value={form.weight} onChange={e => set('weight', e.target.value)}
                  placeholder="75" />
              </div>
              <div className="auth-field">
                <label>Height (cm)</label>
                <input type="number" value={form.height} onChange={e => set('height', e.target.value)}
                  placeholder="175" />
              </div>
            </div>
            <div className="auth-field">
              <label>Your Goal</label>
              <div className="goal-grid">
                {GOALS.map(g => (
                  <button key={g.id} type="button"
                    className={`goal-option ${form.goal === g.id ? 'active' : ''}`}
                    onClick={() => set('goal', g.id)}>
                    <span className="goal-icon">{g.label.split(' ')[0]}</span>
                    <span className="goal-label">{g.label.split(' ').slice(1).join(' ')}</span>
                    <span className="goal-desc">{g.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="neon-btn auth-submit">Start Training 🚀</button>
          </form>
        )}
      </div>
    </div>
  );
}

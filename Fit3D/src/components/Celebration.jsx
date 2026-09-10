import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import './Celebration.css';

export default function Celebration() {
  const { user } = useUser();
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (user?._leveledUp) {
      setMessage(`🎉 Level Up! You're now Level ${user._leveledUp}!`);
      setShow(true);
      setParticles(Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1 + Math.random() * 2,
        size: 4 + Math.random() * 8,
        color: ['#00d4ff', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)],
      })));
      setTimeout(() => setShow(false), 3500);
    }
  }, [user?._leveledUp]);

  if (!show) return null;

  return (
    <div className="celebration-overlay">
      <div className="celebration-content">
        <div className="celebration-icon">⬆️</div>
        <h2 className="celebration-text glow-text">{message}</h2>
      </div>
      {particles.map(p => (
        <div key={p.id} className="confetti-particle" style={{
          left: `${p.x}%`,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          background: p.color,
        }} />
      ))}
    </div>
  );
}

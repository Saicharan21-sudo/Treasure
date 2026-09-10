import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroScene from '../components/HeroScene';
import './LandingPage.css';

const FEATURES = [
  { icon: '🏋️', title: '3D Body Map', desc: 'Interactive muscle targeting with real-time 3D visualization' },
  { icon: '📊', title: 'Smart Analytics', desc: 'AI-powered progress tracking and performance insights' },
  { icon: '🏆', title: 'Gamification', desc: 'XP, badges, and levels to keep you motivated every day' },
  { icon: '⚡', title: 'Real-time Sync', desc: 'Seamless tracking across all your devices instantly' },
];

const WORKOUTS = [
  { name: 'Push Day', muscles: 'Chest • Shoulders • Triceps', sets: 18, time: '55 min', color: '#00d4ff' },
  { name: 'Pull Day', muscles: 'Back • Biceps • Rear Delts', sets: 16, time: '50 min', color: '#8b5cf6' },
  { name: 'Leg Day', muscles: 'Quads • Hamstrings • Glutes', sets: 20, time: '60 min', color: '#ec4899' },
  { name: 'Core Blast', muscles: 'Abs • Obliques • Lower Back', sets: 12, time: '30 min', color: '#10b981' },
];

const STATS = [
  { value: '50K+', label: 'Active Users' },
  { value: '2M+', label: 'Workouts Logged' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '500+', label: 'Exercises' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [pose, setPose] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef([]);

  // Scroll-based pose change & section visibility
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('data-section');
        setVisibleSections(prev => {
          const next = new Set(prev);
          if (entry.isIntersecting) next.add(id);
          return next;
        });
      });
    }, { threshold: 0.2 });

    sectionRefs.current.forEach(el => { if (el) observer.observe(el); });

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const h = window.innerHeight;
      if (scrollY < h * 0.8) setPose(0);
      else if (scrollY < h * 1.6) setPose(1);
      else setPose(2);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const addRef = (el, i) => { sectionRefs.current[i] = el; };

  return (
    <div className="landing">
      {/* ======== HERO ======== */}
      <section className="hero">
        <div className="hero-3d">
          <HeroScene pose={pose} />
        </div>
        <div className="hero-content">
          <div className="hero-badge">🚀 Next-Gen Fitness</div>
          <h1>
            Train Smarter<br />
            <span className="glow-text">With 3D Power</span>
          </h1>
          <p className="hero-subtitle">
            The world's first immersive 3D gym tracker. Visualize your muscles,
            track progress, and level up your fitness journey.
          </p>
          <div className="hero-actions">
            <button className="neon-btn" onClick={() => navigate('/dashboard')}>
              Start Training Free
            </button>
            <button className="hero-btn-outline" onClick={() => navigate('/body-map')}>
              Explore Body Map →
            </button>
          </div>
          <div className="hero-stats">
            {STATS.map((s, i) => (
              <div key={i} className="hero-stat">
                <span className="hero-stat-val">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel" />
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ======== FEATURES ======== */}
      <section
        className={`section features-section ${visibleSections.has('features') ? 'visible' : ''}`}
        ref={el => addRef(el, 0)} data-section="features"
      >
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2>Everything You Need To<br /><span className="glow-text">Dominate Your Training</span></h2>
            <p>Cutting-edge tools designed for serious athletes and beginners alike.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className="feature-glow" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== WORKOUTS PREVIEW ======== */}
      <section
        className={`section workouts-section ${visibleSections.has('workouts') ? 'visible' : ''}`}
        ref={el => addRef(el, 1)} data-section="workouts"
      >
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Workouts</span>
            <h2>Pre-Built Programs<br /><span className="glow-text">Ready To Go</span></h2>
            <p>Expert-designed workout splits with detailed exercise breakdowns.</p>
          </div>
          <div className="workouts-grid">
            {WORKOUTS.map((w, i) => (
              <div key={i} className="workout-card glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="workout-bar" style={{ background: w.color }} />
                <h3>{w.name}</h3>
                <p className="workout-muscles">{w.muscles}</p>
                <div className="workout-meta">
                  <span>{w.sets} sets</span>
                  <span>{w.time}</span>
                </div>
                <button className="workout-start" style={{ borderColor: w.color, color: w.color }}>
                  Start Workout
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== CTA ======== */}
      <section
        className={`section cta-section ${visibleSections.has('cta') ? 'visible' : ''}`}
        ref={el => addRef(el, 2)} data-section="cta"
      >
        <div className="section-container cta-container">
          <div className="cta-glow" />
          <h2>Ready to Transform<br /><span className="glow-text">Your Fitness?</span></h2>
          <p>Join thousands of athletes already using Fit3D to crush their goals.</p>
          <button className="neon-btn cta-btn" onClick={() => navigate('/dashboard')}>
            Get Started — It's Free
          </button>
        </div>
      </section>

      {/* ======== FOOTER ======== */}
      <footer className="footer">
        <div className="section-container footer-container">
          <div className="footer-logo">
            <span className="logo-fit">FIT</span><span className="logo-3d">3D</span>
          </div>
          <p className="footer-copy">© 2026 Fit3D. Built for the future of fitness.</p>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

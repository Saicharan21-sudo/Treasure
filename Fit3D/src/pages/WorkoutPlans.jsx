import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WORKOUT_PLANS } from '../data/workoutPlans';
import { getExerciseById } from '../data/exercises';
import { useUser } from '../context/UserContext';
import AuthModal from '../components/AuthModal';
import './WorkoutPlans.css';

const SPLITS = ['All', 'Push/Pull/Legs', 'Upper/Lower', 'Full Body', 'Specialty'];

export default function WorkoutPlans() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const [filter, setFilter] = useState('All');
  const [showAuth, setShowAuth] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState(null);

  useEffect(() => { setTimeout(() => setAnimateIn(true), 100); }, []);

  const filtered = filter === 'All' ? WORKOUT_PLANS : WORKOUT_PLANS.filter(p => p.split === filter);

  const startWorkout = (planId) => {
    if (!isAuthenticated) { setShowAuth(true); return; }
    navigate(`/workout/${planId}`);
  };

  return (
    <div className={`plans-page ${animateIn ? 'animate-in' : ''}`}>
      <div className="section-container">
        <div className="plans-header">
          <h2>Workout <span className="glow-text">Programs</span></h2>
          <p>Expert-designed programs for every fitness level. Pick a plan and start training.</p>
        </div>

        <div className="split-filters">
          {SPLITS.map(s => (
            <button key={s} className={`split-btn ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>

        <div className="plans-grid">
          {filtered.map((plan, i) => {
            const isExpanded = expandedPlan === plan.id;
            return (
              <div key={plan.id} className={`plan-card glass-card ${isExpanded ? 'expanded' : ''}`}
                style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="plan-bar" style={{ background: plan.color }} />
                <div className="plan-top">
                  <div>
                    <h3>{plan.name}</h3>
                    <span className="plan-split">{plan.split}</span>
                  </div>
                  <span className="plan-diff" data-diff={plan.difficulty}>{plan.difficulty}</span>
                </div>
                <p className="plan-desc">{plan.description}</p>
                <div className="plan-meta">
                  <span>⏱️ {plan.estimatedMinutes} min</span>
                  <span>💪 {plan.exercises.length} exercises</span>
                  <span>📊 {plan.exercises.reduce((s, e) => s + e.sets, 0)} total sets</span>
                </div>

                <button className="plan-toggle" onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}>
                  {isExpanded ? 'Hide Exercises ▲' : 'Show Exercises ▼'}
                </button>

                {isExpanded && (
                  <div className="plan-exercises">
                    {plan.exercises.map((pe, j) => {
                      const ex = getExerciseById(pe.exerciseId);
                      return (
                        <div key={j} className="plan-exercise" style={{ animationDelay: `${j * 0.05}s` }}>
                          <span className="pe-num">{j + 1}</span>
                          <div className="pe-info">
                            <span className="pe-name">{ex?.name || pe.exerciseId}</span>
                            <span className="pe-detail">{pe.sets} × {pe.reps} · {pe.restSeconds}s rest</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button className="neon-btn plan-start" style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}aa)` }}
                  onClick={() => startWorkout(plan.id)}>
                  Start Workout →
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}

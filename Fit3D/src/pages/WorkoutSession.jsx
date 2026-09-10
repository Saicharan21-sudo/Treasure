import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlanById } from '../data/workoutPlans';
import { getExerciseById } from '../data/exercises';
import { useUser } from '../context/UserContext';
import { useWorkouts } from '../context/WorkoutContext';
import './WorkoutSession.css';

export default function WorkoutSession() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { addXp, addAchievement } = useUser();
  const { logWorkout, workouts } = useWorkouts();
  const plan = getPlanById(planId);

  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [setLogs, setSetLogs] = useState({});
  const [resting, setResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // Elapsed timer
  useEffect(() => {
    if (completed) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, [completed]);

  // Rest timer
  useEffect(() => {
    if (!resting || restTime <= 0) return;
    timerRef.current = setInterval(() => {
      setRestTime(prev => {
        if (prev <= 1) { setResting(false); clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [resting]);

  if (!plan) {
    return (
      <div className="session-page">
        <div className="session-error">
          <h2>Plan not found</h2>
          <button className="neon-btn" onClick={() => navigate('/plans')}>Browse Plans</button>
        </div>
      </div>
    );
  }

  const exercises = plan.exercises.map(pe => ({
    ...pe,
    exercise: getExerciseById(pe.exerciseId),
  }));
  const current = exercises[currentExIndex];
  const currentKey = `${currentExIndex}`;

  // Get or init set logs for current exercise
  const currentSets = setLogs[currentKey] || Array.from({ length: current.sets }, () => ({ weight: 0, reps: current.reps, done: false }));

  const updateSet = (setIndex, field, value) => {
    const updated = [...currentSets];
    updated[setIndex] = { ...updated[setIndex], [field]: Number(value) };
    setSetLogs(prev => ({ ...prev, [currentKey]: updated }));
  };

  const completeSet = (setIndex) => {
    const updated = [...currentSets];
    updated[setIndex] = { ...updated[setIndex], done: true };
    setSetLogs(prev => ({ ...prev, [currentKey]: updated }));

    // Start rest timer
    setRestTime(current.restSeconds);
    setResting(true);
  };

  const nextExercise = () => {
    if (currentExIndex < exercises.length - 1) {
      setCurrentExIndex(prev => prev + 1);
      setResting(false);
      setRestTime(0);
    }
  };

  const prevExercise = () => {
    if (currentExIndex > 0) {
      setCurrentExIndex(prev => prev - 1);
      setResting(false);
      setRestTime(0);
    }
  };

  const finishWorkout = () => {
    const duration = Math.floor((Date.now() - startTimeRef.current) / 60000);
    let totalVolume = 0;

    const loggedExercises = exercises.map((ex, i) => {
      const sets = setLogs[`${i}`] || [];
      const completeSets = sets.filter(s => s.done);
      completeSets.forEach(s => { totalVolume += (s.weight || 0) * (s.reps || 0); });
      return {
        name: ex.exercise?.name || ex.exerciseId,
        muscleGroup: ex.exercise?.muscleGroup,
        sets: completeSets,
      };
    });

    const calories = Math.floor(duration * 7 + totalVolume * 0.02);
    const xp = Math.floor(50 + totalVolume * 0.05 + duration * 2);

    logWorkout({
      planName: plan.name,
      planId: plan.id,
      exercises: loggedExercises,
      duration,
      totalVolume,
      calories,
      xpEarned: xp,
    });

    addXp(xp);

    // Check achievements
    if ((workouts.length + 1) === 1) addAchievement('first_workout');
    if ((workouts.length + 1) >= 10) addAchievement('ten_workouts');
    if ((workouts.length + 1) >= 30) addAchievement('thirty_workouts');
    if (duration <= 20) addAchievement('speed_demon');
    if (totalVolume >= 5000) addAchievement('volume_king');

    setXpEarned(xp);
    setCompleted(true);
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const progress = exercises.length > 0 ? ((currentExIndex + 1) / exercises.length) * 100 : 0;

  // Completed screen
  if (completed) {
    return (
      <div className="session-page">
        <div className="session-complete">
          <div className="complete-icon">🏆</div>
          <h2>Workout Complete!</h2>
          <p className="complete-plan">{plan.name}</p>
          <div className="complete-stats">
            <div className="complete-stat">
              <span className="cs-val">{formatTime(elapsed)}</span>
              <span className="cs-label">Duration</span>
            </div>
            <div className="complete-stat">
              <span className="cs-val">{Object.values(setLogs).flat().filter(s => s.done).length}</span>
              <span className="cs-label">Sets</span>
            </div>
            <div className="complete-stat">
              <span className="cs-val glow-text">+{xpEarned}</span>
              <span className="cs-label">XP Earned</span>
            </div>
          </div>
          <div className="complete-actions">
            <button className="neon-btn" onClick={() => navigate('/dashboard')}>View Dashboard</button>
            <button className="session-secondary-btn" onClick={() => navigate('/plans')}>More Workouts</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="session-page">
      {/* Top Bar */}
      <div className="session-topbar">
        <button className="session-back" onClick={() => { if (confirm('Quit workout? Progress won\'t be saved.')) navigate('/plans'); }}>
          ✕
        </button>
        <div className="session-info">
          <span className="session-plan-name">{plan.name}</span>
          <span className="session-timer">{formatTime(elapsed)}</span>
        </div>
        <button className="session-finish-btn" onClick={finishWorkout}>Finish</button>
      </div>

      {/* Progress Bar */}
      <div className="session-progress-track">
        <div className="session-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Rest Timer Overlay */}
      {resting && (
        <div className="rest-overlay">
          <div className="rest-content">
            <span className="rest-label">REST</span>
            <div className="rest-timer">{restTime}</div>
            <div className="rest-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#restGrad)" strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={2 * Math.PI * 45 * (1 - restTime / current.restSeconds)}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dashoffset 1s linear' }} />
                <defs>
                  <linearGradient id="restGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <button className="rest-skip" onClick={() => { setResting(false); setRestTime(0); }}>Skip Rest →</button>
          </div>
        </div>
      )}

      {/* Exercise Card */}
      <div className="session-exercise-card glass-card">
        <div className="se-header">
          <span className="se-counter">{currentExIndex + 1} / {exercises.length}</span>
          <h3 className="se-name">{current.exercise?.name || current.exerciseId}</h3>
          <span className="se-muscle">{current.exercise?.muscleGroup}</span>
          {current.exercise?.instructions && (
            <p className="se-instructions">{current.exercise.instructions}</p>
          )}
        </div>

        <div className="se-sets-header">
          <span>SET</span>
          <span>WEIGHT (kg)</span>
          <span>REPS</span>
          <span></span>
        </div>

        <div className="se-sets">
          {currentSets.map((s, i) => (
            <div key={i} className={`se-set-row ${s.done ? 'done' : ''}`}>
              <span className="se-set-num">{i + 1}</span>
              <input type="number" value={s.weight || ''} placeholder="0"
                onChange={e => updateSet(i, 'weight', e.target.value)}
                disabled={s.done} className="se-input" />
              <input type="number" value={s.reps || ''} placeholder={current.reps}
                onChange={e => updateSet(i, 'reps', e.target.value)}
                disabled={s.done} className="se-input" />
              {s.done ? (
                <span className="se-check">✓</span>
              ) : (
                <button className="se-done-btn" onClick={() => completeSet(i)}>Done</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="session-nav">
        <button className="session-nav-btn" onClick={prevExercise} disabled={currentExIndex === 0}>
          ← Previous
        </button>
        {currentExIndex < exercises.length - 1 ? (
          <button className="session-nav-btn next" onClick={nextExercise}>
            Next →
          </button>
        ) : (
          <button className="neon-btn" onClick={finishWorkout}>
            Complete Workout 🎉
          </button>
        )}
      </div>
    </div>
  );
}

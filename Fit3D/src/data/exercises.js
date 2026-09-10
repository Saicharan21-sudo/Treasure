export const EXERCISES = [
  // CHEST
  { id: 'bench_press', name: 'Bench Press', muscleGroup: 'chest', secondary: ['shoulders', 'arms'], difficulty: 'intermediate', defaultSets: 4, defaultReps: 8, instructions: 'Lie flat on bench. Lower bar to chest, press up.' },
  { id: 'incline_press', name: 'Incline Press', muscleGroup: 'chest', secondary: ['shoulders'], difficulty: 'intermediate', defaultSets: 3, defaultReps: 10, instructions: 'Set bench to 30-45°. Press dumbbells up.' },
  { id: 'chest_fly', name: 'Chest Fly', muscleGroup: 'chest', secondary: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 12, instructions: 'Lie flat, arms wide. Bring dumbbells together above chest.' },
  { id: 'pushups', name: 'Push-ups', muscleGroup: 'chest', secondary: ['shoulders', 'arms', 'core'], difficulty: 'beginner', defaultSets: 3, defaultReps: 15, instructions: 'Body straight. Lower chest to floor, push up.' },
  { id: 'cable_crossover', name: 'Cable Crossover', muscleGroup: 'chest', secondary: [], difficulty: 'intermediate', defaultSets: 3, defaultReps: 12, instructions: 'Stand between cables. Pull handles together in front.' },
  { id: 'dips_chest', name: 'Chest Dips', muscleGroup: 'chest', secondary: ['arms', 'shoulders'], difficulty: 'intermediate', defaultSets: 3, defaultReps: 10, instructions: 'Lean forward on dip bars. Lower and press up.' },
  { id: 'decline_press', name: 'Decline Press', muscleGroup: 'chest', secondary: ['arms'], difficulty: 'intermediate', defaultSets: 3, defaultReps: 10, instructions: 'Set bench to -15°. Press barbell up.' },

  // BACK
  { id: 'pullups', name: 'Pull-ups', muscleGroup: 'back', secondary: ['arms'], difficulty: 'intermediate', defaultSets: 4, defaultReps: 8, instructions: 'Hang from bar. Pull chin above bar.' },
  { id: 'barbell_row', name: 'Barbell Row', muscleGroup: 'back', secondary: ['arms'], difficulty: 'intermediate', defaultSets: 4, defaultReps: 8, instructions: 'Bend at hips. Pull bar to lower chest.' },
  { id: 'lat_pulldown', name: 'Lat Pulldown', muscleGroup: 'back', secondary: ['arms'], difficulty: 'beginner', defaultSets: 3, defaultReps: 12, instructions: 'Sit at cable machine. Pull bar to upper chest.' },
  { id: 'seated_row', name: 'Seated Row', muscleGroup: 'back', secondary: ['arms'], difficulty: 'beginner', defaultSets: 3, defaultReps: 12, instructions: 'Sit upright. Pull cable handles to torso.' },
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'back', secondary: ['legs', 'glutes', 'core'], difficulty: 'advanced', defaultSets: 4, defaultReps: 5, instructions: 'Stand over bar. Hinge hips, grip bar, stand up.' },
  { id: 'face_pull', name: 'Face Pull', muscleGroup: 'back', secondary: ['shoulders'], difficulty: 'beginner', defaultSets: 3, defaultReps: 15, instructions: 'Pull rope cable to face level, elbows high.' },
  { id: 'tbar_row', name: 'T-Bar Row', muscleGroup: 'back', secondary: ['arms'], difficulty: 'intermediate', defaultSets: 3, defaultReps: 10, instructions: 'Straddle T-bar. Row weight to chest.' },

  // SHOULDERS
  { id: 'overhead_press', name: 'Overhead Press', muscleGroup: 'shoulders', secondary: ['arms', 'core'], difficulty: 'intermediate', defaultSets: 4, defaultReps: 8, instructions: 'Press barbell from shoulders to overhead.' },
  { id: 'lateral_raise', name: 'Lateral Raise', muscleGroup: 'shoulders', secondary: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 15, instructions: 'Raise dumbbells to sides at shoulder height.' },
  { id: 'front_raise', name: 'Front Raise', muscleGroup: 'shoulders', secondary: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 12, instructions: 'Raise dumbbells to front at shoulder height.' },
  { id: 'arnold_press', name: 'Arnold Press', muscleGroup: 'shoulders', secondary: ['arms'], difficulty: 'intermediate', defaultSets: 3, defaultReps: 10, instructions: 'Rotate palms while pressing dumbbells overhead.' },
  { id: 'reverse_fly', name: 'Reverse Fly', muscleGroup: 'shoulders', secondary: ['back'], difficulty: 'beginner', defaultSets: 3, defaultReps: 15, instructions: 'Bend forward. Raise dumbbells to sides.' },
  { id: 'shrugs', name: 'Shrugs', muscleGroup: 'shoulders', secondary: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 12, instructions: 'Hold heavy dumbbells. Shrug shoulders up.' },

  // ARMS
  { id: 'bicep_curl', name: 'Bicep Curl', muscleGroup: 'arms', secondary: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 12, instructions: 'Curl dumbbells up, elbows stationary.' },
  { id: 'hammer_curl', name: 'Hammer Curl', muscleGroup: 'arms', secondary: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 12, instructions: 'Curl with neutral grip (palms facing each other).' },
  { id: 'tricep_dip', name: 'Tricep Dip', muscleGroup: 'arms', secondary: ['chest', 'shoulders'], difficulty: 'intermediate', defaultSets: 3, defaultReps: 10, instructions: 'Keep body upright on dip bars, lower and press.' },
  { id: 'skull_crusher', name: 'Skull Crusher', muscleGroup: 'arms', secondary: [], difficulty: 'intermediate', defaultSets: 3, defaultReps: 10, instructions: 'Lie flat. Lower bar to forehead, extend arms.' },
  { id: 'cable_curl', name: 'Cable Curl', muscleGroup: 'arms', secondary: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 12, instructions: 'Curl cable bar up, keep elbows at sides.' },
  { id: 'tricep_pushdown', name: 'Tricep Pushdown', muscleGroup: 'arms', secondary: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 12, instructions: 'Push cable rope down, squeeze triceps.' },
  { id: 'preacher_curl', name: 'Preacher Curl', muscleGroup: 'arms', secondary: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 10, instructions: 'Curl on preacher bench for strict form.' },
  { id: 'overhead_extension', name: 'Overhead Extension', muscleGroup: 'arms', secondary: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 12, instructions: 'Hold dumbbell overhead. Lower behind head, extend.' },

  // CORE
  { id: 'plank', name: 'Plank', muscleGroup: 'core', secondary: ['shoulders'], difficulty: 'beginner', defaultSets: 3, defaultReps: 60, instructions: 'Hold forearm plank. Keep body straight. (seconds)' },
  { id: 'crunches', name: 'Crunches', muscleGroup: 'core', secondary: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 20, instructions: 'Lie on back. Curl shoulders off floor.' },
  { id: 'russian_twist', name: 'Russian Twist', muscleGroup: 'core', secondary: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 20, instructions: 'Sit with feet up. Rotate torso side to side.' },
  { id: 'leg_raise', name: 'Leg Raise', muscleGroup: 'core', secondary: [], difficulty: 'intermediate', defaultSets: 3, defaultReps: 15, instructions: 'Lie flat. Raise legs to 90°, lower slowly.' },
  { id: 'mountain_climbers', name: 'Mountain Climbers', muscleGroup: 'core', secondary: ['shoulders', 'legs'], difficulty: 'beginner', defaultSets: 3, defaultReps: 30, instructions: 'Plank position. Drive knees to chest alternately.' },
  { id: 'bicycle_crunch', name: 'Bicycle Crunch', muscleGroup: 'core', secondary: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 20, instructions: 'Lie on back. Touch elbow to opposite knee.' },
  { id: 'cable_woodchop', name: 'Cable Woodchop', muscleGroup: 'core', secondary: [], difficulty: 'intermediate', defaultSets: 3, defaultReps: 12, instructions: 'Pull cable diagonally across body.' },
  { id: 'ab_rollout', name: 'Ab Rollout', muscleGroup: 'core', secondary: ['shoulders'], difficulty: 'advanced', defaultSets: 3, defaultReps: 10, instructions: 'Roll wheel forward from knees, return.' },

  // LEGS
  { id: 'squat', name: 'Barbell Squat', muscleGroup: 'legs', secondary: ['glutes', 'core'], difficulty: 'intermediate', defaultSets: 4, defaultReps: 8, instructions: 'Bar on back. Squat to parallel, stand up.' },
  { id: 'leg_press', name: 'Leg Press', muscleGroup: 'legs', secondary: ['glutes'], difficulty: 'beginner', defaultSets: 4, defaultReps: 10, instructions: 'Press platform away. Lower slowly, press up.' },
  { id: 'lunges', name: 'Lunges', muscleGroup: 'legs', secondary: ['glutes'], difficulty: 'beginner', defaultSets: 3, defaultReps: 12, instructions: 'Step forward. Lower back knee, push up.' },
  { id: 'leg_curl', name: 'Leg Curl', muscleGroup: 'legs', secondary: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 12, instructions: 'Lie on machine. Curl heels to glutes.' },
  { id: 'leg_extension', name: 'Leg Extension', muscleGroup: 'legs', secondary: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 12, instructions: 'Extend legs fully on machine, squeeze quads.' },
  { id: 'calf_raise', name: 'Calf Raise', muscleGroup: 'legs', secondary: [], difficulty: 'beginner', defaultSets: 4, defaultReps: 15, instructions: 'Rise up on toes. Lower slowly. Repeat.' },
  { id: 'front_squat', name: 'Front Squat', muscleGroup: 'legs', secondary: ['core', 'glutes'], difficulty: 'advanced', defaultSets: 4, defaultReps: 6, instructions: 'Bar on front delts. Squat deep, stand up.' },
  { id: 'romanian_deadlift', name: 'Romanian Deadlift', muscleGroup: 'legs', secondary: ['glutes', 'back'], difficulty: 'intermediate', defaultSets: 3, defaultReps: 10, instructions: 'Hinge at hips. Lower bar along legs, stand up.' },

  // GLUTES
  { id: 'hip_thrust', name: 'Hip Thrust', muscleGroup: 'glutes', secondary: ['legs'], difficulty: 'intermediate', defaultSets: 4, defaultReps: 10, instructions: 'Back on bench. Drive hips up with barbell.' },
  { id: 'glute_bridge', name: 'Glute Bridge', muscleGroup: 'glutes', secondary: ['legs'], difficulty: 'beginner', defaultSets: 3, defaultReps: 15, instructions: 'Lie on back. Push hips up, squeeze at top.' },
  { id: 'bulgarian_split', name: 'Bulgarian Split Squat', muscleGroup: 'glutes', secondary: ['legs'], difficulty: 'intermediate', defaultSets: 3, defaultReps: 10, instructions: 'Rear foot elevated. Squat on front leg.' },
  { id: 'step_ups', name: 'Step-ups', muscleGroup: 'glutes', secondary: ['legs'], difficulty: 'beginner', defaultSets: 3, defaultReps: 12, instructions: 'Step up onto bench. Drive through heel.' },
  { id: 'cable_kickback', name: 'Cable Kickback', muscleGroup: 'glutes', secondary: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 15, instructions: 'Kick leg back against cable resistance.' },
  { id: 'sumo_deadlift', name: 'Sumo Deadlift', muscleGroup: 'glutes', secondary: ['legs', 'back'], difficulty: 'advanced', defaultSets: 4, defaultReps: 6, instructions: 'Wide stance. Grip inside knees. Stand up.' },
];

export function getExercisesByMuscle(muscle) {
  return EXERCISES.filter(e => e.muscleGroup === muscle || e.secondary?.includes(muscle));
}

export function getExerciseById(id) {
  return EXERCISES.find(e => e.id === id);
}

export const MUSCLE_GROUPS = [
  { id: 'chest', label: 'Chest', color: '#00d4ff', icon: '🫁' },
  { id: 'back', label: 'Back', color: '#8b5cf6', icon: '🔙' },
  { id: 'shoulders', label: 'Shoulders', color: '#ec4899', icon: '💪' },
  { id: 'arms', label: 'Arms', color: '#f59e0b', icon: '💪' },
  { id: 'core', label: 'Core', color: '#10b981', icon: '🎯' },
  { id: 'legs', label: 'Legs', color: '#ef4444', icon: '🦵' },
  { id: 'glutes', label: 'Glutes', color: '#a855f7', icon: '🍑' },
];

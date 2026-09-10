import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import './BodyMap.css';

const MUSCLE_GROUPS = {
  chest: { label: 'Chest', color: '#00d4ff', exercises: ['Bench Press', 'Push-ups', 'Chest Fly', 'Cable Crossover'] },
  back: { label: 'Back', color: '#8b5cf6', exercises: ['Pull-ups', 'Rows', 'Lat Pulldown', 'Deadlift'] },
  shoulders: { label: 'Shoulders', color: '#ec4899', exercises: ['Overhead Press', 'Lateral Raise', 'Face Pull', 'Shrugs'] },
  arms: { label: 'Arms', color: '#f59e0b', exercises: ['Bicep Curl', 'Tricep Dip', 'Hammer Curl', 'Skull Crusher'] },
  core: { label: 'Core', color: '#10b981', exercises: ['Plank', 'Russian Twist', 'Leg Raise', 'Crunches'] },
  legs: { label: 'Legs', color: '#ef4444', exercises: ['Squats', 'Lunges', 'Leg Press', 'Calf Raise'] },
  glutes: { label: 'Glutes', color: '#a855f7', exercises: ['Hip Thrust', 'Glute Bridge', 'Bulgarian Split', 'Step-ups'] },
};

function BodyModel3D({ selected, onPartClick }) {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y += (state.pointer.x * 0.5 - group.current.rotation.y) * 0.03;
    group.current.position.y = Math.sin(t * 0.6) * 0.05;
  });

  const getMaterial = (name) => {
    const isSelected = selected === name;
    const data = MUSCLE_GROUPS[name];
    return new THREE.MeshStandardMaterial({
      color: isSelected ? data.color : '#1a1a2e',
      emissive: isSelected ? data.color : '#0a0a1a',
      emissiveIntensity: isSelected ? 1.0 : 0.15,
      metalness: 0.4,
      roughness: isSelected ? 0.2 : 0.5,
      transparent: true,
      opacity: isSelected ? 0.9 : 0.85,
    });
  };

  const Part = ({ name, position, args, scale }) => {
    const [hovered, setHovered] = useState(false);
    const ref = useRef();

    useFrame(() => {
      if (!ref.current) return;
      const s = hovered ? 1.06 : 1;
      ref.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
    });

    return (
      <mesh
        ref={ref}
        position={position}
        scale={scale}
        material={getMaterial(name)}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'default'; }}
        onClick={(e) => { e.stopPropagation(); onPartClick(name); }}
      >
        <capsuleGeometry args={args || [0.3, 0.1, 16, 16]} />
      </mesh>
    );
  };

  return (
    <group ref={group}>
      {/* Head */}
      <mesh position={[0, 1.65, 0]} material={getMaterial('head')}>
        <sphereGeometry args={[0.22, 32, 32]} />
      </mesh>
      <mesh position={[0, 1.35, 0]} material={getMaterial('head')}>
        <capsuleGeometry args={[0.08, 0.12, 8, 16]} />
      </mesh>

      <Part name="chest" position={[0, 0.95, 0]} args={[0.28, 0.35, 12, 16]} scale={[1.3, 1, 1.05]} />
      <Part name="core" position={[0, 0.45, 0]} args={[0.22, 0.25, 12, 16]} scale={[1.15, 1, 0.95]} />

      <Part name="shoulders" position={[-0.45, 1.15, 0]} args={[0.1, 0.05, 12, 16]} />
      <Part name="shoulders" position={[0.45, 1.15, 0]} args={[0.1, 0.05, 12, 16]} />

      <Part name="arms" position={[-0.55, 0.85, 0]} args={[0.07, 0.22, 8, 16]} />
      <Part name="arms" position={[0.55, 0.85, 0]} args={[0.07, 0.22, 8, 16]} />
      <Part name="arms" position={[-0.58, 0.45, 0]} args={[0.06, 0.2, 8, 16]} />
      <Part name="arms" position={[0.58, 0.45, 0]} args={[0.06, 0.2, 8, 16]} />

      <Part name="glutes" position={[0, 0.15, 0]} args={[0.25, 0.08, 12, 16]} scale={[1.2, 1, 1]} />

      <Part name="legs" position={[-0.18, -0.25, 0]} args={[0.1, 0.28, 8, 16]} />
      <Part name="legs" position={[0.18, -0.25, 0]} args={[0.1, 0.28, 8, 16]} />
      <Part name="legs" position={[-0.18, -0.75, 0]} args={[0.08, 0.26, 8, 16]} />
      <Part name="legs" position={[0.18, -0.75, 0]} args={[0.08, 0.26, 8, 16]} />
    </group>
  );
}

export default function BodyMap() {
  const [selected, setSelected] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const data = selected ? MUSCLE_GROUPS[selected] : null;

  return (
    <div className={`body-map-page ${animateIn ? 'animate-in' : ''}`}>
      <div className="bodymap-scene">
        <Canvas camera={{ position: [0, 0.5, 3.5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <pointLight position={[-3, 2, 4]} intensity={0.8} color="#00d4ff" distance={12} />
          <pointLight position={[3, -1, 3]} intensity={0.5} color="#8b5cf6" distance={10} />
          <BodyModel3D selected={selected} onPartClick={setSelected} />
          <ContactShadows position={[0, -1.1, 0]} opacity={0.3} scale={6} blur={2} />
          <fog attach="fog" args={['#0a0a0f', 5, 12]} />
        </Canvas>
      </div>

      <div className="bodymap-sidebar">
        <div className="bodymap-header">
          <h2>Interactive <span className="glow-text">Body Map</span></h2>
          <p>Click on a muscle group to see exercises</p>
        </div>

        <div className="muscle-buttons">
          {Object.entries(MUSCLE_GROUPS).map(([key, val]) => (
            <button
              key={key}
              className={`muscle-btn ${selected === key ? 'active' : ''}`}
              style={{ '--btn-color': val.color }}
              onClick={() => setSelected(selected === key ? null : key)}
            >
              <span className="muscle-dot" style={{ background: val.color }} />
              {val.label}
            </button>
          ))}
        </div>

        {data && (
          <div className="exercise-panel glass-card" key={selected}>
            <div className="exercise-panel-header">
              <div className="exercise-color" style={{ background: data.color }} />
              <h3>{data.label} Exercises</h3>
            </div>
            <div className="exercise-list">
              {data.exercises.map((ex, i) => (
                <div key={i} className="exercise-item" style={{ animationDelay: `${i * 0.08}s` }}>
                  <span className="exercise-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="exercise-name">{ex}</span>
                  <span className="exercise-add">+</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

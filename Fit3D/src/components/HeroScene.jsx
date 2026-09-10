import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

/* ---- Procedural Human Body ---- */
function HumanModel({ pose = 0, hovered, onPartClick }) {
  const group = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    // Smooth mouse-follow rotation
    const targetX = mouseRef.current.y * 0.15;
    const targetY = mouseRef.current.x * 0.25;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
    group.current.rotation.y += (targetY + Math.sin(t * 0.3) * 0.1 - group.current.rotation.y) * 0.05;
    // Gentle floating
    group.current.position.y = Math.sin(t * 0.8) * 0.08;
  });

  // Track mouse in NDC
  const { viewport } = useThree();
  useFrame((state) => {
    mouseRef.current = {
      x: (state.pointer.x) * 0.5,
      y: (state.pointer.y) * 0.5,
    };
  });

  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a2e',
    metalness: 0.4,
    roughness: 0.5,
    emissive: '#0a0a1a',
    emissiveIntensity: 0.2,
  }), []);

  const glowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00d4ff',
    emissive: '#00d4ff',
    emissiveIntensity: 0.8,
    metalness: 0.6,
    roughness: 0.2,
    transparent: true,
    opacity: 0.7,
  }), []);

  const highlightMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8b5cf6',
    emissive: '#8b5cf6',
    emissiveIntensity: 0.6,
    metalness: 0.5,
    roughness: 0.3,
  }), []);

  const BodyPart = ({ name, position, args, scale, material }) => {
    const [isHovered, setIsHovered] = useState(false);
    const meshRef = useRef();

    useFrame(() => {
      if (!meshRef.current) return;
      const targetScale = isHovered ? 1.05 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale), 0.1
      );
    });

    return (
      <mesh
        ref={meshRef}
        position={position}
        scale={scale}
        material={isHovered ? highlightMaterial : (material || bodyMaterial)}
        onPointerEnter={(e) => { e.stopPropagation(); setIsHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { setIsHovered(false); document.body.style.cursor = 'default'; }}
        onClick={(e) => { e.stopPropagation(); onPartClick?.(name); }}
      >
        {args ? <capsuleGeometry args={args} /> : <sphereGeometry args={[0.3, 32, 32]} />}
      </mesh>
    );
  };

  // Pose offsets
  const getPoseOffset = (p) => {
    if (p === 1) return { armAngle: -0.5, legSpread: 0.15 }; // squat-ish
    if (p === 2) return { armAngle: 0.3, legSpread: 0.05 };  // push-up
    return { armAngle: 0, legSpread: 0 };
  };
  const poseData = getPoseOffset(pose);

  return (
    <group ref={group}>
      {/* Head */}
      <BodyPart name="head" position={[0, 1.65, 0]} args={undefined} scale={[0.7, 0.85, 0.75]} />

      {/* Neck */}
      <mesh position={[0, 1.35, 0]} material={bodyMaterial}>
        <capsuleGeometry args={[0.08, 0.12, 8, 16]} />
      </mesh>

      {/* Torso - Chest */}
      <BodyPart name="chest" position={[0, 0.95, 0]} args={[0.28, 0.35, 12, 16]} scale={[1.3, 1, 1.05]} />

      {/* Torso - Core */}
      <BodyPart name="core" position={[0, 0.45, 0]} args={[0.22, 0.25, 12, 16]} scale={[1.15, 1, 0.95]} />

      {/* Shoulders */}
      <BodyPart name="shoulders" position={[-0.45, 1.15, 0]} args={[0.1, 0.05, 12, 16]} />
      <BodyPart name="shoulders" position={[0.45, 1.15, 0]} args={[0.1, 0.05, 12, 16]} />

      {/* Upper Arms */}
      <group rotation={[0, 0, 0.15 + poseData.armAngle]}>
        <BodyPart name="arms" position={[-0.55, 0.85, 0]} args={[0.07, 0.22, 8, 16]} />
      </group>
      <group rotation={[0, 0, -0.15 - poseData.armAngle]}>
        <BodyPart name="arms" position={[0.55, 0.85, 0]} args={[0.07, 0.22, 8, 16]} />
      </group>

      {/* Forearms */}
      <group rotation={[0, 0, 0.08 + poseData.armAngle * 0.5]}>
        <BodyPart name="arms" position={[-0.58, 0.45, 0]} args={[0.06, 0.2, 8, 16]} />
      </group>
      <group rotation={[0, 0, -0.08 - poseData.armAngle * 0.5]}>
        <BodyPart name="arms" position={[0.58, 0.45, 0]} args={[0.06, 0.2, 8, 16]} />
      </group>

      {/* Hips */}
      <BodyPart name="glutes" position={[0, 0.15, 0]} args={[0.25, 0.08, 12, 16]} scale={[1.2, 1, 1]} />

      {/* Upper Legs */}
      <BodyPart name="legs" position={[-0.18 - poseData.legSpread, -0.25, 0]} args={[0.1, 0.28, 8, 16]} />
      <BodyPart name="legs" position={[0.18 + poseData.legSpread, -0.25, 0]} args={[0.1, 0.28, 8, 16]} />

      {/* Lower Legs */}
      <BodyPart name="legs" position={[-0.18 - poseData.legSpread, -0.75, 0]} args={[0.08, 0.26, 8, 16]} />
      <BodyPart name="legs" position={[0.18 + poseData.legSpread, -0.75, 0]} args={[0.08, 0.26, 8, 16]} />

      {/* Energy Lines */}
      <EnergyRings />
    </group>
  );
}

/* ---- Animated energy rings ---- */
function EnergyRings() {
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.5;
      ring1.current.rotation.z = t * 0.3;
    }
    if (ring2.current) {
      ring2.current.rotation.y = t * 0.4;
      ring2.current.rotation.z = -t * 0.2;
    }
    if (ring3.current) {
      ring3.current.rotation.x = -t * 0.3;
      ring3.current.rotation.y = t * 0.5;
    }
  });

  const ringMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#00d4ff',
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
  }), []);

  return (
    <>
      <mesh ref={ring1} position={[0, 0.5, 0]} material={ringMaterial}>
        <torusGeometry args={[1.2, 0.005, 8, 64]} />
      </mesh>
      <mesh ref={ring2} position={[0, 0.5, 0]} material={ringMaterial}>
        <torusGeometry args={[1.4, 0.005, 8, 64]} />
      </mesh>
      <mesh ref={ring3} position={[0, 0.5, 0]} material={ringMaterial}>
        <torusGeometry args={[1.6, 0.005, 8, 64]} />
      </mesh>
    </>
  );
}

/* ---- Floating particles in 3D ---- */
function FloatingParticles3D({ count = 80 }) {
  const mesh = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.01) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#00d4ff" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

/* ---- Main Scene Export ---- */
export default function HeroScene({ pose = 0, onPartClick }) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 4], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-3, 2, 4]} intensity={0.8} color="#00d4ff" distance={12} />
      <pointLight position={[3, -1, 3]} intensity={0.5} color="#8b5cf6" distance={10} />
      <spotLight position={[0, 5, 2]} angle={0.4} penumbra={0.8} intensity={0.4} color="#00d4ff" />

      <HumanModel pose={pose} onPartClick={onPartClick} />
      <FloatingParticles3D />

      <ContactShadows position={[0, -1.1, 0]} opacity={0.3} scale={6} blur={2} />
      <fog attach="fog" args={['#0a0a0f', 6, 14]} />
    </Canvas>
  );
}

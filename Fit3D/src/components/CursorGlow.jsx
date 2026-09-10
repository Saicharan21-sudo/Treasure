import { useEffect, useRef } from 'react';
import './CursorGlow.css';

export default function CursorGlow() {
  const glowRef = useRef(null);
  const trailRef = useRef([]);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-glow" />
    </>
  );
}

import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
}

const COLORS = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

export const ConfettiBurst: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const list: Particle[] = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const distance = 90 + Math.random() * 110;
      list.push({
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        color: COLORS[i % COLORS.length],
        size: 5 + Math.random() * 6,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.1,
      });
    }
    setParticles(list);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-10">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-sm animate-confetti-pop"
          style={
            {
              backgroundColor: p.color,
              width: `${p.size}px`,
              height: `${p.size * (Math.random() > 0.5 ? 1.6 : 1)}px`,
              '--target-x': `${p.x}px`,
              '--target-y': `${p.y}px`,
              '--target-rotate': `${p.rotation}deg`,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

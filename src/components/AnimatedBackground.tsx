import React from 'react';
import { motion } from 'motion/react';
import { RarityTier } from '../utils/appraiser';

interface AnimatedBackgroundProps {
  isCalculating?: boolean;
  rarity?: RarityTier | null;
}

const FLOATING_ELEMENTS = [
  { id: 1, text: '¥', x: '8%', y: '16%', size: 'text-2xl sm:text-3xl', color: 'text-amber-500/25', anim: 'animate-float-slow', delay: 0 },
  { id: 2, text: '✦', x: '90%', y: '12%', size: 'text-xl sm:text-2xl', color: 'text-amber-400/35', anim: 'animate-float-reverse', delay: 1.2 },
  { id: 3, text: '★', x: '5%', y: '48%', size: 'text-lg sm:text-xl', color: 'text-rose-400/25', anim: 'animate-float-slow', delay: 2.5 },
  { id: 4, text: '¥', x: '92%', y: '52%', size: 'text-3xl sm:text-4xl', color: 'text-amber-500/20', anim: 'animate-float-reverse', delay: 0.8 },
  { id: 5, text: '✦', x: '12%', y: '82%', size: 'text-2xl', color: 'text-sky-400/25', anim: 'animate-float-slow', delay: 1.8 },
  { id: 6, text: '極', x: '88%', y: '84%', size: 'text-xl sm:text-2xl', color: 'text-rose-500/20', anim: 'animate-float-reverse', delay: 3.1 },
  { id: 7, text: '★', x: '48%', y: '6%', size: 'text-base', color: 'text-amber-400/30', anim: 'animate-float-slow', delay: 1.5 },
  { id: 8, text: '幸', x: '15%', y: '32%', size: 'text-lg', color: 'text-emerald-500/20', anim: 'animate-float-reverse', delay: 2.2 },
  { id: 9, text: '✦', x: '82%', y: '30%', size: 'text-xl', color: 'text-indigo-400/25', anim: 'animate-float-slow', delay: 0.5 },
];

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  isCalculating = false,
  rarity = null,
}) => {
  const isHighTier = rarity === 'LR' || rarity === 'UR' || rarity === 'SSR';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
    >
      {/* 1. Base Gradient Canvas */}
      <div className="absolute inset-0 bg-[#F8FAFC]" />

      {/* 2. Slowly Drifting Ambient Color Orbs */}
      <div
        className={`absolute -top-32 -left-32 w-96 sm:w-[520px] h-96 sm:h-[520px] rounded-full blur-3xl opacity-60 animate-orb-1 transition-colors duration-1000 ${
          isHighTier
            ? 'bg-amber-300/40'
            : isCalculating
            ? 'bg-amber-400/35'
            : 'bg-amber-200/30'
        }`}
      />
      <div
        className={`absolute top-1/3 -right-32 w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full blur-3xl opacity-50 animate-orb-2 transition-colors duration-1000 ${
          isHighTier
            ? 'bg-rose-300/35'
            : isCalculating
            ? 'bg-rose-400/30'
            : 'bg-rose-200/25'
        }`}
      />
      <div
        className="absolute -bottom-32 left-1/4 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full blur-3xl opacity-40 animate-orb-1 bg-sky-200/30"
      />

      {/* 3. Subtle Animated Japanese Geometric Dot / Plus Grid */}
      <div
        className="absolute inset-0 opacity-[0.035] animate-bg-grid"
        style={{
          backgroundImage: `
            radial-gradient(#0F172A 1.2px, transparent 1.2px),
            linear-gradient(to right, #0F172A 1px, transparent 1px),
            linear-gradient(to bottom, #0F172A 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px, 48px 48px, 48px 48px',
          backgroundPosition: '0 0, 0 0, 0 0',
        }}
      />

      {/* 4. Floating Currency & Lucky Symbols */}
      {FLOATING_ELEMENTS.map((item) => (
        <div
          key={item.id}
          className={`absolute font-black select-none ${item.size} ${item.color} ${item.anim}`}
          style={{
            left: item.x,
            top: item.y,
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.text}
        </div>
      ))}

      {/* 5. Calculating / Reveal Wave Shimmer (Active while calculating or on high tier) */}
      {(isCalculating || isHighTier) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isCalculating ? 0.3 : 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-radial from-amber-400/20 via-transparent to-transparent animate-pulse-subtle"
        />
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  AppraisalResult,
  RarityTier,
  formatJapaneseCurrency,
} from '../utils/appraiser';
import { ConfettiBurst } from './ConfettiBurst';
import { RadarChart } from './RadarChart';
import { soundFX } from '../utils/sound';

interface AppraisalCardProps {
  result: AppraisalResult;
}

const RARITY_THEMES: Record<
  RarityTier,
  {
    badge: string;
    cardBorder: string;
    glow: string;
    accentText: string;
    barGradient: string;
    stampColor: string;
    radarAccent: string;
    radarFill: string;
    hologramIntensity: number;
  }
> = {
  LR: {
    badge: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black shadow-sm',
    cardBorder: 'border-2 border-amber-400/90 shadow-2xl shadow-amber-500/15',
    glow: 'from-amber-400/15 via-yellow-200/5 to-transparent',
    accentText: 'text-amber-600',
    barGradient: 'from-amber-400 to-yellow-500',
    stampColor: 'border-amber-600 text-amber-600',
    radarAccent: '#D97706',
    radarFill: 'rgba(217, 119, 6, 0.22)',
    hologramIntensity: 1.0,
  },
  UR: {
    badge: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black shadow-sm',
    cardBorder: 'border-2 border-rose-400/90 shadow-2xl shadow-rose-500/15',
    glow: 'from-rose-500/15 via-pink-200/5 to-transparent',
    accentText: 'text-rose-600',
    barGradient: 'from-rose-500 to-pink-500',
    stampColor: 'border-rose-600 text-rose-600',
    radarAccent: '#E11D48',
    radarFill: 'rgba(225, 29, 72, 0.22)',
    hologramIntensity: 0.9,
  },
  SSR: {
    badge: 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black shadow-sm',
    cardBorder: 'border-2 border-amber-300 shadow-xl shadow-amber-500/10',
    glow: 'from-amber-400/10 via-orange-100/5 to-transparent',
    accentText: 'text-amber-600',
    barGradient: 'from-amber-400 to-orange-400',
    stampColor: 'border-amber-600 text-amber-600',
    radarAccent: '#EA580C',
    radarFill: 'rgba(234, 88, 12, 0.22)',
    hologramIntensity: 0.75,
  },
  SR: {
    badge: 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-black shadow-sm',
    cardBorder: 'border border-indigo-200 shadow-lg',
    glow: 'from-indigo-500/10 via-blue-100/5 to-transparent',
    accentText: 'text-indigo-600',
    barGradient: 'from-indigo-500 to-blue-600',
    stampColor: 'border-indigo-600 text-indigo-600',
    radarAccent: '#4F46E5',
    radarFill: 'rgba(79, 70, 229, 0.20)',
    hologramIntensity: 0.55,
  },
  R: {
    badge: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black shadow-sm',
    cardBorder: 'border border-emerald-200 shadow-md',
    glow: 'from-emerald-500/10 via-teal-100/5 to-transparent',
    accentText: 'text-emerald-600',
    barGradient: 'from-emerald-500 to-teal-600',
    stampColor: 'border-emerald-700 text-emerald-700',
    radarAccent: '#059669',
    radarFill: 'rgba(5, 150, 105, 0.20)',
    hologramIntensity: 0.4,
  },
  N: {
    badge: 'bg-slate-700 text-white font-bold',
    cardBorder: 'border border-slate-200 shadow-sm',
    glow: 'from-slate-500/5 to-transparent',
    accentText: 'text-slate-800',
    barGradient: 'from-slate-600 to-slate-800',
    stampColor: 'border-slate-700 text-slate-700',
    radarAccent: '#334155',
    radarFill: 'rgba(51, 65, 85, 0.20)',
    hologramIntensity: 0.25,
  },
};

const AURA_COLOR_MAP: Record<
  string,
  { bg: string; border: string; text: string; glow: string; badge: string; rankBadge: string }
> = {
  amber: {
    bg: 'bg-amber-50/80',
    border: 'border-amber-300',
    text: 'text-amber-950',
    glow: 'shadow-amber-500/10',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    rankBadge: 'bg-amber-400 text-slate-950 font-black',
  },
  rose: {
    bg: 'bg-rose-50/80',
    border: 'border-rose-300',
    text: 'text-rose-950',
    glow: 'shadow-rose-500/10',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    rankBadge: 'bg-rose-500 text-white font-black',
  },
  indigo: {
    bg: 'bg-indigo-50/80',
    border: 'border-indigo-300',
    text: 'text-indigo-950',
    glow: 'shadow-indigo-500/10',
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    rankBadge: 'bg-indigo-600 text-white font-black',
  },
  emerald: {
    bg: 'bg-emerald-50/80',
    border: 'border-emerald-300',
    text: 'text-emerald-950',
    glow: 'shadow-emerald-500/10',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rankBadge: 'bg-emerald-600 text-white font-black',
  },
  purple: {
    bg: 'bg-purple-50/80',
    border: 'border-purple-300',
    text: 'text-purple-950',
    glow: 'shadow-purple-500/10',
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
    rankBadge: 'bg-purple-600 text-white font-black',
  },
  cyan: {
    bg: 'bg-cyan-50/80',
    border: 'border-cyan-300',
    text: 'text-cyan-950',
    glow: 'shadow-cyan-500/10',
    badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    rankBadge: 'bg-cyan-600 text-white font-black',
  },
};

export const AppraisalCard: React.FC<AppraisalCardProps> = ({ result }) => {
  const theme = RARITY_THEMES[result.rarity];

  const [animatedPrice, setAnimatedPrice] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'auras' | 'breakdown'>('stats');
  const [selectedCharIndex, setSelectedCharIndex] = useState<number>(0);

  useEffect(() => {
    if (result.rarity === 'LR' || result.rarity === 'UR' || result.rarity === 'SSR') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2400);
      return () => clearTimeout(timer);
    }
  }, [result.id, result.rarity]);

  // Smooth number count-up animation
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 650;
    const targetPrice = result.price;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setAnimatedPrice(Math.floor(ease * targetPrice));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setAnimatedPrice(targetPrice);
        soundFX.playStamp();
      }
    };

    requestAnimationFrame(step);
  }, [result.id, result.price]);

  return (
    <div className="w-full">
      <motion.div
        id="certificate-container"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`AppraisalCard relative w-full bg-[#FCFBF8] rounded-3xl overflow-hidden shadow-xl transition-shadow ${theme.cardBorder}`}
      >
        {/* Confetti Celebration Particle Layer */}
        {showConfetti && <ConfettiBurst />}

        {/* Realistic Fine Paper Grain & Fiber Noise Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-45 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.09'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Subtle Certificate Security Watermark Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#1e293b 0.75px, transparent 0.75px), radial-gradient(#1e293b 0.75px, transparent 0.75px)`,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          }}
        />

        {/* Warm Certificate Paper Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-amber-500/[0.02] via-transparent to-amber-900/[0.035]" />

        {/* Subtle Ambient Radial Glow */}
        <div
          className={`absolute inset-0 bg-radial ${theme.glow} pointer-events-none opacity-70`}
        />

        {/* Hologram & Gloss Reflection Layer (Always active, completely stable) */}
        <div
          className="absolute inset-0 pointer-events-none z-10 animate-hologram-shimmer"
          style={{
            mixBlendMode: 'color-dodge',
            opacity: 0.35 * theme.hologramIntensity,
            background: `
              radial-gradient(circle 420px at 50% 30%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 75%),
              linear-gradient(135deg, 
                rgba(255, 0, 128, 0.16) 0%, 
                rgba(255, 215, 0, 0.24) 20%, 
                rgba(0, 255, 180, 0.26) 42%, 
                rgba(0, 150, 255, 0.24) 65%, 
                rgba(220, 0, 255, 0.20) 85%, 
                rgba(255, 0, 128, 0.16) 100%
              ),
              repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255, 255, 255, 0.06) 5px, rgba(255, 255, 255, 0.06) 8px)
            `,
          }}
        />

        {/* Decorative Security Corner Borders */}
        <div className="absolute top-3.5 left-3.5 w-4 h-4 border-t-2 border-l-2 border-slate-300 pointer-events-none" />
        <div className="absolute top-3.5 right-3.5 w-4 h-4 border-t-2 border-r-2 border-slate-300 pointer-events-none" />
        <div className="absolute bottom-3.5 left-3.5 w-4 h-4 border-b-2 border-l-2 border-slate-300 pointer-events-none" />
        <div className="absolute bottom-3.5 right-3.5 w-4 h-4 border-b-2 border-r-2 border-slate-300 pointer-events-none" />

        {/* Card Content */}
        <div className="relative p-6 sm:p-9 space-y-6 z-20">
          {/* Certificate Meta Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-extrabold text-slate-800 tracking-wide">
                名前査定ドットコム 公式鑑定証
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono-num text-[11px] sm:text-xs">
              <span>{result.certificateNumber}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{result.timestamp}</span>
            </div>
          </div>

          {/* Name, Title & Rarity Row with Large Stamp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-lg">
              <p className="text-xs font-bold text-amber-800 tracking-wide">
                {result.titleBadge}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight break-words">
                {result.name}
              </h2>
            </div>

            {/* Rarity Emblem & Big Hanko Stamp */}
            <div className="flex items-center gap-3.5 shrink-0 self-start sm:self-center">
              <div className="text-right">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  RARITY TIER
                </span>
                <span
                  className={`inline-block px-3 py-1 rounded-lg text-xs font-black tracking-wider ${theme.badge}`}
                >
                  {result.rarity} · {result.raritySub}
                </span>
              </div>

              {/* Traditional Japanese Hanko Stamp */}
              <div
                className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 sm:border-[5px] flex flex-col items-center justify-center font-black select-none shrink-0 shadow-lg animate-stamp ${theme.stampColor}`}
                aria-label="架空鑑定済印"
              >
                <span className="tracking-[0.25em] pl-1 text-sm sm:text-lg font-black leading-none">架空</span>
                <span className="border-y-2 sm:border-y-4 border-current px-3 sm:px-4 py-1 sm:py-1.5 my-1 sm:my-1.5 text-base sm:text-2xl font-black tracking-widest leading-none">
                  鑑定済
                </span>
                <span className="tracking-[0.25em] pl-1 text-sm sm:text-lg font-black leading-none">極印</span>
              </div>
            </div>
          </div>

          {/* Highlight Price Section */}
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-5 sm:p-7 border border-slate-200/80 text-center sm:text-left transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs text-slate-500 font-bold mb-1">
              <span>推定架空市場価値</span>
              <span className="font-mono-num text-[11px] text-slate-400">
                算出値：{result.formattedYen}
              </span>
            </div>

            <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 font-mono-num tracking-tight py-1">
              {formatJapaneseCurrency(animatedPrice)}
            </div>

            {/* National Rank & Deviation Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1 font-bold text-slate-900 font-mono-num">
                全国偏差値 <strong className="text-sm font-black">{result.deviationValue}</strong>
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-bold text-amber-700">{result.topPercentile}</span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-2 text-xs sm:text-sm text-slate-700">
              <span className="font-bold text-slate-500 text-xs shrink-0">価値換算</span>
              <span className="text-slate-300">|</span>
              <span className="font-medium truncate">
                <strong className="font-bold text-slate-900">{result.equivalentItem}</strong>
              </span>
            </div>
          </div>

          {/* Tab Switcher: 3 Clean Tabs (ステータス分析 vs 言霊オーラ vs 査定内訳明細) */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('stats');
                    soundFX.playPop();
                  }}
                  className={`px-3 sm:px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'stats'
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ステータス
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('auras');
                    soundFX.playPop();
                  }}
                  className={`px-3 sm:px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'auras'
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  言霊オーラ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('breakdown');
                    soundFX.playPop();
                  }}
                  className={`px-3 sm:px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'breakdown'
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  算定内訳
                </button>
              </div>

              <span className="text-[11px] font-bold text-slate-400">
                {activeTab === 'stats'
                  ? '5大ポテンシャル指標'
                  : activeTab === 'auras'
                  ? '文字ごとの言霊波動解析'
                  : '計算明細書'}
              </span>
            </div>

            {/* Tab 1: Stats & Radar View */}
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center pt-1">
                {/* Radar Chart */}
                <div className="md:col-span-5 flex flex-col items-center justify-center">
                  <RadarChart
                    stats={result.stats}
                    accentColor={theme.radarAccent}
                    fillColor={theme.radarFill}
                  />
                </div>

                {/* Progress Bars */}
                <div className="md:col-span-7 space-y-2.5">
                  {result.stats.map((stat, i) => (
                    <div
                      key={stat.key}
                      className="bg-white rounded-xl border border-slate-100 p-2.5 space-y-1 shadow-2xs"
                    >
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-bold text-slate-800">{stat.label}</span>
                        <span className="font-mono-num font-black text-slate-950">
                          <span className={`mr-1 font-bold ${theme.accentText}`}>
                            {stat.rank}
                          </span>
                          {stat.score}点
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.score}%` }}
                          transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease: 'easeOut' }}
                          className={`h-full rounded-full bg-gradient-to-r ${theme.barGradient}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Character Aura Analysis */}
            {activeTab === 'auras' && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {result.characterAuras.map((aura, idx) => {
                    const colorStyle = AURA_COLOR_MAP[aura.auraColor] || AURA_COLOR_MAP.amber;
                    const isSelected = selectedCharIndex === idx;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedCharIndex(idx);
                          soundFX.playPop();
                        }}
                        className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                          colorStyle.bg
                        } ${
                          isSelected
                            ? `${colorStyle.border} ring-2 ${colorStyle.glow} shadow-sm scale-[1.02]`
                            : 'border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-3xl font-black text-slate-950 leading-none">
                            {aura.char}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${colorStyle.rankBadge}`}
                          >
                            {aura.rank}
                          </span>
                        </div>
                        <div className="mt-2 space-y-0.5">
                          <div className={`text-[11px] font-black ${colorStyle.text} truncate`}>
                            {aura.attribute}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium truncate">
                            {aura.role}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Character Aura Inspector */}
                {result.characterAuras[selectedCharIndex] && (
                  <motion.div
                    key={selectedCharIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200/80 space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                        {result.characterAuras[selectedCharIndex].char}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {result.characterAuras[selectedCharIndex].attribute}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono-num">
                        · スコア {result.characterAuras[selectedCharIndex].score}点
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {result.characterAuras[selectedCharIndex].meaning}
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Tab 3: Itemized Calculation Breakdown */}
            {activeTab === 'breakdown' && (
              <div className="space-y-2.5 pt-1">
                {result.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-slate-100 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 shadow-2xs"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500 leading-relaxed">
                        {item.detail}
                      </div>
                    </div>
                    <div
                      className={`font-mono-num text-sm font-black shrink-0 ${
                        item.isMultiplier ? 'text-rose-600' : 'text-slate-900'
                      }`}
                    >
                      {item.amountText}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appraisal Reasons List */}
          <div className="pt-2 space-y-2.5">
            <div className="text-xs font-bold text-slate-500">
              鑑定士からの寸評
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed bg-white/70 rounded-2xl p-4 border border-slate-100">
              {result.reasons.map((reason, idx) => (
                <p key={idx} className="flex items-start gap-2">
                  <span className="text-slate-400 mt-1 shrink-0 text-xs">·</span>
                  <span>{reason}</span>
                </p>
              ))}
              <div className="pt-2 mt-2 border-t border-slate-200/60 text-xs text-slate-500 flex items-center gap-2">
                <span className="font-bold text-slate-600">ラッキーアイテム</span>
                <span className="text-slate-300">|</span>
                <strong className="text-slate-800 font-bold">{result.luckyItem}</strong>
              </div>
            </div>
          </div>

          {/* Bottom Security & Disclaimer */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400">
            <span>※エンタメ目的の架空査定です（個人情報・入力データ保存なし）</span>
            <span className="font-bold text-slate-600">#名前査定ドットコム</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

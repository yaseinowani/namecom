import React from 'react';
import { StatusMetric } from '../utils/appraiser';

interface RadarChartProps {
  stats: StatusMetric[];
  accentColor?: string;
  fillColor?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  stats,
  accentColor = '#D97706',
  fillColor = 'rgba(217, 119, 6, 0.2)',
}) => {
  const size = 190;
  const center = size / 2;
  const radius = 62;
  const count = stats.length;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const levels = [25, 50, 75, 100];
  const dataPoints = stats.map((s, i) => getPoint(i, s.score));
  const polygonPoints = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div className="relative flex items-center justify-center select-none py-1">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        aria-label="ステータスレーダーチャート"
      >
        {/* Background concentric polygons */}
        {levels.map((lvl) => {
          const pts = stats
            .map((_, i) => {
              const p = getPoint(i, lvl);
              return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
            })
            .join(' ');
          return (
            <polygon
              key={lvl}
              points={pts}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth={lvl === 100 ? '1.5' : '1'}
              strokeDasharray={lvl < 100 ? '2 2' : undefined}
            />
          );
        })}

        {/* Axis radial lines */}
        {stats.map((_, i) => {
          const end = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="#E2E8F0"
              strokeWidth="1"
            />
          );
        })}

        {/* Filled Data Polygon */}
        <polygon
          points={polygonPoints}
          fill={fillColor}
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Vertex Dots */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3.5"
            fill="#FFFFFF"
            stroke={accentColor}
            strokeWidth="2.5"
          />
        ))}

        {/* Labels */}
        {stats.map((s, i) => {
          const labelPos = getPoint(i, 126);
          return (
            <g key={s.key}>
              <text
                x={labelPos.x}
                y={labelPos.y - 4}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-slate-600 text-[10px] font-bold"
              >
                {s.label}
              </text>
              <text
                x={labelPos.x}
                y={labelPos.y + 8}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-slate-900 text-[10px] font-black font-mono-num"
              >
                {s.score}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

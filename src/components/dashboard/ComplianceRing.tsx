'use client';

import { useEffect, useRef } from 'react';

interface ComplianceRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
  animate?: boolean;
}

export default function ComplianceRing({
  percentage,
  size = 100,
  strokeWidth = 8,
  color = '#2D6A4F',
  label,
  sublabel,
  animate = true,
}: ComplianceRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    if (!animate || !circleRef.current) return;
    const el = circleRef.current;
    el.style.strokeDashoffset = String(circumference);
    el.style.transition = 'none';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'stroke-dashoffset 1s ease-out';
        el.style.strokeDashoffset = String(offset);
      });
    });
  }, [percentage, circumference, offset, animate]);

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-label={`Compliance: ${percentage}%`} role="img">
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#E2D9CC"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? circumference : offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className="font-mono font-bold leading-none"
          style={{ fontSize: size * 0.2, color }}
        >
          {percentage}%
        </span>
        {sublabel && (
          <span
            className="text-gray-400 leading-tight mt-0.5"
            style={{ fontSize: size * 0.1 }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}

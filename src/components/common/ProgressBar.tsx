import React, { useId } from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  sublabel?: string;
  variant?: 'primary' | 'accent' | 'warning' | 'danger';
  height?: number;
  showPercentText?: boolean;
  ariaLabel?: string;
  id?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  sublabel,
  variant = 'primary',
  height = 8,
  showPercentText = true,
  ariaLabel,
  id
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const generatedId = useId();
  const labelElementId = id || `progress-label-${generatedId.replace(/:/g, '')}`;
  const accessibleName = ariaLabel || label || 'Progress';

  const getColor = () => {
    switch (variant) {
      case 'accent': return 'var(--accent)';
      case 'warning': return 'var(--warning)';
      case 'danger': return 'var(--danger)';
      default: return 'var(--primary)';
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {(label || showPercentText) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          {label && (
            <span
              id={labelElementId}
              style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}
            >
              {label}
            </span>
          )}
          {showPercentText && (
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {clampedValue}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={accessibleName}
        {...(label ? { 'aria-labelledby': labelElementId } : {})}
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: 'var(--border-light)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${clampedValue}%`,
            backgroundColor: getColor(),
            borderRadius: 'var(--radius-full)',
            transition: 'width 300ms ease-in-out'
          }}
        />
      </div>
      {sublabel && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.3rem' }}>
          {sublabel}
        </div>
      )}
    </div>
  );
};

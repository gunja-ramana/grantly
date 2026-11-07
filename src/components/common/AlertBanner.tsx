import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

interface AlertBannerProps {
  type?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'info',
  title,
  children,
  action,
  className = ''
}) => {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'var(--success-soft)',
          border: 'rgba(37, 132, 90, 0.25)',
          color: 'var(--success)',
          icon: <CheckCircle2 size={18} />
        };
      case 'warning':
        return {
          bg: 'var(--warning-soft)',
          border: 'rgba(214, 154, 56, 0.25)',
          color: '#9C6710',
          icon: <AlertTriangle size={18} />
        };
      case 'danger':
        return {
          bg: 'var(--danger-soft)',
          border: 'rgba(206, 90, 90, 0.25)',
          color: 'var(--danger)',
          icon: <AlertCircle size={18} />
        };
      default:
        return {
          bg: 'var(--info-soft)',
          border: 'rgba(43, 108, 176, 0.25)',
          color: 'var(--info)',
          icon: <Info size={18} />
        };
    }
  };

  const style = getStyles();

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem',
        padding: '0.9rem 1.15rem',
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: 'var(--radius-md)',
        fontSize: '0.88rem',
        lineHeight: 1.5
      }}
      role="alert"
    >
      <div style={{ color: style.color, flexShrink: 0, marginTop: '2px' }}>
        {style.icon}
      </div>
      <div style={{ flex: 1, color: 'var(--text)' }}>
        {title && (
          <div style={{ fontWeight: 700, color: style.color, marginBottom: '0.2rem' }}>
            {title}
          </div>
        )}
        <div>{children}</div>
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
};

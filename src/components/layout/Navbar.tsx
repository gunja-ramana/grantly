import React, { useState } from 'react';
import { Menu, User, DollarSign, Calendar, CheckCircle2, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { InnovationHubModal } from '../common/InnovationHubModal';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { state, fundingMetrics, opportunityDNA, nearestUpcomingDeadline } = useApp();
  const location = useLocation();
  const [isInnovationModalOpen, setIsInnovationModalOpen] = useState(false);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Student Dashboard';
      case '/discover': return 'Scholarship Discovery';
      case '/applications': return 'My Applications';
      case '/calendar': return 'Deadline Calendar';
      case '/documents': return 'Document Vault';
      case '/assistant': return 'Opportunity Assistant';
      case '/insights': return 'Funding Insights & Simulator';
      case '/profile': return 'Student Profile & Opportunity DNA';
      case '/settings': return 'System Settings & Data';
      default: return 'Opportunity Intelligence';
    }
  };

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleMobileMenu}
          className="btn-icon"
          aria-label="Toggle Navigation Menu"
          style={{ display: 'none' }}
          id="mobile-menu-btn"
        >
          <Menu size={22} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
            {getPageTitle()}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            GRANTLY Intelligence v1.0 • Client-Side Persistence
          </span>
        </div>
      </div>

      {/* Right Stats & Profile Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Next Urgent Deadline Pill - Shared Single Source of Truth */}
        {nearestUpcomingDeadline && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.75rem',
              backgroundColor: 'var(--warning-soft)',
              border: '1px solid rgba(214, 154, 56, 0.25)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              color: '#9C6710',
              fontWeight: 600
            }}
            title={`Next deadline: ${nearestUpcomingDeadline.scholarshipTitle} on ${nearestUpcomingDeadline.deadlineDate}`}
          >
            <Calendar size={14} />
            <span>Next: {nearestUpcomingDeadline.daysRemaining}d ({nearestUpcomingDeadline.provider.replace(/\s*\(Sample\)/, '').substring(0, 14)}...)</span>
          </div>
        )}

        {/* Received Funding Confirmed */}
        {fundingMetrics.receivedFunding > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              backgroundColor: 'var(--success-soft)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              color: 'var(--success)',
              fontWeight: 700,
              border: '1px solid rgba(37, 132, 90, 0.2)'
            }}
            title={`Confirmed received disbursements: $${fundingMetrics.receivedFunding.toLocaleString()}`}
          >
            <CheckCircle2 size={14} />
            <span>${fundingMetrics.receivedFunding.toLocaleString()} Received</span>
          </div>
        )}

        {/* Potential Funding Pill (Not Awarded) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.4rem 0.75rem',
            backgroundColor: 'var(--primary-soft)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            color: 'var(--primary)',
            fontWeight: 700
          }}
          title={`Potential opportunities tracked (not yet awarded): $${fundingMetrics.potentialFunding.toLocaleString()}`}
        >
          <DollarSign size={14} />
          <span>${fundingMetrics.potentialFunding.toLocaleString()} Potential</span>
        </div>

        {/* Innovations Showcase Trigger */}
        <button
          onClick={() => setIsInnovationModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.8rem',
            backgroundColor: 'var(--accent)',
            color: 'var(--primary)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          title="Explore GRANTLY 5 Signature Intelligence Innovations"
        >
          <Sparkles size={14} />
          <span>Innovations</span>
        </button>

        {/* Profile Link with Unified Opportunity DNA Completeness */}
        <Link
          to="/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.35rem 0.75rem',
            backgroundColor: 'var(--surface-subtle)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            textDecoration: 'none',
            transition: 'background var(--transition-fast)'
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            {state.profile.fullName ? state.profile.fullName.charAt(0) : <User size={15} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.1 }}>
              {state.profile.fullName || 'Student'}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {opportunityDNA.profileCompleteness}% Profile
            </span>
          </div>
        </Link>
      </div>

      <InnovationHubModal
        isOpen={isInnovationModalOpen}
        onClose={() => setIsInnovationModalOpen(false)}
      />

      <style>{`
        @media (max-width: 900px) {
          #mobile-menu-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
};

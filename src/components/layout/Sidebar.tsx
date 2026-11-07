import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  FileCheck2,
  Calendar,
  FolderLock,
  Sparkles,
  BarChart3,
  UserCheck,
  Settings,
  GraduationCap,
  BookmarkCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { state, momentumStats } = useApp();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { to: '/discover', label: 'Discover Scholarships', icon: <Compass size={19} />, badge: '10' },
    {
      to: '/applications',
      label: 'My Applications',
      icon: <FileCheck2 size={19} />,
      badge: state.applications.length > 0 ? `${state.applications.length}` : undefined
    },
    { to: '/calendar', label: 'Deadline Calendar', icon: <Calendar size={19} /> },
    {
      to: '/documents',
      label: 'Document Vault',
      icon: <FolderLock size={19} />,
      badge: state.documents.length > 0 ? `${state.documents.length}` : undefined
    },
    { to: '/assistant', label: 'Opportunity Assistant', icon: <Sparkles size={19} /> },
    { to: '/insights', label: 'Funding Insights', icon: <BarChart3 size={19} /> },
    { to: '/profile', label: 'Student Profile & DNA', icon: <UserCheck size={19} /> },
    { to: '/settings', label: 'Settings & Data', icon: <Settings size={19} /> }
  ];

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderBottom: '1px solid var(--border-light)'
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(23, 76, 58, 0.25)'
          }}
        >
          <GraduationCap size={22} />
        </div>
        <div>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--primary)'
            }}
          >
            GRANTLY
          </span>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Student Opportunity Intel
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav
        style={{
          flex: 1,
          padding: '1rem 0.75rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}
        aria-label="Sidebar Navigation"
      >
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onCloseMobile}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              backgroundColor: isActive ? 'var(--primary-soft)' : 'transparent',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.9rem',
              transition: 'all var(--transition-fast)'
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ display: 'flex' }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--surface-subtle)',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  border: '1px solid var(--border)'
                }}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Mini Momentum Card */}
      <div
        style={{
          padding: '1rem',
          margin: '0.75rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--surface-subtle)',
          border: '1px solid var(--border-light)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>
            Momentum: {momentumStats.momentumLevel}
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--secondary)' }}>
            {momentumStats.momentumScore}/100
          </span>
        </div>
        <div
          style={{
            height: '6px',
            backgroundColor: 'var(--border)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${momentumStats.momentumScore}%`,
              backgroundColor: 'var(--primary)',
              borderRadius: 'var(--radius-full)'
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.65rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}
        >
          <BookmarkCheck size={14} color="var(--primary)" />
          <span>{state.bookmarkedScholarshipIds.length} Saved Opportunities</span>
        </div>
      </div>
    </aside>
  );
};

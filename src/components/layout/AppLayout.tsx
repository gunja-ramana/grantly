import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Accessible Keyboard Skip Link */}
      <a href="#main-content-region" className="skip-link">
        Skip to main content
      </a>

      {/* Desktop Sidebar */}
      <div className="desktop-sidebar-wrapper">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setMobileMenuOpen(false)}
          role="presentation"
        >
          <div
            className="mobile-drawer-content"
            onClick={e => e.stopPropagation()}
          >
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)} />
        <main className="page-wrapper" id="main-content-region" tabIndex={-1} style={{ outline: 'none' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        .desktop-sidebar-wrapper {
          display: block;
        }
        .mobile-drawer-overlay {
          display: none;
        }
        @media (max-width: 900px) {
          .desktop-sidebar-wrapper {
            display: none;
          }
          .mobile-drawer-overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(23, 40, 32, 0.4);
            z-index: 100;
          }
          .mobile-drawer-content {
            width: 280px;
            height: 100%;
            background-color: #fff;
            animation: slideInLeft 200ms ease-out;
          }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

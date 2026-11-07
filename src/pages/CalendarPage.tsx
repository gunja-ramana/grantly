import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Scholarship } from '../types';
import { ScholarshipDetailModal } from '../components/scholarships/ScholarshipDetailModal';

export const CalendarPage: React.FC = () => {
  const { scholarships, state } = useApp();
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  // Month navigation: initialize to November 2026 (matching dataset dates)
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 10, 1)); // Nov 2026

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleResetToday = () => {
    setCurrentDate(new Date(2026, 10, 1)); // Default demo current month
  };

  // Build calendar matrix
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday

  // Group scholarships by deadline date YYYY-MM-DD
  const deadlinesByDate = useMemo(() => {
    const map: Record<string, Scholarship[]> = {};
    scholarships.forEach(s => {
      const dateStr = s.applicationDeadline;
      if (!map[dateStr]) {
        map[dateStr] = [];
      }
      map[dateStr].push(s);
    });
    return map;
  }, [scholarships]);

  // Upcoming deadlines sorted by date
  const upcomingDeadlines = useMemo(() => {
    const today = new Date();
    return scholarships
      .map(s => {
        const d = new Date(s.applicationDeadline);
        const days = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const app = state.applications.find(a => a.scholarshipId === s.id);
        const isBookmarked = state.bookmarkedScholarshipIds.includes(s.id);
        return {
          scholarship: s,
          daysRemaining: days,
          isOverdue: days < 0,
          application: app,
          isBookmarked
        };
      })
      .sort((a, b) => new Date(a.scholarship.applicationDeadline).getTime() - new Date(b.scholarship.applicationDeadline).getTime());
  }, [scholarships, state.applications, state.bookmarkedScholarshipIds]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Deadline Calendar
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Track application cutoff dates, priority rounds, and document submission timelines.
          </p>
        </div>

        {/* Month Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Button variant="secondary" size="sm" onClick={handlePrevMonth} aria-label="Previous Month">
            <ChevronLeft size={16} />
          </Button>
          <span style={{ fontSize: '1.05rem', fontWeight: 700, minWidth: '150px', textAlign: 'center' }}>
            {monthNames[currentMonth]} {currentYear}
          </span>
          <Button variant="secondary" size="sm" onClick={handleNextMonth} aria-label="Next Month">
            <ChevronRight size={16} />
          </Button>
          <Button variant="soft" size="sm" onClick={handleResetToday}>
            Demo Current
          </Button>
        </div>
      </div>

      {/* Main Grid & Upcoming Side Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }} id="calendar-layout-grid">
        {/* Calendar Card */}
        <div className="card" style={{ padding: '1.25rem' }}>
          {/* Weekday Headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: 'var(--text-subtle)',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--border-light)'
            }}
          >
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
          </div>

          {/* Calendar Cells */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              paddingTop: '0.5rem'
            }}
          >
            {/* Empty prefix cells */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                style={{
                  minHeight: '85px',
                  backgroundColor: 'var(--surface-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  opacity: 0.4
                }}
              />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const formattedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayDeadlines = deadlinesByDate[formattedDateStr] || [];
              const isToday = formattedDateStr === '2026-11-07';

              return (
                <div
                  key={dayNum}
                  style={{
                    minHeight: '85px',
                    padding: '0.35rem',
                    backgroundColor: isToday ? 'var(--primary-soft)' : '#FFFFFF',
                    border: isToday ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: isToday ? 800 : 600,
                        color: isToday ? 'var(--primary)' : 'var(--text)'
                      }}
                    >
                      {dayNum}
                    </span>
                    {isToday && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary)' }}>
                        Today
                      </span>
                    )}
                  </div>

                  {/* Deadline Pills */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                    {dayDeadlines.map(sch => (
                      <div
                        key={sch.id}
                        onClick={() => setSelectedScholarship(sch)}
                        title={`${sch.title} ($${sch.awardAmount.toLocaleString()})`}
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.35rem',
                          borderRadius: '4px',
                          backgroundColor: 'var(--warning-soft)',
                          color: '#9C6710',
                          border: '1px solid rgba(214, 154, 56, 0.3)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          cursor: 'pointer'
                        }}
                      >
                        {sch.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Deadlines Side Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Clock size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Upcoming Schedule</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '560px' }}>
            {upcomingDeadlines.map(({ scholarship, daysRemaining, isOverdue, application, isBookmarked }) => (
              <div
                key={scholarship.id}
                style={{
                  padding: '0.75rem 0.85rem',
                  backgroundColor: 'var(--surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <h4
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: 'var(--text)',
                      cursor: 'pointer',
                      lineHeight: 1.3
                    }}
                    onClick={() => setSelectedScholarship(scholarship)}
                  >
                    {scholarship.title}
                  </h4>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  {scholarship.provider} • <strong>${scholarship.awardAmount.toLocaleString()}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: isOverdue ? 'var(--danger)' : daysRemaining <= 14 ? 'var(--warning)' : 'var(--text)'
                    }}
                  >
                    {scholarship.applicationDeadline} ({isOverdue ? 'Overdue' : `${daysRemaining}d remaining`})
                  </span>

                  {application ? (
                    <Badge variant="emerald">{application.status}</Badge>
                  ) : isBookmarked ? (
                    <Badge variant="accent">Saved</Badge>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => setSelectedScholarship(scholarship)}>
                      View
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 950px) {
          #calendar-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Detail Modal */}
      <ScholarshipDetailModal
        scholarship={selectedScholarship}
        isOpen={Boolean(selectedScholarship)}
        onClose={() => setSelectedScholarship(null)}
      />
    </div>
  );
};

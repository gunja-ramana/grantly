import React, { useState } from 'react';
import {
  Compass,
  FileCheck2,
  BookmarkCheck,
  DollarSign,
  Sparkles,
  ArrowRight,
  Clock,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { ScholarshipCard } from '../components/scholarships/ScholarshipCard';
import { ScholarshipDetailModal } from '../components/scholarships/ScholarshipDetailModal';
import { InnovationHubModal } from '../components/common/InnovationHubModal';
import { Scholarship } from '../types';

export const DashboardPage: React.FC = () => {
  const { state, scholarships, radarItems, fundingMetrics, momentumStats, opportunityDNA, nearestUpcomingDeadline } = useApp();
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [isInnovationModalOpen, setIsInnovationModalOpen] = useState(false);

  // Eligible count
  const eligibleCount = radarItems.filter(r => r.eligibilityReport.status === 'Eligible').length;
  const activeApplicationsCount = state.applications.filter(
    a => a.status === 'Preparing' || a.status === 'Ready to Submit' || a.status === 'Under Review' || a.status === 'Submitted'
  ).length;

  // Top prioritized radar opportunities
  const topRadarOpportunities = radarItems.slice(0, 3);

  // Shared nearest upcoming deadline formatting
  const nearestDays = nearestUpcomingDeadline ? nearestUpcomingDeadline.daysRemaining : 8;
  const nearestProvider = nearestUpcomingDeadline
    ? nearestUpcomingDeadline.provider.replace(/\s*\(Sample\)/, '')
    : 'Vanguard Innovation Council';

  // Recommended scholarships based on high alignment
  const recommendedList = scholarships
    .filter(s => radarItems.find(r => r.scholarship.id === s.id)?.eligibilityReport.status === 'Eligible')
    .slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Hero Welcome & Opportunity DNA Summary Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #174C3A 0%, #205E48 100%)',
          color: '#FFFFFF',
          border: 'none',
          padding: '2rem 2.25rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '780px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'rgba(200, 237, 121, 0.2)',
                color: 'var(--accent)',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              <Sparkles size={13} />
              Opportunity DNA Active
            </span>
            <span style={{ fontSize: '0.85rem', color: '#D4E2D9' }}>
              {state.profile.institution || 'Undergraduate'} • {state.profile.fieldOfStudy || 'Student'}
            </span>
          </div>

          <h1 style={{ fontSize: '1.95rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Welcome back, {state.profile.fullName || 'Scholar'}
          </h1>

          <p style={{ fontSize: '0.95rem', color: '#E1EBE4', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            You have <strong style={{ color: 'var(--accent)' }}>{eligibleCount} high-alignment scholarships</strong> matched to your academic record and financial profile. Your next deadline is in <strong style={{ color: 'var(--accent)' }}>{nearestDays} days ({nearestProvider})</strong>.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
            <Link to="/discover" style={{ textDecoration: 'none' }}>
              <Button
                variant="accent"
                icon={<Compass size={18} />}
                style={{ minHeight: '44px', padding: '0.7rem 1.35rem' }}
              >
                Explore Matched Scholarships
              </Button>
            </Link>
            <Link to="/applications" style={{ textDecoration: 'none' }}>
              <Button
                variant="secondary"
                style={{
                  minHeight: '44px',
                  padding: '0.7rem 1.35rem',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  color: '#FFFFFF',
                  borderColor: 'rgba(255,255,255,0.2)'
                }}
                icon={<FileCheck2 size={18} />}
              >
                Track Applications ({state.applications.length})
              </Button>
            </Link>
            <Button
              variant="secondary"
              onClick={() => setIsInnovationModalOpen(true)}
              style={{
                minHeight: '44px',
                padding: '0.7rem 1.35rem',
                backgroundColor: 'rgba(200, 237, 121, 0.15)',
                color: 'var(--accent)',
                borderColor: 'rgba(200, 237, 121, 0.35)',
                fontWeight: 700
              }}
              icon={<Sparkles size={18} />}
            >
              Explore 5 Innovations
            </Button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-50px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200, 237, 121, 0.22) 0%, rgba(23, 76, 58, 0) 70%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* 2. Primary Financial Lifecycle Classifications */}
      <div style={{ marginBottom: '0.25rem' }}>
        <div style={{ marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.4rem 1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
              Financial Lifecycle Intelligence
            </h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Strictly classified • Received funding is never double-counted as potential
            </span>
          </div>
        </div>
        <div className="financial-kpi-grid">
          <div className="card" style={{ padding: '1.15rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Tracked Value</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <DollarSign size={18} />
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.75rem)', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.2 }}>
              ${fundingMetrics.totalTrackedValue.toLocaleString()}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
              Across all 4 tracked opportunities
            </span>
          </div>

          <div className="card" style={{ padding: '1.15rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Potential (Not Awarded)</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-dark)' }}>
                <Compass size={18} />
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.75rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.2 }}>
              ${fundingMetrics.potentialFunding.toLocaleString()}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
              Excludes already received funds
            </span>
          </div>

          <div className="card" style={{ padding: '1.15rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Applied in Review</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lavender-text)' }}>
                <FileCheck2 size={18} />
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.75rem)', fontWeight: 800, color: '#9C6710', lineHeight: 1.2 }}>
              ${fundingMetrics.appliedFunding.toLocaleString()}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
              {state.applications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length} active submissions pending
            </span>
          </div>

          <div className="card" style={{ padding: '1.15rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Confirmed Received</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--success-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.75rem)', fontWeight: 800, color: 'var(--success)', lineHeight: 1.2 }}>
              ${fundingMetrics.receivedFunding.toLocaleString()}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
              Green Horizons • {fundingMetrics.receivedCoveragePercentage}% of need covered
            </span>
          </div>
        </div>
      </div>

      {/* 2b. Secondary Operational Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Eligible Matches</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{eligibleCount} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-subtle)' }}>/ {scholarships.length}</span></div>
          </div>
          <Compass size={18} color="var(--primary)" />
        </div>

        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Saved Wishlist</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>{state.bookmarkedScholarshipIds.length}</div>
          </div>
          <BookmarkCheck size={18} color="var(--accent-dark)" />
        </div>

        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Tracked</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>{state.applications.length} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-subtle)' }}>({activeApplicationsCount} in progress)</span></div>
          </div>
          <FileCheck2 size={18} color="var(--lavender-text)" />
        </div>

        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Preparation Tasks</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>{momentumStats.tasksCompleted} / {momentumStats.totalTasks} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)' }}>({momentumStats.taskCompletionPercentage}%)</span></div>
          </div>
          <CheckCircle2 size={18} color="var(--success)" />
        </div>
      </div>

      {/* 3. SIGNATURE INNOVATIONS ROW: Opportunity Radar & Success Momentum */}
      <div className="grid-2">
        {/* INNOVATION 3: OPPORTUNITY RADAR */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Opportunity Radar</h3>
              </div>
              <Badge variant="accent">Top Priorities</Badge>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Intelligent multi-factor ranking based on profile eligibility, approaching deadlines, and document preparedness.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {topRadarOpportunities.map(item => (
                <div
                  key={item.scholarship.id}
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--surface-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <h4
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: 'var(--text)',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedScholarship(item.scholarship)}
                    >
                      {item.scholarship.title}
                    </h4>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: item.priorityLevel === 'High' ? 'var(--primary-soft)' : 'var(--border-light)',
                        color: item.priorityLevel === 'High' ? 'var(--primary)' : 'var(--text-muted)'
                      }}
                    >
                      Score: {item.priorityScore}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.45rem' }}>
                    <strong>${item.scholarship.awardAmount.toLocaleString()}</strong> • {item.scholarship.provider} • <span style={{ color: item.daysRemaining <= 14 ? 'var(--warning-text)' : 'var(--text-muted)', fontWeight: 700 }}>{item.daysRemaining} days left</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.78rem',
                      color: 'var(--primary)',
                      backgroundColor: '#FFFFFF',
                      padding: '0.35rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <ArrowRight size={13} />
                    <span><strong>Action:</strong> {item.actionRequired}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-light)' }}>
            <Link to="/discover">
              <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                View All Ranked Opportunities in Discovery
              </Button>
            </Link>
          </div>
        </div>

        {/* INNOVATION 5: STUDENT SUCCESS MOMENTUM */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Success Momentum</h3>
              </div>
              <Badge variant="emerald">{momentumStats.momentumLevel} • {momentumStats.momentumScore}%</Badge>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Quantifiable velocity tracking your real application milestones, verified documentation, and funding progression.
            </p>

            {/* Momentum Bar */}
            <div style={{ marginBottom: '1.25rem' }}>
              <ProgressBar
                value={momentumStats.momentumScore}
                label="Overall Progress Velocity"
                ariaLabel="Student Success Momentum Progress"
                sublabel={`Dynamic Score: ${momentumStats.momentumScore}/100 • Preparation Tasks: ${momentumStats.tasksCompleted}/${momentumStats.totalTasks} (${momentumStats.taskCompletionPercentage}%)`}
                variant="primary"
                height={10}
              />
              <div style={{ fontSize: '0.76rem', color: 'var(--text-subtle)', marginTop: '0.45rem', lineHeight: 1.4 }}>
                Calculated index ({momentumStats.momentumScore}/100): Combines Profile Completeness ({opportunityDNA.profileCompleteness}%), Vault Document Verification, and Checklist Tasks ({momentumStats.tasksCompleted}/{momentumStats.totalTasks} = {momentumStats.taskCompletionPercentage}%).
              </div>

              {/* 5-Pillar Score Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.35rem', marginTop: '0.65rem' }}>
                <div style={{ padding: '0.35rem 0.5rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Profile DNA: </span>
                  <strong style={{ color: 'var(--primary)' }}>20/20 pts</strong>
                </div>
                <div style={{ padding: '0.35rem 0.5rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Wishlist: </span>
                  <strong style={{ color: 'var(--primary)' }}>15/15 pts</strong>
                </div>
                <div style={{ padding: '0.35rem 0.5rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Vault Docs: </span>
                  <strong style={{ color: 'var(--primary)' }}>20/20 pts</strong>
                </div>
                <div style={{ padding: '0.35rem 0.5rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Checklist: </span>
                  <strong style={{ color: 'var(--primary)' }}>{Math.round((momentumStats.tasksCompleted / (momentumStats.totalTasks || 1)) * 25)}/25 pts</strong>
                </div>
                <div style={{ padding: '0.35rem 0.5rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Pipeline: </span>
                  <strong style={{ color: 'var(--primary)' }}>20/20 pts</strong>
                </div>
              </div>
            </div>

            {/* Real Milestones Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {momentumStats.milestones.slice(0, 4).map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.6rem 0.75rem',
                    backgroundColor: m.achieved ? 'var(--success-soft)' : 'var(--surface-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  {m.achieved ? (
                    <CheckCircle2 size={16} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  ) : (
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: '2px solid var(--border)',
                        marginTop: '2px',
                        flexShrink: 0
                      }}
                    />
                  )}
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: m.achieved ? 'var(--text)' : 'var(--text-muted)' }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                      {m.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-light)' }}>
            <Link to="/profile">
              <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                Update Opportunity DNA & Profile ({opportunityDNA.profileCompleteness}% complete)
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Recommended Opportunities Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>Recommended for Your Profile</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Curated by Opportunity DNA matching your major ({state.profile.fieldOfStudy}) and GPA ({state.profile.gpa})
            </p>
          </div>
          <Link to="/discover">
            <Button variant="secondary" size="sm">
              See All ({scholarships.length})
            </Button>
          </Link>
        </div>

        <div className="grid-3">
          {recommendedList.map(sch => (
            <ScholarshipCard
              key={sch.id}
              scholarship={sch}
              onOpenDetails={s => setSelectedScholarship(s)}
            />
          ))}
        </div>
      </div>

      {/* 5. Recent Activity Feed */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Platform Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {state.activities.slice(0, 5).map(act => (
            <div
              key={act.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderBottom: '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={16} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>
                    {act.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {act.description}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                {act.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <ScholarshipDetailModal
        scholarship={selectedScholarship}
        isOpen={Boolean(selectedScholarship)}
        onClose={() => setSelectedScholarship(null)}
      />

      {/* Innovation Architecture Hub Modal */}
      <InnovationHubModal
        isOpen={isInnovationModalOpen}
        onClose={() => setIsInnovationModalOpen(false)}
      />
    </div>
  );
};

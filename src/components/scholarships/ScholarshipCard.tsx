import React from 'react';
import { Bookmark, BookmarkCheck, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { Scholarship, EligibilityStatus } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { evaluateEligibility } from '../../features/eligibility/engine';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onOpenDetails: (scholarship: Scholarship) => void;
  viewMode?: 'grid' | 'list';
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  onOpenDetails,
  viewMode = 'grid'
}) => {
  const { state, toggleBookmark, addApplication } = useApp();
  const isBookmarked = state.bookmarkedScholarshipIds.includes(scholarship.id);
  const application = state.applications.find(a => a.scholarshipId === scholarship.id);

  // Calculate live eligibility against student profile
  const eligibility = evaluateEligibility(scholarship, state.profile);

  // Calculate days remaining
  const today = new Date();
  const deadlineDate = new Date(scholarship.applicationDeadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isOverdue = daysRemaining < 0;

  const renderEligibilityBadge = (status: EligibilityStatus) => {
    switch (status) {
      case 'Eligible':
        return (
          <Badge variant="emerald" icon={<CheckCircle2 size={13} />}>
            Eligible ({eligibility.score}%)
          </Badge>
        );
      case 'Potentially Eligible':
        return (
          <Badge variant="accent" icon={<HelpCircle size={13} />}>
            Likely Match ({eligibility.score}%)
          </Badge>
        );
      case 'Insufficient Information':
        return (
          <Badge variant="warning" icon={<AlertCircle size={13} />}>
            Profile Incomplete
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" icon={<AlertCircle size={13} />}>
            Requirements Unmet
          </Badge>
        );
    }
  };

  if (viewMode === 'list') {
    return (
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          padding: '1.15rem 1.5rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ flex: '1 1 320px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <Badge variant="lavender">{scholarship.category}</Badge>
            {renderEligibilityBadge(eligibility.status)}
            {scholarship.isFeatured && <Badge variant="accent">Featured</Badge>}
            {scholarship.isSampleData && <Badge variant="neutral">Sample</Badge>}
          </div>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: 'var(--text)',
              marginBottom: '0.2rem'
            }}
            onClick={() => onOpenDetails(scholarship)}
          >
            {scholarship.title}
          </h3>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {scholarship.provider} • {scholarship.educationLevels.join(', ')}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600 }}>
              Award Amount
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
              ${scholarship.awardAmount.toLocaleString()}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600 }}>
              Deadline
            </div>
            <div
              style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: isOverdue ? 'var(--danger)' : daysRemaining <= 14 ? 'var(--warning-text)' : 'var(--text)'
              }}
            >
              {isOverdue ? 'Overdue' : `${daysRemaining} days left`}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Button
              variant="icon"
              onClick={() => toggleBookmark(scholarship.id)}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark scholarship'}
              title={isBookmarked ? 'Remove from saved' : 'Save opportunity'}
            >
              {isBookmarked ? <BookmarkCheck size={20} color="var(--primary)" /> : <Bookmark size={20} />}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onOpenDetails(scholarship)}>
              Details
            </Button>
            {!application ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => addApplication(scholarship.id)}
              >
                Track
              </Button>
            ) : (
              <Badge variant="emerald">{application.status}</Badge>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative'
      }}
    >
      <div>
        {/* Top Badges & Bookmark */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            <Badge variant="lavender">{scholarship.category}</Badge>
            {renderEligibilityBadge(eligibility.status)}
            {scholarship.isSampleData && <Badge variant="neutral">Sample</Badge>}
          </div>
          <button
            onClick={() => toggleBookmark(scholarship.id)}
            className="btn-icon"
            style={{
              padding: '0.35rem',
              color: isBookmarked ? 'var(--primary)' : 'var(--text-subtle)'
            }}
            title={isBookmarked ? 'Remove bookmark' : 'Save scholarship'}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Save scholarship'}
          >
            {isBookmarked ? <BookmarkCheck size={20} color="var(--primary)" /> : <Bookmark size={20} />}
          </button>
        </div>

        {/* Title & Provider */}
        <h3
          style={{
            fontSize: '1.08rem',
            fontWeight: 700,
            lineHeight: 1.35,
            color: 'var(--text)',
            marginBottom: '0.35rem',
            cursor: 'pointer',
            minHeight: '2.8rem',
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}
          onClick={() => onOpenDetails(scholarship)}
        >
          {scholarship.title}
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          {scholarship.provider} • <span style={{ fontWeight: 600 }}>{scholarship.providerType}</span>
        </p>

        {/* Summary */}
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '3.8rem'
          }}
        >
          {scholarship.summary}
        </p>

        {/* Details Pills */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            padding: '0.75rem',
            backgroundColor: 'var(--surface-subtle)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-subtle)' }}>Award Amount:</span>
            <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>
              ${scholarship.awardAmount.toLocaleString()} <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>({scholarship.awardFrequency})</span>
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-subtle)' }}>Application Deadline:</span>
            <span
              style={{
                fontWeight: 700,
                color: isOverdue ? 'var(--danger)' : daysRemaining <= 14 ? 'var(--warning-text)' : 'var(--text)'
              }}
            >
              {scholarship.applicationDeadline} ({isOverdue ? 'Passed' : `${daysRemaining}d`})
            </span>
          </div>

          {scholarship.minGpa && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-subtle)' }}>Min. GPA:</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{scholarship.minGpa.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderTop: '1px solid var(--border-light)',
          paddingTop: '0.85rem'
        }}
      >
        <Button
          variant="secondary"
          size="sm"
          style={{ flex: 1 }}
          onClick={() => onOpenDetails(scholarship)}
        >
          View Details
        </Button>
        {!application ? (
          <Button
            variant="primary"
            size="sm"
            style={{ flex: 1 }}
            onClick={() => addApplication(scholarship.id)}
          >
            Add to Tracker
          </Button>
        ) : (
          <Button
            variant="soft"
            size="sm"
            style={{ flex: 1 }}
            onClick={() => onOpenDetails(scholarship)}
          >
            Tracked ({application.status})
          </Button>
        )}
      </div>
    </div>
  );
};

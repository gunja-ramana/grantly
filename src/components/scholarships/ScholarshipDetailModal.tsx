import React, { useState } from 'react';
import {
  Scholarship,
  ApplicationStatus,
  DocumentRequirementItem
} from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { AlertBanner } from '../common/AlertBanner';
import { useApp } from '../../context/AppContext';
import { evaluateEligibility } from '../../features/eligibility/engine';
import { generateCopilotAnalysis } from '../../features/copilot/engine';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  FileText,
  Sparkles,
  CheckSquare
} from 'lucide-react';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({
  scholarship,
  isOpen,
  onClose
}) => {
  const { state, toggleBookmark, addApplication, updateApplicationStatus, updateApplicationTask } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'copilot' | 'documents'>('overview');

  if (!scholarship) return null;

  const isBookmarked = state.bookmarkedScholarshipIds.includes(scholarship.id);
  const application = state.applications.find(a => a.scholarshipId === scholarship.id);

  // Evaluate Transparent Eligibility
  const eligibility = evaluateEligibility(scholarship, state.profile);

  // Run Smart Application Copilot Analysis
  const copilot = generateCopilotAnalysis(scholarship, state.profile, state.documents, application);

  const deadlineDate = new Date(scholarship.applicationDeadline);
  const today = new Date();
  const daysRemaining = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={scholarship.title}
      subtitle={`${scholarship.provider} • ${scholarship.providerType}`}
      maxWidth="780px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toggleBookmark(scholarship.id)}
            icon={isBookmarked ? <BookmarkCheck size={16} color="var(--primary)" /> : <Bookmark size={16} />}
          >
            {isBookmarked ? 'Saved in Bookmarks' : 'Save Scholarship'}
          </Button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {!application ? (
              <Button
                variant="primary"
                onClick={() => {
                  addApplication(scholarship.id);
                  setActiveTab('copilot');
                }}
                icon={<CheckSquare size={16} />}
              >
                Add to Application Tracker
              </Button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</span>
                <select
                  value={application.status}
                  onChange={e => updateApplicationStatus(application.id, e.target.value as ApplicationStatus)}
                  className="input-control"
                  style={{ padding: '0.4rem 1.8rem 0.4rem 0.6rem', fontSize: '0.85rem' }}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Ready to Submit">Ready to Submit</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            )}
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      {scholarship.isSampleData && (
        <div style={{ marginBottom: '1rem' }}>
          <AlertBanner type="info" title="Sample Demonstration Opportunity">
            <span>
              This scholarship listing is a synthesized demonstration model compiled for the hackathon evaluation of GRANTLY. Official scholarship criteria, deadlines, and disbursements must be verified through the sponsoring institution.
            </span>
          </AlertBanner>
        </div>
      )}

      {/* Top Banner KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ padding: '0.85rem', backgroundColor: 'var(--primary-soft)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>AWARD AMOUNT</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
            ${scholarship.awardAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{scholarship.awardFrequency}</div>
        </div>

        <div style={{ padding: '0.85rem', backgroundColor: 'var(--surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>APPLICATION DEADLINE</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: daysRemaining <= 14 ? 'var(--warning-text)' : 'var(--text)' }}>
            {scholarship.applicationDeadline}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {daysRemaining < 0 ? 'Deadline passed' : `${daysRemaining} days remaining`}
          </div>
        </div>

        <div style={{ padding: '0.85rem', backgroundColor: 'var(--surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>ELIGIBILITY STATUS</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: eligibility.status === 'Eligible' ? 'var(--success)' : 'var(--text)' }}>
            {eligibility.status}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{eligibility.score}% Profile Alignment</div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border)',
          marginBottom: '1.25rem',
          overflowX: 'auto'
        }}
      >
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.65rem 1rem',
            borderBottom: activeTab === 'overview' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'overview' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'overview' ? 700 : 500,
            fontSize: '0.9rem'
          }}
        >
          Overview & Benefits
        </button>

        <button
          onClick={() => setActiveTab('eligibility')}
          style={{
            padding: '0.65rem 1rem',
            borderBottom: activeTab === 'eligibility' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'eligibility' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'eligibility' ? 700 : 500,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>Eligibility Engine</span>
          <Badge variant={eligibility.status === 'Eligible' ? 'emerald' : 'neutral'}>
            {eligibility.score}%
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab('copilot')}
          style={{
            padding: '0.65rem 1rem',
            borderBottom: activeTab === 'copilot' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'copilot' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'copilot' ? 700 : 500,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Sparkles size={15} color="var(--primary)" />
          <span>Application Copilot</span>
          <Badge variant="accent">{copilot.readinessPercentage}% Ready</Badge>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          style={{
            padding: '0.65rem 1rem',
            borderBottom: activeTab === 'documents' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'documents' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'documents' ? 700 : 500,
            fontSize: '0.9rem'
          }}
        >
          Required Documents ({scholarship.requiredDocuments.length})
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Program Summary</h4>
            <p style={{ lineHeight: 1.6, color: 'var(--text)' }}>{scholarship.description}</p>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Award Benefits</h4>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {scholarship.benefits.map((benefit, i) => (
                <li key={i} style={{ color: 'var(--text)' }}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Application Process Steps</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {scholarship.applicationProcess.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.6rem 0.85rem',
                    backgroundColor: 'var(--surface-subtle)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      flexShrink: 0
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text)' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <AlertBanner type="info" title="Official Source Attribution">
            <span>{scholarship.sourceAttribution}. This listing is verified against catalog standards.</span>
          </AlertBanner>
        </div>
      )}

      {/* Tab 2: Transparent Eligibility Engine */}
      {activeTab === 'eligibility' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <AlertBanner
            type={eligibility.status === 'Eligible' ? 'success' : eligibility.status === 'Potentially Eligible' ? 'warning' : 'info'}
            title={`Eligibility Assessment: ${eligibility.status}`}
          >
            <span>
              {eligibility.status === 'Eligible'
                ? 'Your student profile satisfies all evaluated benchmark criteria for this scholarship.'
                : 'Review the detailed rule checklist below to understand your matching status and actionable steps.'}
            </span>
          </AlertBanner>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Deterministic Rule Breakdown
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {eligibility.detailedCriteria.map((c, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: c.met ? 'var(--success-soft)' : c.isMissingData ? 'var(--warning-soft)' : 'var(--danger-soft)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    {c.met ? (
                      <CheckCircle2 size={18} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    ) : c.isMissingData ? (
                      <HelpCircle size={18} color="#9C6710" style={{ marginTop: '2px', flexShrink: 0 }} />
                    ) : (
                      <XCircle size={18} color="var(--danger)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
                        {c.criterion}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {c.explanation}
                      </div>
                    </div>
                  </div>
                  <Badge variant={c.met ? 'emerald' : c.isMissingData ? 'warning' : 'danger'}>
                    {c.met ? 'Met' : c.isMissingData ? 'Missing Info' : 'Unmet'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {eligibility.missingInformation.length > 0 && (
            <div style={{ padding: '0.85rem', backgroundColor: 'var(--surface-subtle)', borderRadius: 'var(--radius-md)' }}>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--warning)', marginBottom: '0.4rem' }}>
                Information Needed in Profile
              </h5>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {eligibility.missingInformation.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
            Disclaimer: Preliminary eligibility calculations do not guarantee official selection or scholarship conferral. Always check official provider portals for full terms.
          </div>
        </div>
      )}

      {/* Tab 3: Smart Application Copilot */}
      {activeTab === 'copilot' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Readiness Meter */}
          <div style={{ padding: '1rem', backgroundColor: 'var(--surface-subtle)', borderRadius: 'var(--radius-md)' }}>
            <ProgressBar
              value={copilot.readinessPercentage}
              label="Application Readiness Score"
              ariaLabel="Application Readiness Score"
              sublabel={copilot.submissionReadinessStatement}
              variant={copilot.readinessPercentage >= 80 ? 'primary' : 'warning'}
              height={10}
            />
          </div>

          {/* Action Checklist */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Preparation Checklist</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {copilot.completedRequirementsCount} of {copilot.totalRequirementsCount} completed
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {copilot.recommendedChecklist.map(task => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: task.completed ? 'var(--success-soft)' : 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      fontSize: '0.88rem',
                      cursor: application ? 'pointer' : 'default',
                      color: task.completed ? 'var(--text-muted)' : 'var(--text)',
                      textDecoration: task.completed ? 'line-through' : 'none'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      disabled={!application}
                      onChange={e => {
                        if (application) {
                          updateApplicationTask(application.id, task.id, e.target.checked);
                        }
                      }}
                      style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                    />
                    <span>{task.title}</span>
                  </label>
                  {task.requiredDocumentName && (
                    <Badge variant={task.completed ? 'emerald' : 'warning'}>
                      {task.completed ? 'Document Ready' : 'Document Missing'}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            {!application && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.5rem' }}>
                Tip: Click "Add to Application Tracker" below to save and edit these checklist items interactively.
              </p>
            )}
          </div>

          {/* Brainstorming Co-Pilot Guidance */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--lavender-soft)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(83, 59, 133, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Sparkles size={17} color="var(--lavender-text)" />
              <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--lavender-text)', margin: 0 }}>
                Essay Brainstorm Hook: {copilot.brainstormPrompts.angle}
              </h5>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
              {copilot.brainstormPrompts.explanation}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {copilot.brainstormPrompts.suggestedHooks.map((hook, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: '0.82rem',
                    fontStyle: 'italic',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#fff',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)'
                  }}
                >
                  {hook}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Required Documents */}
      {activeTab === 'documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
              Mandatory application documents cross-referenced against your Document Vault:
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--success)', fontWeight: 700 }}>{copilot.verifiedDocuments.length} Verified</span>
              {copilot.pendingDocuments.length > 0 && <span style={{ color: '#9C6710', fontWeight: 700 }}>• {copilot.pendingDocuments.length} Pending</span>}
              {copilot.draftDocuments.length > 0 && <span style={{ color: 'var(--lavender-text)', fontWeight: 700 }}>• {copilot.draftDocuments.length} Draft</span>}
              {copilot.missingDocuments.length > 0 && <span style={{ color: 'var(--danger)', fontWeight: 700 }}>• {copilot.missingDocuments.length} Missing</span>}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {copilot.documentRequirements.map((item: DocumentRequirementItem, idx: number) => {
              const isVerified = item.status === 'Verified';
              const isPending = item.status === 'Pending Review';
              const isDraft = item.status === 'Draft';

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    backgroundColor: isVerified
                      ? 'var(--success-soft)'
                      : isPending
                      ? 'var(--warning-soft)'
                      : isDraft
                      ? 'var(--lavender-soft)'
                      : 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText
                      size={18}
                      color={
                        isVerified
                          ? 'var(--success)'
                          : isPending
                          ? '#9C6710'
                          : isDraft
                          ? 'var(--lavender-text)'
                          : 'var(--text-subtle)'
                      }
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                        {item.requiredName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {item.explanation}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      isVerified
                        ? 'emerald'
                        : isPending
                        ? 'warning'
                        : isDraft
                        ? 'lavender'
                        : 'danger'
                    }
                  >
                    {item.status === 'Verified'
                      ? 'Verified in Vault'
                      : item.status === 'Pending Review'
                      ? 'Pending Review (Unsatisfied)'
                      : item.status === 'Draft'
                      ? 'Draft Only (Unsatisfied)'
                      : 'Missing in Vault'}
                  </Badge>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-subtle)', lineHeight: 1.45, marginTop: '0.5rem' }}>
            Note: Draft or Pending documents do not satisfy completed submission requirements. Only documents marked <strong>Verified</strong> count toward readiness. All records are stored locally on your device without cloud transmission.
          </div>
        </div>
      )}
    </Modal>
  );
};

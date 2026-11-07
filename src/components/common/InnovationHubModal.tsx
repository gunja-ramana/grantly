import React, { useState } from 'react';
import { Modal } from './Modal';
import { Badge } from './Badge';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';
import {
  Dna,
  Radar,
  FileCheck2,
  Calculator,
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface InnovationHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InnovationHubModal: React.FC<InnovationHubModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);

  const innovations = [
    {
      id: 'dna',
      number: '1',
      title: 'Opportunity DNA™',
      tagline: 'Multi-Dimensional Academic & Profile Affinity Engine',
      icon: <Dna size={22} color="var(--primary)" />,
      badge: 'Profile Intelligence',
      formula: 'DNA = (0.25 × Academics) + (0.20 × FieldFit) + (0.20 × FinancialNeed) + (0.15 × Identity) + (0.10 × DocReadiness) + (0.10 × Impact)',
      description: 'Replaces flat keyword matching with a 6-dimensional vector profile. Every scholarship opportunity is evaluated against verified student constraints, GPA ceilings, degree levels, and citizenship criteria.',
      features: [
        'Deterministic eligibility matching — no guesswork or arbitrary percentages',
        'Transparent breakdown showing exact passed and failed requirement criteria',
        'Direct synchronization between profile field changes and real-time DNA score updates'
      ],
      destination: '/profile',
      actionText: 'Explore Your Profile DNA'
    },
    {
      id: 'radar',
      number: '2',
      title: 'Opportunity Radar™',
      tagline: 'Algorithmic Discovery & Deadlines Immediacy Sorter',
      icon: <Radar size={22} color="var(--primary)" />,
      badge: 'Discovery Intelligence',
      formula: 'RadarScore = (Match% × 0.50) + (AwardValueNormal × 0.30) + (DeadlineUrgencyFactor × 0.20)',
      description: 'Intelligent multi-tier discovery that categorizes opportunities into Critical (≤ 7 days), Urgent (≤ 14 days), and Open windows. Live search across funding amounts, education levels, categories, and verified student affinities.',
      features: [
        'Real-time multi-facet filtering with instant zero-layout-shift UI response',
        'Official vs Demonstration scholarship transparency badges',
        'One-click application pipeline integration and bookmarking'
      ],
      destination: '/discover',
      actionText: 'Launch Opportunity Radar'
    },
    {
      id: 'copilot',
      number: '3',
      title: 'Smart Application Copilot™',
      tagline: 'Strict Document Verification & Submission Readiness Auditor',
      icon: <FileCheck2 size={22} color="var(--primary)" />,
      badge: 'Application Intelligence',
      formula: 'Readiness% = (∑ Verified_Docs_Satisfied / Total_Required_Checklist_Items) × 100',
      description: 'Rigorous application readiness evaluator that inspects local Document Vault certificates against specific scholarship requirements. Draft documents and unverified records are never counted as fulfilled.',
      features: [
        'Strict document category and status validation (Draft ≠ Verified)',
        'Checklist-driven submission readiness tracker for every tracked opportunity',
        'Zero-backend client-side privacy: metadata stays securely in browser storage'
      ],
      destination: '/applications',
      actionText: 'Inspect Tracked Applications'
    },
    {
      id: 'gap-sim',
      number: '4',
      title: 'Funding Gap Simulator™',
      tagline: 'Cost Scenario Modeling & Hypothetical Award Calculator',
      icon: <Calculator size={22} color="var(--primary)" />,
      badge: 'Financial Intelligence',
      formula: 'Deficit = Annual_Education_Expenses - (Received_Funds + ∑ Selected_Hypothetical_Awards)',
      description: 'Interactive educational cost modeling suite. Simulates tuition, accommodation, living expenses, supplies, and transit against actual received scholarships and hypothetical winning combinations.',
      features: [
        'Strict zero double-counting: received awards ($8,500) never blended into potential ($43,000)',
        'Dynamic visual gap indicator showing surplus, balanced, or funding deficit states',
        'Interactive checklist of active applications to test funding scenarios live'
      ],
      destination: '/insights',
      actionText: 'Run Funding Gap Simulator'
    },
    {
      id: 'momentum',
      number: '5',
      title: 'Student Success Momentum™',
      tagline: 'Dynamic Living Progress & Journey Acceleration Index',
      icon: <Activity size={22} color="var(--primary)" />,
      badge: 'Progression Intelligence',
      formula: 'Momentum = (0.40 × AppReadiness) + (0.30 × DocVaultHealth) + (0.30 × ProfileDNA)',
      description: 'A single, unified, living progress score that measures real student progression. Eliminates arbitrary percentages across the dashboard and synchronizes automatically whenever documents, tasks, or profiles are updated.',
      features: [
        'Deterministic weighting derived directly from user actions and verified records',
        'Actionable Next Best Action generator pointing students to highest-impact tasks',
        'Consistent score and metric labels shared synchronously across all 9 pages'
      ],
      destination: '/dashboard',
      actionText: 'View Dashboard Momentum'
    }
  ];

  const current = innovations[activeTab];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="GRANTLY Signature Innovation Architecture"
      subtitle="5 proprietary intelligence engines empowering students from discovery to award"
      maxWidth="720px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            <ShieldCheck size={16} color="var(--primary)" />
            <span>Frontend Architecture • Client-Side Mathematical Models • WCAG AA Compliant</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              icon={<ArrowRight size={16} />}
              onClick={() => {
                onClose();
                navigate(current.destination);
              }}
            >
              {current.actionText}
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Navigation Tabs */}
        <div
          role="tablist"
          aria-label="GRANTLY Innovation Engines"
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--border-light)'
          }}
        >
          {innovations.map((item, index) => {
            const isActive = activeTab === index;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`innovation-panel-${item.id}`}
                id={`innovation-tab-${item.id}`}
                onClick={() => setActiveTab(index)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 0.95rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--primary)' : 'var(--surface-subtle)',
                  color: isActive ? '#FFFFFF' : 'var(--text)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--primary)' : 'var(--border-light)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>#{item.number}</span>
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Innovation Panel */}
        <div
          id={`innovation-panel-${current.id}`}
          role="tabpanel"
          aria-labelledby={`innovation-tab-${current.id}`}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {current.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                  {current.title}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                  {current.tagline}
                </div>
              </div>
            </div>
            <Badge variant="accent">{current.badge}</Badge>
          </div>

          {/* Description */}
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            {current.description}
          </p>

          {/* Formula Callout */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--surface-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <Zap size={14} />
              Mathematical Specification
            </div>
            <code style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text)', display: 'block', wordBreak: 'break-all' }}>
              {current.formula}
            </code>
          </div>

          {/* Core Features */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text)' }}>
              Core Engineering Highlights
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {current.features.map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

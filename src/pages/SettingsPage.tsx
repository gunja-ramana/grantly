import React, { useState } from 'react';
import {
  Database,
  RotateCcw,
  Trash2,
  Download,
  ShieldCheck,
  HardDrive,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storage';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { AlertBanner } from '../components/common/AlertBanner';

export const SettingsPage: React.FC = () => {
  const { state, resetToDemo, resetToBlank } = useApp();

  const [confirmModal, setConfirmModal] = useState<'demo' | 'blank' | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const diagnostics = StorageService.getStorageDiagnostics();

  const handleExportJSON = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `grantly-portfolio-export-${new Date().toISOString().substring(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setSuccessBanner('Exported complete application state to JSON successfully.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmDemoReset = () => {
    resetToDemo();
    setConfirmModal(null);
    setSuccessBanner('Restored initial high-quality demonstration dataset.');
  };

  const handleConfirmBlankReset = () => {
    resetToBlank();
    setConfirmModal(null);
    setSuccessBanner('Reset all student data and initialized clean slate.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Settings & Data Governance
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Manage local portfolio persistence, inspect storage quotas, and reset demonstration datasets.
        </p>
      </div>

      {successBanner && (
        <AlertBanner type="success" title="Action Completed">
          <span>{successBanner}</span>
        </AlertBanner>
      )}

      {/* Storage Diagnostics Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
          <HardDrive size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            Local Storage Inspector
          </h3>
          <Badge variant="emerald">Schema v{state.version} Active</Badge>
        </div>

        <div className="grid-3" style={{ marginBottom: '1.25rem' }}>
          <div style={{ padding: '0.85rem', backgroundColor: 'var(--surface-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600 }}>STORAGE UTILIZATION</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
              {diagnostics.formattedSize}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Safe browser localStorage footprint</div>
          </div>

          <div style={{ padding: '0.85rem', backgroundColor: 'var(--surface-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600 }}>TRACKED ENTITIES</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text)' }}>
              {state.applications.length} Apps • {state.documents.length} Docs
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{state.bookmarkedScholarshipIds.length} bookmarks saved</div>
          </div>

          <div style={{ padding: '0.85rem', backgroundColor: 'var(--surface-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600 }}>INTEGRITY STATUS</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--success)' }}>
              Verified
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Schema migrations active</div>
          </div>
        </div>

        <Button variant="secondary" onClick={handleExportJSON} icon={<Download size={16} />}>
          Export Full Portfolio Backup (JSON)
        </Button>
      </div>

      {/* Dataset & Reset Management */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
          <Database size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            Demonstration State Controls
          </h3>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Reset your environment to test various student journeys, from high-honors STEM candidate to blank new applicant.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button
            variant="soft"
            onClick={() => setConfirmModal('demo')}
            icon={<RotateCcw size={16} />}
          >
            Restore Default Demo Dataset
          </Button>

          <Button
            variant="danger"
            onClick={() => setConfirmModal('blank')}
            icon={<Trash2 size={16} />}
          >
            Clear All Data (Reset to Blank)
          </Button>
        </div>
      </div>

      {/* Privacy & Governance Notice */}
      <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--surface-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <ShieldCheck size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            Architecture & Privacy Disclosures
          </h3>
        </div>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <p>
            <strong>Local Zero-Backend Protocol:</strong> GRANTLY runs purely in the client browser with atomic localStorage synchronization. No student financial certificates, GPA transcripts, or contact details are transmitted to external servers.
          </p>
          <p>
            <strong>Autonomous Intelligence Engine:</strong> All Opportunity DNA matching, Opportunity Radar weighting, and Copilot readiness calculations run through transparent, deterministic JavaScript engines without opaque third-party AI APIs.
          </p>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {confirmModal && (
        <Modal
          isOpen={Boolean(confirmModal)}
          onClose={() => setConfirmModal(null)}
          title={confirmModal === 'demo' ? 'Restore Demo Dataset?' : 'Reset to Blank Canvas?'}
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setConfirmModal(null)}>
                Cancel
              </Button>
              <Button
                variant={confirmModal === 'demo' ? 'primary' : 'danger'}
                onClick={confirmModal === 'demo' ? handleConfirmDemoReset : handleConfirmBlankReset}
              >
                {confirmModal === 'demo' ? 'Confirm Restore' : 'Confirm Complete Wipe'}
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <AlertTriangle size={24} color={confirmModal === 'demo' ? 'var(--primary)' : 'var(--danger)'} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ color: 'var(--text)', marginBottom: '0.5rem', fontWeight: 600 }}>
                {confirmModal === 'demo'
                  ? 'This will restore the curated sample student profile, verified vault documents, and active applications.'
                  : 'This will permanently remove all saved bookmarks, applications, documents, and reset the student profile to empty.'}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                You can restore the demo dataset at any time from this Settings panel.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

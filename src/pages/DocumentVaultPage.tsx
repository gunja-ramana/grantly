import React, { useState } from 'react';
import {
  FolderLock,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DocumentCategory, DocumentStatus, VaultDocument } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { AlertBanner } from '../components/common/AlertBanner';
import { EmptyState } from '../components/common/EmptyState';

export const DocumentVaultPage: React.FC = () => {
  const { state, addVaultDocument, deleteVaultDocument, updateVaultDocumentStatus } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'All'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<VaultDocument | null>(null);

  // Form State for Adding Document
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentCategory>('Academic');
  const [docFileName, setDocFileName] = useState('');
  const [docNotes, setDocNotes] = useState('');
  const [docExpiryDate, setDocExpiryDate] = useState('');
  const [docStatus, setDocStatus] = useState<DocumentStatus>('Verified');

  const categories: (DocumentCategory | 'All')[] = [
    'All',
    'Identity',
    'Academic',
    'Income',
    'Recommendation',
    'Personal Statement',
    'Other'
  ];

  const filteredDocuments = state.documents.filter(doc => {
    if (selectedCategory === 'All') return true;
    return doc.category === selectedCategory;
  });

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docFileName.trim()) return;

    addVaultDocument({
      title: docTitle.trim(),
      category: docCategory,
      fileName: docFileName.trim(),
      fileSizeDisplay: `${(Math.random() * 2 + 0.3).toFixed(1)} MB`,
      fileType: docFileName.endsWith('.pdf') ? 'application/pdf' : 'application/msword',
      expiryDate: docExpiryDate || undefined,
      status: docStatus,
      notes: docNotes || undefined,
      linkedScholarshipIds: []
    });

    // Reset and close
    setDocTitle('');
    setDocFileName('');
    setDocNotes('');
    setDocExpiryDate('');
    setIsAddModalOpen(false);
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'Verified':
        return <Badge variant="emerald" icon={<CheckCircle2 size={13} />}>Verified</Badge>;
      case 'Pending Review':
        return <Badge variant="warning" icon={<Clock size={13} />}>Pending Review</Badge>;
      case 'Draft':
        return <Badge variant="lavender">Draft Work</Badge>;
      case 'Expired':
        return <Badge variant="danger" icon={<AlertTriangle size={13} />}>Expired</Badge>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Document Vault
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Central repository for transcripts, income certificates, recommendations, and personal statements.
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => setIsAddModalOpen(true)}>
          Upload Document Metadata
        </Button>
      </div>

      {/* Honest Storage Architecture Disclaimer */}
      <AlertBanner type="info" title="Zero-Storage Privacy Architecture">
        <span>
          To prevent browser localStorage exhaustion and protect sensitive student records, GRANTLY persists certified document metadata and validity records locally without transmitting sensitive binary files to unvetted cloud servers.
        </span>
      </AlertBanner>

      {/* Categories Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border)',
          overflowX: 'auto',
          paddingBottom: '0.25rem'
        }}
      >
        {categories.map(cat => {
          const count = cat === 'All'
            ? state.documents.length
            : state.documents.filter(d => d.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.6rem 0.95rem',
                borderBottom: selectedCategory === cat ? '2px solid var(--primary)' : '2px solid transparent',
                color: selectedCategory === cat ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: selectedCategory === cat ? 700 : 500,
                fontSize: '0.88rem',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <span>{cat}</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: selectedCategory === cat ? 'var(--primary-soft)' : 'var(--surface-subtle)',
                  color: selectedCategory === cat ? 'var(--primary)' : 'var(--text-subtle)',
                  fontWeight: 700
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <EmptyState
          icon={<FolderLock size={28} />}
          title={`No Documents in "${selectedCategory}"`}
          description="Add academic transcripts, recommendation letters, or tax certificates to accelerate Copilot readiness."
          actionText="Upload Document Record"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid-2">
          {filteredDocuments.map(doc => (
            <div
              key={doc.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Badge variant="lavender">{doc.category}</Badge>
                    {getStatusBadge(doc.status)}
                  </div>
                  <Button
                    variant="icon"
                    onClick={() => setDocToDelete(doc)}
                    aria-label="Delete Document"
                    title="Delete Document"
                    style={{ color: 'var(--text-subtle)' }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary-soft)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>
                      {doc.title}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', wordBreak: 'break-all' }}>
                      {doc.fileName} • {doc.fileSizeDisplay}
                    </div>
                  </div>
                </div>

                {doc.notes && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.85rem', lineHeight: 1.45 }}>
                    {doc.notes}
                  </p>
                )}
              </div>

              {/* Footer info & status toggler */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-light)',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  Uploaded: <strong>{doc.uploadDate}</strong>
                  {doc.expiryDate && (
                    <span> • Valid until: <strong>{doc.expiryDate}</strong></span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status:</span>
                  <select
                    value={doc.status}
                    onChange={e => updateVaultDocumentStatus(doc.id, e.target.value as DocumentStatus)}
                    className="input-control"
                    style={{ fontSize: '0.78rem', padding: '0.25rem 1.6rem 0.25rem 0.5rem', width: 'auto' }}
                    aria-label="Change document verification status"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Draft">Draft</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Document Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Upload Document Record to Vault"
          subtitle="Add metadata and verification status for your application portfolio"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateDocument}>
                Save Document
              </Button>
            </div>
          }
        >
          <form onSubmit={handleCreateDocument} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group">
              <label htmlFor="add-doc-title" className="input-label">Document Title *</label>
              <input
                id="add-doc-title"
                type="text"
                className="input-control"
                required
                placeholder="e.g. Official University Transcript 2026"
                value={docTitle}
                onChange={e => setDocTitle(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label htmlFor="add-doc-category" className="input-label">Document Category *</label>
                <select
                  id="add-doc-category"
                  className="input-control"
                  value={docCategory}
                  onChange={e => setDocCategory(e.target.value as DocumentCategory)}
                >
                  <option value="Academic">Academic Transcript</option>
                  <option value="Identity">Identity Document</option>
                  <option value="Income">Income / Financial Proof</option>
                  <option value="Recommendation">Recommendation Letter</option>
                  <option value="Personal Statement">Personal Statement / Essay</option>
                  <option value="Other">Other Certificate</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="add-doc-status" className="input-label">Verification Status</label>
                <select
                  id="add-doc-status"
                  className="input-control"
                  value={docStatus}
                  onChange={e => setDocStatus(e.target.value as DocumentStatus)}
                >
                  <option value="Verified">Verified Stamped Copy</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Draft">Draft / Work in Progress</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="add-doc-filename" className="input-label">File Name Reference *</label>
              <input
                id="add-doc-filename"
                type="text"
                className="input-control"
                required
                placeholder="e.g. Registrar_Official_Transcript_Fall2026.pdf"
                value={docFileName}
                onChange={e => setDocFileName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="add-doc-expiry" className="input-label">Expiration Date (Optional)</label>
              <input
                id="add-doc-expiry"
                type="date"
                className="input-control"
                value={docExpiryDate}
                onChange={e => setDocExpiryDate(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="add-doc-notes" className="input-label">Verification Notes & Description</label>
              <textarea
                id="add-doc-notes"
                className="input-control"
                rows={2}
                placeholder="e.g. Signed by department chair; covers credit hours up to current semester."
                value={docNotes}
                onChange={e => setDocNotes(e.target.value)}
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <Modal
          isOpen={Boolean(docToDelete)}
          onClose={() => setDocToDelete(null)}
          title="Confirm Document Removal"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setDocToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  deleteVaultDocument(docToDelete.id);
                  setDocToDelete(null);
                }}
              >
                Delete Document
              </Button>
            </div>
          }
        >
          <p style={{ color: 'var(--text)' }}>
            Are you sure you want to remove <strong>"{docToDelete.title}"</strong> from your Document Vault? Applications relying on this document will reflect the updated checklist state.
          </p>
        </Modal>
      )}
    </div>
  );
};

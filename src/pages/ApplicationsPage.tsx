import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Trash2,
  Edit3,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApplicationRecord, ApplicationStatus, Scholarship } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { ScholarshipDetailModal } from '../components/scholarships/ScholarshipDetailModal';
import { Link } from 'react-router-dom';

export const ApplicationsPage: React.FC = () => {
  const { state, scholarships, updateApplicationStatus, updateApplicationTask, addApplicationTask, deleteApplication } = useApp();

  const [activeTab, setActiveTab] = useState<ApplicationStatus | 'All'>('All');
  const [selectedScholarshipForModal, setSelectedScholarshipForModal] = useState<Scholarship | null>(null);

  // Task management state
  const [activeEditingApp, setActiveEditingApp] = useState<ApplicationRecord | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingNotes, setEditingNotes] = useState('');

  // Delete confirmation modal
  const [appToDelete, setAppToDelete] = useState<ApplicationRecord | null>(null);

  const statuses: (ApplicationStatus | 'All')[] = [
    'All',
    'Preparing',
    'Ready to Submit',
    'Submitted',
    'Under Review',
    'Approved',
    'Not Started',
    'Rejected'
  ];

  const filteredApplications = state.applications.filter(app => {
    if (activeTab === 'All') return true;
    return app.status === activeTab;
  });

  const getStatusBadgeVariant = (status: ApplicationStatus) => {
    switch (status) {
      case 'Approved': return 'emerald';
      case 'Submitted':
      case 'Under Review': return 'lavender';
      case 'Ready to Submit': return 'accent';
      case 'Preparing': return 'warning';
      case 'Rejected': return 'danger';
      default: return 'neutral';
    }
  };

  const handleOpenTaskEditor = (app: ApplicationRecord) => {
    setActiveEditingApp(app);
    setEditingNotes(app.notes || '');
  };

  const handleAddTask = () => {
    if (activeEditingApp && newTaskTitle.trim()) {
      addApplicationTask(activeEditingApp.id, newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  const handleSaveNotes = () => {
    if (activeEditingApp) {
      updateApplicationStatus(activeEditingApp.id, activeEditingApp.status, editingNotes);
      setActiveEditingApp(null);
    }
  };

  const handleConfirmDelete = () => {
    if (appToDelete) {
      deleteApplication(appToDelete.id);
      setAppToDelete(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            My Applications Tracker
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Manage submission milestones, verify checklist requirements, and monitor decision outcomes.
          </p>
        </div>
        <Link to="/discover">
          <Button variant="primary" icon={<Plus size={16} />}>
            Discover More Opportunities
          </Button>
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border)',
          overflowX: 'auto',
          paddingBottom: '0.25rem'
        }}
      >
        {statuses.map(st => {
          const count = st === 'All'
            ? state.applications.length
            : state.applications.filter(a => a.status === st).length;

          return (
            <button
              key={st}
              onClick={() => setActiveTab(st)}
              style={{
                padding: '0.6rem 0.95rem',
                borderBottom: activeTab === st ? '2px solid var(--primary)' : '2px solid transparent',
                color: activeTab === st ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: activeTab === st ? 700 : 500,
                fontSize: '0.88rem',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <span>{st}</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: activeTab === st ? 'var(--primary-soft)' : 'var(--surface-subtle)',
                  color: activeTab === st ? 'var(--primary)' : 'var(--text-subtle)',
                  fontWeight: 700
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <EmptyState
          icon={<FileCheck2 size={28} />}
          title={`No Applications in "${activeTab}" Status`}
          description="Track opportunities from the discovery catalog to monitor requirements and deadline milestones."
          actionText="Browse Scholarships"
          onAction={() => setActiveTab('All')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredApplications.map(app => {
            const sch = scholarships.find(s => s.id === app.scholarshipId);
            const totalTasks = app.tasks.length;
            const completedTasks = app.tasks.filter(t => t.completed).length;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            return (
              <div
                key={app.id}
                className="card"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                      <Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge>
                      {sch && <Badge variant="lavender">{sch.category}</Badge>}
                      {app.fundingReceivedAmount && (
                        <Badge variant="accent">
                          ${app.fundingReceivedAmount.toLocaleString()} Received
                        </Badge>
                      )}
                    </div>
                    <h3
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: 'var(--text)',
                        cursor: sch ? 'pointer' : 'default',
                        marginBottom: '0.2rem'
                      }}
                      onClick={() => sch && setSelectedScholarshipForModal(sch)}
                    >
                      {sch ? sch.title : 'Custom Scholarship Application'}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {sch?.provider} • Target Date: <strong>{app.targetSubmissionDate}</strong>
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <select
                      value={app.status}
                      onChange={e => updateApplicationStatus(app.id, e.target.value as ApplicationStatus)}
                      className="input-control"
                      style={{ padding: '0.45rem 1.8rem 0.45rem 0.65rem', fontSize: '0.85rem' }}
                      aria-label="Change application status"
                    >
                      <option value="Not Started">Status: Not Started</option>
                      <option value="Preparing">Status: Preparing</option>
                      <option value="Ready to Submit">Status: Ready to Submit</option>
                      <option value="Submitted">Status: Submitted</option>
                      <option value="Under Review">Status: Under Review</option>
                      <option value="Approved">Status: Approved</option>
                      <option value="Rejected">Status: Rejected</option>
                    </select>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenTaskEditor(app)}
                      icon={<Edit3 size={14} />}
                    >
                      Manage Tasks
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setAppToDelete(app)}
                      aria-label="Delete Application"
                      title="Delete Application"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>

                {/* Checklist Progress Bar */}
                <div>
                  <ProgressBar
                    value={progress}
                    label="Copilot Preparation Progress"
                    sublabel={`${completedTasks} of ${totalTasks} requirements fulfilled`}
                    variant={progress === 100 ? 'primary' : 'warning'}
                    height={8}
                  />
                </div>

                {/* Inline Tasks Preview (up to 3) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {app.tasks.slice(0, 3).map(task => (
                    <label
                      key={task.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        fontSize: '0.85rem',
                        color: task.completed ? 'var(--text-muted)' : 'var(--text)',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={e => updateApplicationTask(app.id, task.id, e.target.checked)}
                        style={{ accentColor: 'var(--primary)', width: '15px', height: '15px' }}
                      />
                      <span>{task.title}</span>
                      {task.requiredDocumentName && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                          ({task.requiredDocumentName})
                        </span>
                      )}
                    </label>
                  ))}
                  {app.tasks.length > 3 && (
                    <button
                      onClick={() => handleOpenTaskEditor(app)}
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--secondary)',
                        fontWeight: 600,
                        textAlign: 'left',
                        padding: '0.2rem 0'
                      }}
                    >
                      + {app.tasks.length - 3} more preparation items
                    </button>
                  )}
                </div>

                {/* Notes footer */}
                {app.notes && (
                  <div
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      backgroundColor: 'var(--surface-subtle)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <strong>Notes:</strong> {app.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Task & Notes Editor Modal */}
      {activeEditingApp && (
        <Modal
          isOpen={Boolean(activeEditingApp)}
          onClose={() => setActiveEditingApp(null)}
          title="Manage Application Tasks & Notes"
          subtitle={scholarships.find(s => s.id === activeEditingApp.scholarshipId)?.title || 'Application'}
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setActiveEditingApp(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveNotes}>
                Save Changes
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Checklist */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Preparation Checklist Tasks
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {activeEditingApp.tasks.map(task => (
                  <div
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'var(--surface-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        color: task.completed ? 'var(--text-muted)' : 'var(--text)',
                        textDecoration: task.completed ? 'line-through' : 'none'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={e => updateApplicationTask(activeEditingApp.id, task.id, e.target.checked)}
                        style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                      />
                      <span>{task.title}</span>
                    </label>
                  </div>
                ))}
              </div>

              {/* Add Custom Task */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="input-control"
                  placeholder="Add custom milestone (e.g. Schedule writing center review)..."
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTask();
                    }
                  }}
                />
                <Button variant="secondary" size="sm" onClick={handleAddTask}>
                  Add
                </Button>
              </div>
            </div>

            {/* Notes input */}
            <div className="input-group">
              <label className="input-label">Student Application Notes & Reminders</label>
              <textarea
                className="input-control"
                rows={3}
                value={editingNotes}
                onChange={e => setEditingNotes(e.target.value)}
                placeholder="Log internal reminders, portal credentials notes, faculty advisor contacts..."
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {appToDelete && (
        <Modal
          isOpen={Boolean(appToDelete)}
          onClose={() => setAppToDelete(null)}
          title="Confirm Application Removal"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setAppToDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                Delete Application
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <AlertTriangle size={24} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ color: 'var(--text)', marginBottom: '0.5rem', fontWeight: 600 }}>
                Are you sure you want to delete this application?
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                This will remove the application record and associated preparation checklist. Your saved bookmark for this scholarship will remain intact.
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Scholarship Detail Modal */}
      <ScholarshipDetailModal
        scholarship={selectedScholarshipForModal}
        isOpen={Boolean(selectedScholarshipForModal)}
        onClose={() => setSelectedScholarshipForModal(null)}
      />
    </div>
  );
};

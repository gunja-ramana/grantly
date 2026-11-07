import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  AppState,
  StudentProfile,
  ApplicationRecord,
  VaultDocument,
  EducationExpenses,
  Scholarship,
  ActivityItem,
  ApplicationStatus,
  OpportunityRadarItem,
  ApplicationTask,
  NearestUpcomingDeadline
} from '../types';
import { StorageService } from '../services/storage';
import { MOCK_SCHOLARSHIPS } from '../data/mockScholarships';
import { calculateOpportunityRadar } from '../features/opportunity-radar/engine';
import { calculateOpportunityDNA } from '../features/eligibility/engine';
import { calculateFundingMetrics, calculateStudentMomentum, FundingMetrics, StudentMomentumStats } from '../features/funding-simulator/engine';
import { matchDocumentToRequirement } from '../features/copilot/engine';

interface AppContextValue {
  state: AppState;
  scholarships: Scholarship[];
  radarItems: OpportunityRadarItem[];
  fundingMetrics: FundingMetrics;
  momentumStats: StudentMomentumStats;
  opportunityDNA: ReturnType<typeof calculateOpportunityDNA>;
  nearestUpcomingDeadline: NearestUpcomingDeadline | null;
  // Actions
  toggleBookmark: (scholarshipId: string) => void;
  updateProfile: (updatedProfile: Partial<StudentProfile>) => void;
  addApplication: (scholarshipId: string, status?: ApplicationStatus, targetDate?: string) => void;
  updateApplicationStatus: (applicationId: string, newStatus: ApplicationStatus, notes?: string) => void;
  updateApplicationTask: (applicationId: string, taskId: string, completed: boolean) => void;
  addApplicationTask: (applicationId: string, title: string, requiredDocumentName?: string) => void;
  deleteApplication: (applicationId: string) => void;
  addVaultDocument: (doc: Omit<VaultDocument, 'id' | 'uploadDate'>) => void;
  deleteVaultDocument: (docId: string) => void;
  updateVaultDocumentStatus: (docId: string, status: VaultDocument['status']) => void;
  updateExpenses: (expenses: Partial<EducationExpenses>) => void;
  resetToDemo: () => void;
  resetToBlank: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => StorageService.loadState());

  // Automatically persist to localStorage whenever state changes
  useEffect(() => {
    StorageService.saveState(state);
  }, [state]);

  const scholarships = useMemo(() => MOCK_SCHOLARSHIPS, []);

  // 1. Toggle Bookmark
  const toggleBookmark = useCallback((scholarshipId: string) => {
    setState(prev => {
      const exists = prev.bookmarkedScholarshipIds.includes(scholarshipId);
      const updatedBookmarks = exists
        ? prev.bookmarkedScholarshipIds.filter(id => id !== scholarshipId)
        : [...prev.bookmarkedScholarshipIds, scholarshipId];

      const sch = MOCK_SCHOLARSHIPS.find(s => s.id === scholarshipId);
      const actionName = exists ? 'Removed bookmark' : 'Bookmarked scholarship';
      const desc = exists
        ? `Removed ${sch?.title || 'scholarship'} from saved list.`
        : `Saved ${sch?.title || 'scholarship'} to saved opportunities.`;

      const newActivity: ActivityItem = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: actionName,
        description: desc,
        type: 'bookmark'
      };

      return {
        ...prev,
        bookmarkedScholarshipIds: updatedBookmarks,
        activities: [newActivity, ...prev.activities.slice(0, 19)]
      };
    });
  }, []);

  // 2. Update Student Profile
  const updateProfile = useCallback((updates: Partial<StudentProfile>) => {
    setState(prev => {
      const newProfile: StudentProfile = {
        ...prev.profile,
        ...updates
      };
      // Recalculate dynamic completeness
      const dna = calculateOpportunityDNA(newProfile);
      newProfile.profileCompletionPercentage = dna.profileCompleteness;

      const newActivity: ActivityItem = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: 'Profile Updated',
        description: `Student profile updated (${dna.profileCompleteness}% complete).`,
        type: 'profile'
      };

      return {
        ...prev,
        profile: newProfile,
        activities: [newActivity, ...prev.activities.slice(0, 19)]
      };
    });
  }, []);

  // 3. Add Application to Tracker
  const addApplication = useCallback((scholarshipId: string, status: ApplicationStatus = 'Preparing', targetDate?: string) => {
    setState(prev => {
      const existing = prev.applications.find(a => a.scholarshipId === scholarshipId);
      const sch = MOCK_SCHOLARSHIPS.find(s => s.id === scholarshipId);
      if (existing) {
        return prev;
      }

      const deadline = targetDate || sch?.applicationDeadline || new Date().toISOString().substring(0, 10);
      const initialTasks: ApplicationTask[] = (sch?.requiredDocuments || []).map((doc, idx) => {
        const match = matchDocumentToRequirement(doc, prev.documents);
        return {
          id: `task-init-${idx}`,
          title: `Upload & verify: ${doc}`,
          completed: match.status === 'Verified',
          requiredDocumentName: doc
        };
      });

      // Add general statement and review tasks
      initialTasks.push({
        id: `task-statement`,
        title: `Draft customized essay for ${sch?.title || 'scholarship'}`,
        completed: false
      });
      initialTasks.push({
        id: `task-final-review`,
        title: 'Final check of all requirements and official portal submission',
        completed: false
      });

      const newApplication: ApplicationRecord = {
        id: `app-${Date.now()}`,
        scholarshipId,
        status,
        targetSubmissionDate: deadline,
        notes: `Application initiated on ${new Date().toLocaleDateString()}.`,
        tasks: initialTasks,
        createdAt: new Date().toISOString().substring(0, 10),
        updatedAt: new Date().toISOString().substring(0, 10)
      };

      const newActivity: ActivityItem = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: 'Application Created',
        description: `Added ${sch?.title || 'scholarship'} to Application Tracker.`,
        type: 'application'
      };

      return {
        ...prev,
        applications: [newApplication, ...prev.applications],
        bookmarkedScholarshipIds: prev.bookmarkedScholarshipIds.includes(scholarshipId)
          ? prev.bookmarkedScholarshipIds
          : [...prev.bookmarkedScholarshipIds, scholarshipId],
        activities: [newActivity, ...prev.activities.slice(0, 19)]
      };
    });
  }, []);

  // 4. Update Application Status
  const updateApplicationStatus = useCallback((applicationId: string, newStatus: ApplicationStatus, notes?: string) => {
    setState(prev => {
      const app = prev.applications.find(a => a.id === applicationId);
      if (!app) return prev;
      const sch = MOCK_SCHOLARSHIPS.find(s => s.id === app.scholarshipId);

      const updated = prev.applications.map(a => {
        if (a.id === applicationId) {
          const isSubmittedNow = newStatus === 'Submitted' && a.status !== 'Submitted';
          const isApprovedNow = newStatus === 'Approved';
          return {
            ...a,
            status: newStatus,
            appliedDate: isSubmittedNow ? new Date().toISOString().substring(0, 10) : a.appliedDate,
            fundingReceivedAmount: isApprovedNow && a.fundingReceivedAmount === undefined ? (sch?.awardAmount || 0) : a.fundingReceivedAmount,
            notes: notes !== undefined ? notes : a.notes,
            updatedAt: new Date().toISOString().substring(0, 10)
          };
        }
        return a;
      });

      const newActivity: ActivityItem = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: 'Status Updated',
        description: `${sch?.title || 'Application'} status shifted to "${newStatus}".`,
        type: 'status_change'
      };

      return {
        ...prev,
        applications: updated,
        activities: [newActivity, ...prev.activities.slice(0, 19)]
      };
    });
  }, []);

  // 5. Update Application Task
  const updateApplicationTask = useCallback((applicationId: string, taskId: string, completed: boolean) => {
    setState(prev => {
      let taskTitle = '';
      const updatedApplications = prev.applications.map(app => {
        if (app.id === applicationId) {
          const updatedTasks = app.tasks.map(t => {
            if (t.id === taskId) {
              taskTitle = t.title;
              return { ...t, completed };
            }
            return t;
          });
          return {
            ...app,
            tasks: updatedTasks,
            updatedAt: new Date().toISOString().substring(0, 10)
          };
        }
        return app;
      });

      const newActivity: ActivityItem = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: completed ? 'Task Completed' : 'Task Reopened',
        description: `Checklist item "${taskTitle || 'Task'}" marked as ${completed ? 'done' : 'pending'}.`,
        type: 'task'
      };

      return {
        ...prev,
        applications: updatedApplications,
        activities: [newActivity, ...prev.activities.slice(0, 19)]
      };
    });
  }, []);

  // 6. Add Custom Application Task
  const addApplicationTask = useCallback((applicationId: string, title: string, requiredDocumentName?: string) => {
    setState(prev => {
      const updatedApplications = prev.applications.map(app => {
        if (app.id === applicationId) {
          const newTask = {
            id: `task-${Date.now()}`,
            title,
            completed: false,
            requiredDocumentName
          };
          return {
            ...app,
            tasks: [...app.tasks, newTask],
            updatedAt: new Date().toISOString().substring(0, 10)
          };
        }
        return app;
      });
      return {
        ...prev,
        applications: updatedApplications
      };
    });
  }, []);

  // 7. Delete Application
  const deleteApplication = useCallback((applicationId: string) => {
    setState(prev => {
      const app = prev.applications.find(a => a.id === applicationId);
      const sch = MOCK_SCHOLARSHIPS.find(s => s.id === app?.scholarshipId);
      const updated = prev.applications.filter(a => a.id !== applicationId);

      const newActivity: ActivityItem = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: 'Application Deleted',
        description: `Removed ${sch?.title || 'application'} from tracker.`,
        type: 'application'
      };

      return {
        ...prev,
        applications: updated,
        activities: [newActivity, ...prev.activities.slice(0, 19)]
      };
    });
  }, []);

  // 8. Add Vault Document (Synchronizes linked tasks)
  const addVaultDocument = useCallback((doc: Omit<VaultDocument, 'id' | 'uploadDate'>) => {
    const newDoc: VaultDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().substring(0, 10)
    };
    setState(prev => {
      const newDocuments = [newDoc, ...prev.documents];
      const newActivity: ActivityItem = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: 'Document Added to Vault',
        description: `Added "${newDoc.title}" (${newDoc.category}).`,
        type: 'document'
      };

      // Cross-module synchronization: re-evaluate document-linked tasks
      const updatedApplications = prev.applications.map(app => ({
        ...app,
        tasks: app.tasks.map(t => {
          if (t.requiredDocumentName) {
            const match = matchDocumentToRequirement(t.requiredDocumentName, newDocuments);
            return { ...t, completed: match.status === 'Verified' };
          }
          return t;
        })
      }));

      return {
        ...prev,
        documents: newDocuments,
        applications: updatedApplications,
        activities: [newActivity, ...prev.activities.slice(0, 19)]
      };
    });
  }, []);

  // 9. Delete Vault Document (Synchronizes linked tasks)
  const deleteVaultDocument = useCallback((docId: string) => {
    setState(prev => {
      const doc = prev.documents.find(d => d.id === docId);
      const newDocuments = prev.documents.filter(d => d.id !== docId);

      // Re-evaluate document-linked tasks against remaining documents
      const updatedApplications = prev.applications.map(app => ({
        ...app,
        tasks: app.tasks.map(t => {
          if (t.requiredDocumentName) {
            const match = matchDocumentToRequirement(t.requiredDocumentName, newDocuments);
            return { ...t, completed: match.status === 'Verified' };
          }
          return t;
        })
      }));

      return {
        ...prev,
        documents: newDocuments,
        applications: updatedApplications,
        activities: [
          {
            id: `act-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            title: 'Document Removed',
            description: `Removed "${doc?.title || 'document'}" from Vault.`,
            type: 'document'
          },
          ...prev.activities.slice(0, 19)
        ]
      };
    });
  }, []);

  // 10. Update Vault Document Status (Synchronizes linked tasks)
  const updateVaultDocumentStatus = useCallback((docId: string, status: VaultDocument['status']) => {
    setState(prev => {
      const newDocuments = prev.documents.map(d => d.id === docId ? { ...d, status } : d);

      // Re-evaluate document-linked tasks: Draft/Pending documents MUST NOT satisfy completed requirements!
      const updatedApplications = prev.applications.map(app => ({
        ...app,
        tasks: app.tasks.map(t => {
          if (t.requiredDocumentName) {
            const match = matchDocumentToRequirement(t.requiredDocumentName, newDocuments);
            return { ...t, completed: match.status === 'Verified' };
          }
          return t;
        })
      }));

      return {
        ...prev,
        documents: newDocuments,
        applications: updatedApplications
      };
    });
  }, []);

  // 11. Update Expenses
  const updateExpenses = useCallback((expenses: Partial<EducationExpenses>) => {
    setState(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        ...expenses
      }
    }));
  }, []);

  // 12. Reset to Demo
  const resetToDemo = useCallback(() => {
    const demo = StorageService.resetToDemo();
    setState(demo);
  }, []);

  // 13. Reset to Blank
  const resetToBlank = useCallback(() => {
    const blank = StorageService.resetToBlank();
    setState(blank);
  }, []);

  // Derived Shared Intelligence
  const opportunityDNA = useMemo(() => {
    return calculateOpportunityDNA(state.profile);
  }, [state.profile]);

  const radarItems = useMemo(() => {
    return calculateOpportunityRadar(
      scholarships,
      state.profile,
      state.applications,
      state.documents,
      state.bookmarkedScholarshipIds
    );
  }, [scholarships, state.profile, state.applications, state.documents, state.bookmarkedScholarshipIds]);

  const fundingMetrics = useMemo(() => {
    return calculateFundingMetrics(
      state.expenses,
      state.applications,
      scholarships,
      state.bookmarkedScholarshipIds
    );
  }, [state.expenses, state.applications, scholarships, state.bookmarkedScholarshipIds]);

  const momentumStats = useMemo(() => {
    return calculateStudentMomentum(
      state.profile,
      state.bookmarkedScholarshipIds,
      state.applications,
      state.documents
    );
  }, [state.profile, state.bookmarkedScholarshipIds, state.applications, state.documents]);

  // Shared single source of truth for nearest upcoming deadline
  const nearestUpcomingDeadline = useMemo<NearestUpcomingDeadline | null>(() => {
    const upcoming = radarItems.filter(r => !r.isOverdue && r.daysRemaining >= 0);
    if (upcoming.length === 0) return null;
    const nearest = upcoming.reduce((prev, curr) => (curr.daysRemaining < prev.daysRemaining ? curr : prev));
    return {
      item: nearest,
      daysRemaining: nearest.daysRemaining,
      scholarshipTitle: nearest.scholarship.title,
      provider: nearest.scholarship.provider,
      deadlineDate: nearest.scholarship.applicationDeadline,
      awardAmount: nearest.scholarship.awardAmount
    };
  }, [radarItems]);

  const value: AppContextValue = {
    state,
    scholarships,
    radarItems,
    fundingMetrics,
    momentumStats,
    opportunityDNA,
    nearestUpcomingDeadline,
    toggleBookmark,
    updateProfile,
    addApplication,
    updateApplicationStatus,
    updateApplicationTask,
    addApplicationTask,
    deleteApplication,
    addVaultDocument,
    deleteVaultDocument,
    updateVaultDocumentStatus,
    updateExpenses,
    resetToDemo,
    resetToBlank
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

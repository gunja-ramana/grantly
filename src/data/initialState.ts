import { AppState, StudentProfile, VaultDocument, ApplicationRecord, ActivityItem } from '../types';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  fullName: 'Maya Patel',
  email: 'maya.patel@university.edu',
  phone: '+1 (555) 438-9210',
  citizenship: 'United States',
  residenceCountry: 'United States',
  stateProvince: 'California',
  educationLevel: 'Undergraduate',
  fieldOfStudy: 'Computer Science',
  institution: 'Pacific State University',
  gpa: 3.72,
  maxGpa: 4.0,
  graduationYear: 2027,
  annualFamilyIncome: 48000,
  householdSize: 4,
  firstGenerationStudent: true,
  minorityStatus: true,
  militaryAffiliation: false,
  disabilityStatus: false,
  intendedSpecialization: 'Artificial Intelligence & Civic Tech',
  targetDestinations: ['United States', 'Canada', 'United Kingdom'],
  bioStatement: 'Junior undergraduate researcher investigating algorithmic fairness and accessible educational technology. Aiming to build open-source tools for underserved secondary school learners.',
  profileCompletionPercentage: 92
};

export const INITIAL_DOCUMENTS: VaultDocument[] = [
  {
    id: 'doc-001',
    title: 'Official Undergraduate Academic Transcript',
    category: 'Academic',
    fileName: 'Official_Transcript_Pacific_State_2026.pdf',
    fileSizeDisplay: '1.4 MB',
    fileType: 'application/pdf',
    uploadDate: '2026-10-12',
    expiryDate: '2027-06-30',
    status: 'Verified',
    notes: 'Certified registrar copy covering Fall 2024 through Spring 2026 (Cumulative GPA: 3.72)',
    linkedScholarshipIds: ['sch-001', 'sch-002', 'sch-003', 'sch-006']
  },
  {
    id: 'doc-002',
    title: 'FAFSA & Parent Income Verification Form 2025-2026',
    category: 'Income',
    fileName: 'IRS_Income_Tax_Verification_2025.pdf',
    fileSizeDisplay: '2.8 MB',
    fileType: 'application/pdf',
    uploadDate: '2026-09-28',
    expiryDate: '2027-04-15',
    status: 'Verified',
    notes: 'Official tax transcript showing household gross income under $50,000 threshold',
    linkedScholarshipIds: ['sch-002', 'sch-010']
  },
  {
    id: 'doc-003',
    title: 'Faculty Recommendation Letter — Prof. Vance',
    category: 'Recommendation',
    fileName: 'Recommendation_Prof_Elena_Vance_CS.pdf',
    fileSizeDisplay: '420 KB',
    fileType: 'application/pdf',
    uploadDate: '2026-10-18',
    status: 'Verified',
    notes: 'Department Chair recommendation endorsing machine learning lab research and mentoring',
    linkedScholarshipIds: ['sch-001', 'sch-003']
  },
  {
    id: 'doc-004',
    title: 'Statement of Purpose — Ethical AI & Social Equity',
    category: 'Personal Statement',
    fileName: 'Statement_Purpose_EthicalAI_Draft_v3.docx',
    fileSizeDisplay: '185 KB',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadDate: '2026-11-01',
    status: 'Draft',
    notes: 'Work-in-progress draft tailored for STEM fellowships, currently 720 words',
    linkedScholarshipIds: ['sch-001', 'sch-003']
  },
  {
    id: 'doc-005',
    title: 'Proof of First-Generation Student Status Certificate',
    category: 'Identity',
    fileName: 'FirstGen_Dean_Verification_Letter.pdf',
    fileSizeDisplay: '310 KB',
    fileType: 'application/pdf',
    uploadDate: '2026-09-15',
    status: 'Verified',
    notes: 'Dean of Students official letter affirming neither parent holds a 4-year degree',
    linkedScholarshipIds: ['sch-002']
  }
];

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-001',
    scholarshipId: 'sch-001',
    status: 'Preparing',
    targetSubmissionDate: '2026-11-18',
    notes: 'AI ethics draft is nearly done; waiting on final proofreading from university writing center.',
    personalStatementNotes: 'Highlight civic engagement project with the high school robotics club.',
    createdAt: '2026-10-20',
    updatedAt: '2026-11-04',
    tasks: [
      { id: 't-1', title: 'Verify official transcript is attached', completed: true, requiredDocumentName: 'Official Academic Transcript' },
      { id: 't-2', title: 'Complete 750-word Statement of Purpose on ethical tech', completed: false, requiredDocumentName: 'Statement of Purpose (AI Ethics & Vision)' },
      { id: 't-3', title: 'Obtain Prof. Vance Recommendation Letter', completed: true, requiredDocumentName: 'Letter of Recommendation' },
      { id: 't-4', title: 'Update Resume / CV with latest publications', completed: true, requiredDocumentName: 'Resume / CV' },
      { id: 't-5', title: 'Review against provider checklist guidelines', completed: false }
    ]
  },
  {
    id: 'app-002',
    scholarshipId: 'sch-002',
    status: 'Under Review',
    appliedDate: '2026-10-25',
    targetSubmissionDate: '2026-10-25',
    notes: 'Submitted full packet. Expected decision notice by first week of December.',
    createdAt: '2026-10-05',
    updatedAt: '2026-10-26',
    tasks: [
      { id: 't-10', title: 'First-gen verification uploaded', completed: true },
      { id: 't-11', title: 'Income tax documents attached', completed: true },
      { id: 't-12', title: 'Personal resilience essay submitted', completed: true },
      { id: 't-13', title: 'Official college transcript included', completed: true }
    ]
  },
  {
    id: 'app-003',
    scholarshipId: 'sch-003',
    status: 'Submitted',
    appliedDate: '2026-11-02',
    targetSubmissionDate: '2026-11-03',
    notes: 'Submitted before priority deadline. Portfolio link included in application portal.',
    createdAt: '2026-10-15',
    updatedAt: '2026-11-02',
    tasks: [
      { id: 't-20', title: 'Attach STEM transcript', completed: true },
      { id: 't-21', title: 'Two STEM faculty recommendation letters', completed: true },
      { id: 't-22', title: 'Provide GitHub repository link', completed: true },
      { id: 't-23', title: 'Submit personal statement on women in tech', completed: true }
    ]
  },
  {
    id: 'app-004',
    scholarshipId: 'sch-006',
    status: 'Approved',
    appliedDate: '2026-09-10',
    targetSubmissionDate: '2026-09-12',
    fundingReceivedAmount: 8500,
    disbursementDate: '2026-10-15',
    notes: 'Award granted! Official check disbursed to financial aid bursar office on Oct 15.',
    createdAt: '2026-08-25',
    updatedAt: '2026-10-15',
    tasks: [
      { id: 't-30', title: 'Initial sustainability project synopsis', completed: true },
      { id: 't-31', title: 'Academic transcript', completed: true },
      { id: 't-32', title: 'Sign award acceptance letter', completed: true },
      { id: 't-33', title: 'Set up direct bursar disbursement', completed: true }
    ]
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    timestamp: '2026-11-04 14:22',
    title: 'Application checklist updated',
    description: 'Updated tasks for Future Tech & AI Leadership Scholarship.',
    type: 'task'
  },
  {
    id: 'act-2',
    timestamp: '2026-11-02 10:15',
    title: 'Application submitted',
    description: 'Submitted Vanguard Women in STEM Excellence Fellowship.',
    type: 'status_change'
  },
  {
    id: 'act-3',
    timestamp: '2026-10-25 16:40',
    title: 'Application in review',
    description: 'Lumina First-Gen Grant packet moved to Under Review.',
    type: 'status_change'
  },
  {
    id: 'act-4',
    timestamp: '2026-10-15 09:30',
    title: 'Funding disbursed',
    description: 'Green Horizons Ecology Prize disbursed $8,500 to university bursar.',
    type: 'application'
  },
  {
    id: 'act-5',
    timestamp: '2026-10-12 11:05',
    title: 'Document verified in Vault',
    description: 'Official Academic Transcript successfully verified.',
    type: 'document'
  }
];

export const INITIAL_STATE: AppState = {
  version: 1,
  profile: INITIAL_STUDENT_PROFILE,
  bookmarkedScholarshipIds: ['sch-001', 'sch-002', 'sch-003', 'sch-006'],
  applications: INITIAL_APPLICATIONS,
  documents: INITIAL_DOCUMENTS,
  expenses: {
    tuition: 18000,
    accommodation: 9600,
    livingExpenses: 4500,
    booksAndSupplies: 1200,
    travelAndTransport: 1400,
    otherExpenses: 800
  },
  activities: INITIAL_ACTIVITIES,
  userPreferences: {
    compactView: false,
    currency: 'USD',
    showSimulatorTips: true
  }
};

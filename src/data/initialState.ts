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
  profileCompletionPercentage: 100
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
    notes: 'Work-in-progress draft tailored for STEM fellowships, currently 720 words. (Draft: does not satisfy verified document requirement yet)',
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
    targetSubmissionDate: '2026-11-20',
    notes: 'AI ethics statement is in draft in Vault; need to finalize before priority deadline.',
    personalStatementNotes: 'Highlight civic engagement project with the high school robotics club.',
    createdAt: '2026-10-20',
    updatedAt: '2026-11-04',
    tasks: [
      { id: 't-1', title: 'Upload & verify: Official Academic Transcript', completed: true, requiredDocumentName: 'Official Academic Transcript' },
      { id: 't-2', title: 'Upload & verify: Statement of Purpose (AI Ethics & Vision)', completed: false, requiredDocumentName: 'Statement of Purpose (AI Ethics & Vision)' },
      { id: 't-3', title: 'Upload & verify: Letter of Recommendation', completed: true, requiredDocumentName: 'Letter of Recommendation' },
      { id: 't-4', title: 'Upload & verify: Resume / CV', completed: false, requiredDocumentName: 'Resume / CV' },
      { id: 't-5', title: 'Review against sample conditions before submission', completed: true }
    ]
  },
  {
    id: 'app-002',
    scholarshipId: 'sch-002',
    status: 'Under Review',
    appliedDate: '2026-10-25',
    targetSubmissionDate: '2026-12-05',
    notes: 'Submitted full packet. Expected decision notice by first week of December.',
    createdAt: '2026-10-05',
    updatedAt: '2026-10-26',
    tasks: [
      { id: 't-10', title: 'Upload & verify: FAFSA or Official Household Income Proof', completed: true, requiredDocumentName: 'FAFSA or Official Household Income Proof' },
      { id: 't-11', title: 'Upload & verify: Official Academic Transcript', completed: true, requiredDocumentName: 'Official Academic Transcript' },
      { id: 't-12', title: 'Upload & verify: Verification of First-Generation Status', completed: true, requiredDocumentName: 'Verification of First-Generation Status' },
      { id: 't-13', title: 'Submit 500-word personal resilience essay', completed: true }
    ]
  },
  {
    id: 'app-003',
    scholarshipId: 'sch-003',
    status: 'Submitted',
    appliedDate: '2026-11-02',
    targetSubmissionDate: '2026-11-15',
    notes: 'Submitted before priority deadline. Portfolio link included in application portal.',
    createdAt: '2026-10-15',
    updatedAt: '2026-11-02',
    tasks: [
      { id: 't-20', title: 'Upload & verify: Official Academic Transcript', completed: true, requiredDocumentName: 'Official Academic Transcript' },
      { id: 't-21', title: 'Upload & verify: Letter of Recommendation', completed: true, requiredDocumentName: 'Letter of Recommendation' },
      { id: 't-22', title: 'Provide GitHub repository / project portfolio link', completed: true },
      { id: 't-23', title: 'Submit personal statement on women in tech', completed: true }
    ]
  },
  {
    id: 'app-004',
    scholarshipId: 'sch-006',
    status: 'Approved',
    appliedDate: '2026-09-10',
    targetSubmissionDate: '2026-11-28',
    fundingReceivedAmount: 8500,
    disbursementDate: '2026-10-15',
    notes: 'Award granted! Official check disbursed to financial aid bursar office on Oct 15.',
    createdAt: '2026-08-25',
    updatedAt: '2026-10-15',
    tasks: [
      { id: 't-30', title: 'Upload & verify: Official Academic Transcript', completed: true, requiredDocumentName: 'Official Academic Transcript' },
      { id: 't-31', title: 'Upload & verify: Letter of Recommendation', completed: true, requiredDocumentName: 'Letter of Recommendation' },
      { id: 't-32', title: 'Submit sustainability project synopsis', completed: true },
      { id: 't-33', title: 'Sign award acceptance letter & direct bursar disbursement', completed: true }
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

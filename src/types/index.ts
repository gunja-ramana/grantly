export type EducationLevel = 'High School' | 'Undergraduate' | 'Postgraduate' | 'Doctorate';

export type ScholarshipCategory =
  | 'Merit'
  | 'Need-Based'
  | 'STEM'
  | 'Diversity'
  | 'Athletic'
  | 'Arts & Humanities'
  | 'International'
  | 'Research';

export type ApplicationStatus =
  | 'Not Started'
  | 'Preparing'
  | 'Ready to Submit'
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Rejected';

export type DocumentCategory =
  | 'Identity'
  | 'Academic'
  | 'Income'
  | 'Recommendation'
  | 'Personal Statement'
  | 'Other';

export type DocumentStatus = 'Verified' | 'Pending Review' | 'Draft' | 'Expired';

export type DocumentRequirementStatus = 'Verified' | 'Pending Review' | 'Draft' | 'Missing';

export interface DocumentRequirementItem {
  requiredName: string;
  categoryHint?: DocumentCategory;
  status: DocumentRequirementStatus;
  matchedDoc?: VaultDocument;
  explanation: string;
}

export type EligibilityStatus =
  | 'Eligible'
  | 'Potentially Eligible'
  | 'Not Eligible'
  | 'Insufficient Information';

export interface EligibilityCriterionResult {
  criterion: string;
  met: boolean;
  explanation: string;
  isMissingData?: boolean;
}

export interface EligibilityReport {
  status: EligibilityStatus;
  score: number; // 0 - 100% deterministic match score
  matchingRequirements: string[];
  unmetRequirements: string[];
  missingInformation: string[];
  nextSteps: string[];
  detailedCriteria: EligibilityCriterionResult[];
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  providerType: 'University' | 'Foundation' | 'Government' | 'Corporate' | 'Non-Profit';
  awardAmount: number;
  currency: string;
  awardFrequency: 'One-time' | 'Annual' | 'Semester-wise' | 'Full Tuition';
  category: ScholarshipCategory;
  educationLevels: EducationLevel[];
  eligibleFields: string[];
  minGpa?: number;
  maxIncome?: number; // annual family income ceiling
  locationRequirements: string[]; // countries / states
  eligibleCitizenships?: string[];
  requiredDocuments: string[];
  applicationDeadline: string; // ISO date string YYYY-MM-DD
  officialUrl: string;
  summary: string;
  description: string;
  benefits: string[];
  applicationProcess: string[];
  importantConditions: string[];
  sourceAttribution: string;
  isFeatured?: boolean;
  isSampleData?: boolean;
  totalSeats?: number;
}

export interface StudentProfile {
  fullName: string;
  email: string;
  phone: string;
  citizenship: string;
  residenceCountry: string;
  stateProvince: string;
  educationLevel: EducationLevel;
  fieldOfStudy: string;
  institution: string;
  gpa: number;
  maxGpa: number;
  graduationYear: number;
  annualFamilyIncome: number;
  householdSize: number;
  firstGenerationStudent: boolean;
  minorityStatus: boolean;
  militaryAffiliation: boolean;
  disabilityStatus: boolean;
  intendedSpecialization: string;
  targetDestinations: string[];
  bioStatement: string;
  profileCompletionPercentage: number;
}

export interface ApplicationTask {
  id: string;
  title: string;
  completed: boolean;
  requiredDocumentName?: string;
  dueDate?: string;
  notes?: string;
}

export interface ApplicationRecord {
  id: string;
  scholarshipId: string;
  status: ApplicationStatus;
  appliedDate?: string;
  targetSubmissionDate: string;
  notes: string;
  tasks: ApplicationTask[];
  fundingReceivedAmount?: number;
  disbursementDate?: string;
  personalStatementNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VaultDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  fileName: string;
  fileSizeDisplay: string;
  fileType: string;
  uploadDate: string;
  expiryDate?: string;
  status: DocumentStatus;
  notes?: string;
  linkedScholarshipIds: string[];
}

export interface EducationExpenses {
  tuition: number;
  accommodation: number;
  livingExpenses: number;
  booksAndSupplies: number;
  travelAndTransport: number;
  otherExpenses: number;
}

export interface FundingMetrics {
  totalEstimatedExpenses: number;
  totalTrackedValue: number; // All tracked opportunities ($51,500)
  potentialFunding: number; // Potential, not yet awarded ($43,000)
  appliedFunding: number; // In Review or Submitted ($28,000)
  approvedFunding: number; // Approved ($8,500)
  receivedFunding: number; // Confirmed received ($8,500)
  remainingGapAfterReceived: number;
  remainingGapAfterApproved: number;
  remainingGapAfterApplied: number;
  remainingGapAfterPotential: number;
  receivedCoveragePercentage: number;
  potentialCoveragePercentage: number;
}

export interface OpportunityRadarItem {
  scholarship: Scholarship;
  eligibilityReport: EligibilityReport;
  priorityScore: number; // 0-100 deterministic weighted
  priorityLevel: 'High' | 'Medium' | 'Low';
  reasons: string[];
  daysRemaining: number;
  isOverdue: boolean;
  actionRequired: string;
  isBookmarked: boolean;
  hasActiveApplication: boolean;
  applicationStatus?: ApplicationStatus;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'bookmark' | 'application' | 'status_change' | 'document' | 'profile' | 'task';
}

export interface AppState {
  version: number;
  profile: StudentProfile;
  bookmarkedScholarshipIds: string[];
  applications: ApplicationRecord[];
  documents: VaultDocument[];
  expenses: EducationExpenses;
  activities: ActivityItem[];
  userPreferences: {
    compactView: boolean;
    currency: string;
    showSimulatorTips: boolean;
  };
}

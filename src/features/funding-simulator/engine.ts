import { EducationExpenses, ApplicationRecord, Scholarship, VaultDocument, StudentProfile } from '../../types';

export interface FundingMetrics {
  totalEstimatedExpenses: number;
  potentialFunding: number;
  appliedFunding: number;
  approvedFunding: number;
  receivedFunding: number;
  remainingGapAfterReceived: number;
  remainingGapAfterApproved: number;
  remainingGapAfterPotential: number;
  receivedCoveragePercentage: number;
  potentialCoveragePercentage: number;
}

export function calculateFundingMetrics(
  expenses: EducationExpenses,
  applications: ApplicationRecord[],
  scholarships: Scholarship[],
  bookmarkedIds: string[]
): FundingMetrics {
  const totalEstimatedExpenses =
    (expenses.tuition || 0) +
    (expenses.accommodation || 0) +
    (expenses.livingExpenses || 0) +
    (expenses.booksAndSupplies || 0) +
    (expenses.travelAndTransport || 0) +
    (expenses.otherExpenses || 0);

  // 1. Potential Funding: Total award sum of all bookmarked opportunities or active applications
  const potentialScholarshipIds = Array.from(
    new Set([...bookmarkedIds, ...applications.map(a => a.scholarshipId)])
  );
  const potentialFunding = potentialScholarshipIds.reduce((sum, id) => {
    const sch = scholarships.find(s => s.id === id);
    return sum + (sch ? sch.awardAmount : 0);
  }, 0);

  // 2. Applied Funding: Sum of applications in 'Submitted' or 'Under Review'
  const appliedApplications = applications.filter(
    a => a.status === 'Submitted' || a.status === 'Under Review'
  );
  const appliedFunding = appliedApplications.reduce((sum, app) => {
    const sch = scholarships.find(s => s.id === app.scholarshipId);
    return sum + (sch ? sch.awardAmount : 0);
  }, 0);

  // 3. Approved Funding: Sum of applications in 'Approved' status
  const approvedApplications = applications.filter(a => a.status === 'Approved');
  const approvedFunding = approvedApplications.reduce((sum, app) => {
    const sch = scholarships.find(s => s.id === app.scholarshipId);
    return sum + (sch ? sch.awardAmount : 0);
  }, 0);

  // 4. Received Funding: Actual disbursed amounts recorded in application records
  const receivedFunding = applications.reduce((sum, app) => {
    return sum + (app.fundingReceivedAmount || 0);
  }, 0);

  const remainingGapAfterReceived = Math.max(0, totalEstimatedExpenses - receivedFunding);
  const remainingGapAfterApproved = Math.max(0, totalEstimatedExpenses - approvedFunding);
  const remainingGapAfterPotential = Math.max(0, totalEstimatedExpenses - potentialFunding);

  const receivedCoveragePercentage = totalEstimatedExpenses > 0
    ? Math.min(100, Math.round((receivedFunding / totalEstimatedExpenses) * 100))
    : 0;

  const potentialCoveragePercentage = totalEstimatedExpenses > 0
    ? Math.min(100, Math.round((potentialFunding / totalEstimatedExpenses) * 100))
    : 0;

  return {
    totalEstimatedExpenses,
    potentialFunding,
    appliedFunding,
    approvedFunding,
    receivedFunding,
    remainingGapAfterReceived,
    remainingGapAfterApproved,
    remainingGapAfterPotential,
    receivedCoveragePercentage,
    potentialCoveragePercentage
  };
}

export interface StudentMomentumStats {
  momentumScore: number; // 0 - 100
  momentumLevel: 'Starting Out' | 'Building Momentum' | 'Accelerating' | 'Unstoppable';
  profileCompletion: number;
  bookmarkedCount: number;
  applicationsTotal: number;
  applicationsSubmitted: number;
  applicationsApproved: number;
  documentsVerified: number;
  tasksCompleted: number;
  totalTasks: number;
  milestones: { title: string; achieved: boolean; description: string }[];
}

export function calculateStudentMomentum(
  profile: StudentProfile,
  bookmarkedIds: string[],
  applications: ApplicationRecord[],
  documents: VaultDocument[]
): StudentMomentumStats {
  const profileCompletion = profile.profileCompletionPercentage || 0;
  const bookmarkedCount = bookmarkedIds.length;
  const applicationsTotal = applications.length;
  const applicationsSubmitted = applications.filter(
    a => a.status === 'Submitted' || a.status === 'Under Review' || a.status === 'Approved'
  ).length;
  const applicationsApproved = applications.filter(a => a.status === 'Approved').length;
  const documentsVerified = documents.filter(d => d.status === 'Verified').length;

  let tasksCompleted = 0;
  let totalTasks = 0;
  applications.forEach(a => {
    totalTasks += a.tasks.length;
    tasksCompleted += a.tasks.filter(t => t.completed).length;
  });

  // Calculate weighted momentum score (0-100)
  let score = 0;
  // Profile: up to 20 pts
  score += Math.round((profileCompletion / 100) * 20);
  // Bookmarks: up to 15 pts (3 bookmarks maxed)
  score += Math.min(15, bookmarkedCount * 5);
  // Documents verified: up to 20 pts (4 docs maxed)
  score += Math.min(20, documentsVerified * 5);
  // Task completion: up to 25 pts
  if (totalTasks > 0) {
    score += Math.round((tasksCompleted / totalTasks) * 25);
  }
  // Applications submitted/approved: up to 20 pts
  score += Math.min(20, applicationsSubmitted * 10 + applicationsApproved * 10);

  const momentumScore = Math.min(100, Math.max(5, score));

  let momentumLevel: StudentMomentumStats['momentumLevel'] = 'Starting Out';
  if (momentumScore >= 80) {
    momentumLevel = 'Unstoppable';
  } else if (momentumScore >= 60) {
    momentumLevel = 'Accelerating';
  } else if (momentumScore >= 35) {
    momentumLevel = 'Building Momentum';
  }

  const milestones = [
    {
      title: 'Opportunity DNA Initialized',
      achieved: profileCompletion >= 70,
      description: 'Profile has sufficient academic & background data for high-confidence matching.'
    },
    {
      title: 'Document Vault Primed',
      achieved: documentsVerified >= 3,
      description: 'At least 3 official documents uploaded and verified in vault.'
    },
    {
      title: 'Opportunity Radar Active',
      achieved: bookmarkedCount >= 2,
      description: 'Multiple high-yield scholarships saved and monitored.'
    },
    {
      title: 'Copilot Checklist Momentum',
      achieved: tasksCompleted >= 5,
      description: 'Completed 5+ actionable application preparation checklist items.'
    },
    {
      title: 'First Formal Submission',
      achieved: applicationsSubmitted >= 1,
      description: 'Submitted an application to official scholarship provider.'
    },
    {
      title: 'Funding Secured',
      achieved: applicationsApproved >= 1,
      description: 'At least one scholarship approved with confirmed award allocation.'
    }
  ];

  return {
    momentumScore,
    momentumLevel,
    profileCompletion,
    bookmarkedCount,
    applicationsTotal,
    applicationsSubmitted,
    applicationsApproved,
    documentsVerified,
    tasksCompleted,
    totalTasks,
    milestones
  };
}

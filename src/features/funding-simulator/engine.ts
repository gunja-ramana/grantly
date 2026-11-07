import { EducationExpenses, ApplicationRecord, Scholarship, VaultDocument, StudentProfile, FundingMetrics } from '../../types';

export type { FundingMetrics };

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

  // 1. Identify applications that are approved or have confirmed received disbursements
  const approvedOrReceivedAppIds = new Set(
    applications
      .filter(a => a.status === 'Approved' || (a.fundingReceivedAmount !== undefined && a.fundingReceivedAmount > 0))
      .map(a => a.scholarshipId)
  );

  // 2. All Tracked Opportunity IDs (Saved wishlist or active application tracker)
  const allTrackedIds = Array.from(
    new Set([...bookmarkedIds, ...applications.map(a => a.scholarshipId)])
  );

  // Total Tracked Opportunity Value: Aggregate award value of all opportunities under consideration ($51,500)
  const totalTrackedValue = allTrackedIds.reduce((sum, id) => {
    const sch = scholarships.find(s => s.id === id);
    return sum + (sch ? sch.awardAmount : 0);
  }, 0);

  // 3. Potential Funding (Not Yet Awarded): Tracked opportunities that are NOT already approved/received ($43,000)
  const potentialScholarshipIds = allTrackedIds.filter(id => !approvedOrReceivedAppIds.has(id));
  const potentialFunding = potentialScholarshipIds.reduce((sum, id) => {
    const sch = scholarships.find(s => s.id === id);
    return sum + (sch ? sch.awardAmount : 0);
  }, 0);

  // 4. Applied Funding: Sum of applications explicitly in 'Submitted' or 'Under Review' status ($28,000)
  const appliedApplications = applications.filter(
    a => a.status === 'Submitted' || a.status === 'Under Review'
  );
  const appliedFunding = appliedApplications.reduce((sum, app) => {
    const sch = scholarships.find(s => s.id === app.scholarshipId);
    return sum + (sch ? sch.awardAmount : 0);
  }, 0);

  // 5. Approved Funding: Sum of applications in 'Approved' status ($8,500)
  const approvedApplications = applications.filter(a => a.status === 'Approved');
  const approvedFunding = approvedApplications.reduce((sum, app) => {
    const sch = scholarships.find(s => s.id === app.scholarshipId);
    return sum + (sch ? sch.awardAmount : 0);
  }, 0);

  // 6. Received Funding: Actual confirmed bursar disbursements recorded ($8,500)
  const receivedFunding = applications.reduce((sum, app) => {
    return sum + (app.fundingReceivedAmount || 0);
  }, 0);

  // 7. Gaps
  const remainingGapAfterReceived = Math.max(0, totalEstimatedExpenses - receivedFunding);
  const remainingGapAfterApproved = Math.max(0, totalEstimatedExpenses - Math.max(approvedFunding, receivedFunding));
  const remainingGapAfterApplied = Math.max(0, totalEstimatedExpenses - (receivedFunding + appliedFunding));
  const remainingGapAfterPotential = Math.max(0, totalEstimatedExpenses - (receivedFunding + potentialFunding));

  const receivedCoveragePercentage = totalEstimatedExpenses > 0
    ? Math.min(100, Math.round((receivedFunding / totalEstimatedExpenses) * 100))
    : 0;

  const potentialCoveragePercentage = totalEstimatedExpenses > 0
    ? Math.min(100, Math.round(((receivedFunding + potentialFunding) / totalEstimatedExpenses) * 100))
    : 0;

  return {
    totalEstimatedExpenses,
    totalTrackedValue,
    potentialFunding,
    appliedFunding,
    approvedFunding,
    receivedFunding,
    remainingGapAfterReceived,
    remainingGapAfterApproved,
    remainingGapAfterApplied,
    remainingGapAfterPotential,
    receivedCoveragePercentage,
    potentialCoveragePercentage
  };
}

export interface StudentMomentumStats {
  momentumScore: number; // 0 - 100 multi-pillar score
  momentumLevel: 'Starting Out' | 'Building Momentum' | 'Accelerating' | 'Unstoppable';
  profileCompletion: number;
  bookmarkedCount: number;
  applicationsTotal: number;
  applicationsSubmitted: number;
  applicationsApproved: number;
  documentsVerified: number;
  tasksCompleted: number;
  totalTasks: number;
  taskCompletionPercentage: number;
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

  const taskCompletionPercentage = totalTasks > 0
    ? Math.round((tasksCompleted / totalTasks) * 100)
    : 0;

  // Calculate weighted momentum score (0-100)
  // 1. Profile: up to 20 pts
  let score = Math.round((profileCompletion / 100) * 20);
  // 2. Bookmarks: up to 15 pts (3 bookmarks maxed)
  score += Math.min(15, bookmarkedCount * 5);
  // 3. Documents verified: up to 20 pts (4 docs maxed)
  score += Math.min(20, documentsVerified * 5);
  // 4. Task completion: up to 25 pts
  if (totalTasks > 0) {
    score += Math.round((tasksCompleted / totalTasks) * 25);
  }
  // 5. Applications submitted/approved: up to 20 pts
  score += Math.min(20, applicationsSubmitted * 8 + applicationsApproved * 12);

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
    taskCompletionPercentage,
    milestones
  };
}

import { Scholarship, StudentProfile, ApplicationRecord, VaultDocument, OpportunityRadarItem } from '../../types';
import { evaluateEligibility } from '../eligibility/engine';

export function calculateOpportunityRadar(
  scholarships: Scholarship[],
  profile: StudentProfile,
  applications: ApplicationRecord[],
  documents: VaultDocument[],
  bookmarkedIds: string[]
): OpportunityRadarItem[] {
  const today = new Date();

  return scholarships.map(scholarship => {
    const eligibilityReport = evaluateEligibility(scholarship, profile);
    const application = applications.find(a => a.scholarshipId === scholarship.id);
    const isBookmarked = bookmarkedIds.includes(scholarship.id);

    // Calculate deadline days
    const deadlineDate = new Date(scholarship.applicationDeadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isOverdue = daysRemaining < 0;

    // Check Vault documents held
    const requiredDocs = scholarship.requiredDocuments || [];
    const heldDocs = requiredDocs.filter(reqDoc =>
      documents.some(doc =>
        doc.status === 'Verified' &&
        (doc.title.toLowerCase().includes(reqDoc.toLowerCase()) ||
         reqDoc.toLowerCase().includes(doc.category.toLowerCase()))
      )
    );
    const missingDocsCount = requiredDocs.length - heldDocs.length;

    // Deterministic Priority Score Calculation (0-100)
    let score = 0;
    const reasons: string[] = [];
    let actionRequired = 'Review requirements and bookmark';

    // 1. Eligibility Weight (Max 40 pts)
    if (eligibilityReport.status === 'Eligible') {
      score += 40;
      reasons.push('High eligibility match based on your academic & demographic profile.');
    } else if (eligibilityReport.status === 'Potentially Eligible') {
      score += 25;
      reasons.push('Potentially eligible; complete missing profile fields to confirm.');
    } else if (eligibilityReport.status === 'Insufficient Information') {
      score += 15;
      reasons.push('Insufficient profile data to verify full qualification.');
    } else {
      score += 0;
      reasons.push('Does not meet current academic or background criteria.');
    }

    // 2. Deadline Urgency Weight (Max 25 pts)
    if (!isOverdue) {
      if (daysRemaining <= 7) {
        score += 25;
        reasons.push(`Critical deadline: only ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining.`);
        actionRequired = 'Urgent: Complete checklist and submit application now';
      } else if (daysRemaining <= 14) {
        score += 20;
        reasons.push(`Approaching deadline in ${daysRemaining} days.`);
        actionRequired = 'Finalize required documents and review personal statement';
      } else if (daysRemaining <= 30) {
        score += 15;
        reasons.push(`Deadline is within 30 days (${scholarship.applicationDeadline}).`);
      } else {
        score += 10;
        reasons.push(`Standard timeline: deadline is ${daysRemaining} days away.`);
      }
    } else {
      score = Math.max(0, score - 30);
      reasons.push('Application deadline has passed.');
      actionRequired = 'Archived: Deadline passed';
    }

    // 3. Award Value Weight (Max 20 pts)
    if (scholarship.awardAmount >= 20000) {
      score += 20;
      reasons.push(`Major endowment: $${scholarship.awardAmount.toLocaleString()} award.`);
    } else if (scholarship.awardAmount >= 10000) {
      score += 15;
      reasons.push(`High value: $${scholarship.awardAmount.toLocaleString()} funding.`);
    } else {
      score += 10;
    }

    // 4. Document Preparedness & Vault Alignment (Max 15 pts)
    if (missingDocsCount === 0 && requiredDocs.length > 0) {
      score += 15;
      reasons.push('All required documents already verified in your Document Vault.');
    } else if (missingDocsCount > 0 && heldDocs.length > 0) {
      score += 8;
      reasons.push(`${heldDocs.length} of ${requiredDocs.length} documents ready; ${missingDocsCount} pending.`);
    }

    // Dynamic Action Guidance based on Application Status
    if (application) {
      if (application.status === 'Preparing') {
        const completedTasks = application.tasks.filter(t => t.completed).length;
        const totalTasks = application.tasks.length;
        actionRequired = `Continue preparation: ${completedTasks}/${totalTasks} checklist tasks done`;
      } else if (application.status === 'Ready to Submit') {
        actionRequired = 'Checklist complete! Proceed to official portal and submit';
      } else if (application.status === 'Submitted') {
        actionRequired = 'Submitted! Tracking decision notification';
      } else if (application.status === 'Approved') {
        actionRequired = 'Awarded! Confirm disbursement with university bursar';
      }
    } else if (isBookmarked) {
      actionRequired = 'Bookmarked: Click "Add to Tracker" to initiate copilot checklist';
    }

    let priorityLevel: OpportunityRadarItem['priorityLevel'] = 'Low';
    if (score >= 70 && !isOverdue) {
      priorityLevel = 'High';
    } else if (score >= 45 && !isOverdue) {
      priorityLevel = 'Medium';
    }

    return {
      scholarship,
      eligibilityReport,
      priorityScore: Math.min(100, score),
      priorityLevel,
      reasons,
      daysRemaining,
      isOverdue,
      actionRequired,
      isBookmarked,
      hasActiveApplication: Boolean(application),
      applicationStatus: application?.status
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);
}

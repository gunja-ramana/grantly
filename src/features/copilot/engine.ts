import {
  Scholarship,
  StudentProfile,
  VaultDocument,
  ApplicationRecord,
  ApplicationTask,
  DocumentRequirementItem
} from '../../types';

/**
 * Matches a required scholarship document against the student's Document Vault
 * enforcing strict category and title affinity.
 */
export function matchDocumentToRequirement(
  reqName: string,
  vaultDocs: VaultDocument[]
): DocumentRequirementItem {
  const reqLower = reqName.toLowerCase();

  // Find candidate by category affinity or title matching
  const candidate = vaultDocs.find(doc => {
    const titleLower = doc.title.toLowerCase();
    const fileLower = doc.fileName.toLowerCase();

    // 1. Transcript / Academic
    if (reqLower.includes('transcript') || reqLower.includes('academic record') || reqLower.includes('report card')) {
      return doc.category === 'Academic' || titleLower.includes('transcript') || fileLower.includes('transcript');
    }

    // 2. Income / Financial Proof / FAFSA / Tax
    if (reqLower.includes('income') || reqLower.includes('fafsa') || reqLower.includes('tax') || reqLower.includes('hardship')) {
      return doc.category === 'Income' || titleLower.includes('income') || titleLower.includes('tax') || fileLower.includes('tax');
    }

    // 3. Recommendation Letters / References
    if (reqLower.includes('recommendation') || reqLower.includes('reference') || reqLower.includes('endorsement')) {
      return doc.category === 'Recommendation' || titleLower.includes('recommendation') || fileLower.includes('recommendation');
    }

    // 4. Statement of Purpose / Essays / Portfolio
    if (reqLower.includes('statement') || reqLower.includes('essay') || reqLower.includes('purpose') || reqLower.includes('portfolio') || reqLower.includes('proposal')) {
      return doc.category === 'Personal Statement' || titleLower.includes('statement') || titleLower.includes('essay') || titleLower.includes('proposal');
    }

    // 5. Identity / First-Gen / Citizenship / Status
    if (reqLower.includes('first-generation') || reqLower.includes('identity') || reqLower.includes('status') || reqLower.includes('citizenship') || reqLower.includes('visa')) {
      return doc.category === 'Identity' || titleLower.includes('firstgen') || titleLower.includes('verification');
    }

    // Direct title matching fallback
    return titleLower.includes(reqLower) || reqLower.includes(titleLower);
  });

  if (!candidate) {
    return {
      requiredName: reqName,
      status: 'Missing',
      explanation: 'No matching document found in your Document Vault.'
    };
  }

  // Check valid status
  if (candidate.status === 'Verified') {
    return {
      requiredName: reqName,
      status: 'Verified',
      matchedDoc: candidate,
      explanation: `Verified document in Vault: "${candidate.title}" (${candidate.fileName})`
    };
  }

  if (candidate.status === 'Pending Review') {
    return {
      requiredName: reqName,
      status: 'Pending Review',
      matchedDoc: candidate,
      explanation: `Document held in Vault is pending certification: "${candidate.title}". Does not satisfy completed requirement.`
    };
  }

  if (candidate.status === 'Draft') {
    return {
      requiredName: reqName,
      status: 'Draft',
      matchedDoc: candidate,
      explanation: `Document held in Vault is marked as Draft: "${candidate.title}". Drafts do not satisfy completed requirement.`
    };
  }

  return {
    requiredName: reqName,
    status: 'Missing',
    matchedDoc: candidate,
    explanation: `Document in Vault is expired: "${candidate.title}". Requires updated certificate.`
  };
}

export interface CopilotAnalysis {
  scholarship: Scholarship;
  readinessPercentage: number;
  totalRequirementsCount: number;
  completedRequirementsCount: number;
  documentRequirements: DocumentRequirementItem[];
  verifiedDocuments: DocumentRequirementItem[];
  pendingDocuments: DocumentRequirementItem[];
  draftDocuments: DocumentRequirementItem[];
  missingDocuments: DocumentRequirementItem[];
  recommendedChecklist: ApplicationTask[];
  brainstormPrompts: { angle: string; explanation: string; suggestedHooks: string[] };
  commonMistakes: string[];
  submissionReadinessStatement: string;
}

export function generateCopilotAnalysis(
  scholarship: Scholarship,
  profile: StudentProfile,
  vaultDocs: VaultDocument[],
  application?: ApplicationRecord
): CopilotAnalysis {
  // 1. Cross-reference every required document against Vault
  const documentRequirements: DocumentRequirementItem[] = scholarship.requiredDocuments.map(reqName =>
    matchDocumentToRequirement(reqName, vaultDocs)
  );

  const verifiedDocuments = documentRequirements.filter(d => d.status === 'Verified');
  const pendingDocuments = documentRequirements.filter(d => d.status === 'Pending Review');
  const draftDocuments = documentRequirements.filter(d => d.status === 'Draft');
  const missingDocuments = documentRequirements.filter(d => d.status === 'Missing');

  // 2. Synchronize application tasks
  let tasks: ApplicationTask[] = [];

  if (application && application.tasks.length > 0) {
    // Preserve existing application tasks, but synchronize tasks tied to required documents
    tasks = application.tasks.map(t => {
      if (t.requiredDocumentName) {
        const match = matchDocumentToRequirement(t.requiredDocumentName, vaultDocs);
        return {
          ...t,
          completed: match.status === 'Verified'
        };
      }
      return t;
    });
  } else {
    // Generate structured checklist from scratch
    tasks = [
      ...scholarship.requiredDocuments.map((docName, idx) => {
        const match = matchDocumentToRequirement(docName, vaultDocs);
        return {
          id: `gen-task-doc-${idx}`,
          title: `Upload & verify: ${docName}`,
          completed: match.status === 'Verified',
          requiredDocumentName: docName
        };
      }),
      {
        id: `gen-task-statement`,
        title: `Draft and polish Personal Statement tailored to ${scholarship.title}`,
        completed: false
      },
      {
        id: `gen-task-criteria`,
        title: `Verify academic standing meets minimum GPA threshold (${scholarship.minGpa?.toFixed(2) || 'N/A'})`,
        completed: (profile.gpa || 0) >= (scholarship.minGpa || 0)
      },
      {
        id: `gen-task-review`,
        title: `Final proofreading against sample conditions before submission`,
        completed: false
      }
    ];
  }

  const totalRequirementsCount = tasks.length;
  const completedRequirementsCount = tasks.filter(t => t.completed).length;
  const readinessPercentage = totalRequirementsCount > 0
    ? Math.round((completedRequirementsCount / totalRequirementsCount) * 100)
    : 0;

  // 3. Deterministic Contextual Brainstorming for Statement
  const studentMajor = profile.fieldOfStudy || 'your discipline';
  const brainstormPrompts = {
    angle: `Connecting ${studentMajor} with ${scholarship.category} Impact`,
    explanation: `Demonstration essay strategy: Highlight the intersection between your academic focus in ${studentMajor} and ${scholarship.provider}'s program goals.`,
    suggestedHooks: [
      `"When I first encountered challenges in ${studentMajor}, I realized that financial barriers should never dictate the boundaries of research innovation..."`,
      `"As a ${profile.firstGenerationStudent ? 'first-generation ' : ''}student at ${profile.institution || 'university'}, my focus in ${profile.intendedSpecialization || studentMajor} is driven by a commitment to solving real community bottlenecks..."`,
      `"Receiving this opportunity will bridge the financial deficit in my education, allowing me to dedicate 20+ hours weekly to impactful research rather than external part-time jobs."`
    ]
  };

  // 4. Common pitfalls
  const commonMistakes = [
    `Submitting generic personal essays that fail to address ${scholarship.provider}'s specific focus area.`,
    'Attaching uncertified or unofficial transcript screenshots rather than stamped registrar PDFs.',
    'Requesting faculty recommendation letters less than 10 days before the deadline.',
    'Ignoring the file size and formatting limits specified in provider instructions.'
  ];

  let submissionReadinessStatement = 'Early Preparation: Mandatory verified documents or tasks are still pending.';
  if (readinessPercentage === 100) {
    submissionReadinessStatement = 'Ready to Submit! All required documents verified in Vault and tasks complete.';
  } else if (readinessPercentage >= 70) {
    submissionReadinessStatement = 'High Readiness: Only final review or remaining document verification needed.';
  } else if (readinessPercentage >= 40) {
    submissionReadinessStatement = 'In Progress: Tasks underway; ensure draft documents are updated to verified status.';
  }

  return {
    scholarship,
    readinessPercentage,
    totalRequirementsCount,
    completedRequirementsCount,
    documentRequirements,
    verifiedDocuments,
    pendingDocuments,
    draftDocuments,
    missingDocuments,
    recommendedChecklist: tasks,
    brainstormPrompts,
    commonMistakes,
    submissionReadinessStatement
  };
}

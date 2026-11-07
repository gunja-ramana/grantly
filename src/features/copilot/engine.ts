import { Scholarship, StudentProfile, VaultDocument, ApplicationRecord, ApplicationTask } from '../../types';

export interface CopilotAnalysis {
  scholarship: Scholarship;
  readinessPercentage: number;
  totalRequirementsCount: number;
  completedRequirementsCount: number;
  missingDocuments: string[];
  heldDocuments: { requiredName: string; matchedDoc: VaultDocument }[];
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
  const missingDocuments: string[] = [];
  const heldDocuments: { requiredName: string; matchedDoc: VaultDocument }[] = [];

  // 1. Cross-reference required docs with Vault
  scholarship.requiredDocuments.forEach(reqName => {
    const matched = vaultDocs.find(
      doc =>
        doc.status === 'Verified' &&
        (doc.title.toLowerCase().includes(reqName.toLowerCase()) ||
         reqName.toLowerCase().includes(doc.title.toLowerCase()) ||
         reqName.toLowerCase().includes(doc.category.toLowerCase()))
    );

    if (matched) {
      heldDocuments.push({ requiredName: reqName, matchedDoc: matched });
    } else {
      missingDocuments.push(reqName);
    }
  });

  // 2. Build or read checklist
  let tasks: ApplicationTask[] = [];
  if (application && application.tasks.length > 0) {
    tasks = application.tasks;
  } else {
    // Generate initial structured checklist
    tasks = [
      ...scholarship.requiredDocuments.map((docName, idx) => ({
        id: `gen-task-doc-${idx}`,
        title: `Upload & verify: ${docName}`,
        completed: heldDocuments.some(h => h.requiredName === docName),
        requiredDocumentName: docName
      })),
      {
        id: `gen-task-statement`,
        title: `Draft and polish Personal Statement / Essay tailored to ${scholarship.title}`,
        completed: false
      },
      {
        id: `gen-task-criteria`,
        title: `Verify academic standing & GPA cutoff requirements`,
        completed: (profile.gpa || 0) >= (scholarship.minGpa || 0)
      },
      {
        id: `gen-task-review`,
        title: `Final proofreading against provider conditions before submission`,
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
    explanation: `The reviewers for ${scholarship.provider} prioritize candidates who articulate a clear intersection between academic mastery and practical societal contribution.`,
    suggestedHooks: [
      `"When I first encountered challenges in ${studentMajor}, I realized that financial barriers should never dictate the boundaries of research innovation..."`,
      `"As a ${profile.firstGenerationStudent ? 'first-generation ' : ''}student at ${profile.institution || 'university'}, my focus in ${profile.intendedSpecialization || studentMajor} is driven by a commitment to solving real community bottlenecks..."`,
      `"Receiving the ${scholarship.title} will bridge the funding deficit in my education, allowing me to dedicate 20+ hours weekly to impactful research rather than external part-time jobs."`
    ]
  };

  // 4. Common pitfalls
  const commonMistakes = [
    `Submitting generic personal essays that fail to mention ${scholarship.provider}'s specific mission.`,
    'Attaching uncertified or unofficial transcript screenshots rather than stamped registrar PDFs.',
    'Requesting recommendation letters less than 10 days before the deadline.',
    'Ignoring the file size and formatting limits specified in the official portal.'
  ];

  let submissionReadinessStatement = 'Early Preparation: Checklist items still need attention.';
  if (readinessPercentage === 100) {
    submissionReadinessStatement = 'Ready to Submit! All items checked and documents confirmed.';
  } else if (readinessPercentage >= 70) {
    submissionReadinessStatement = 'High Readiness: Only final review or 1-2 items remaining.';
  } else if (readinessPercentage >= 40) {
    submissionReadinessStatement = 'In Progress: Documents and tasks underway.';
  }

  return {
    scholarship,
    readinessPercentage,
    totalRequirementsCount,
    completedRequirementsCount,
    missingDocuments,
    heldDocuments,
    recommendedChecklist: tasks,
    brainstormPrompts,
    commonMistakes,
    submissionReadinessStatement
  };
}

import { Scholarship, StudentProfile, EligibilityReport, EligibilityCriterionResult } from '../../types';

export function evaluateEligibility(scholarship: Scholarship, profile: StudentProfile): EligibilityReport {
  const criteria: EligibilityCriterionResult[] = [];
  const matchingRequirements: string[] = [];
  const unmetRequirements: string[] = [];
  const missingInformation: string[] = [];
  const nextSteps: string[] = [];

  // 1. Education Level Check
  if (!profile.educationLevel) {
    missingInformation.push('Current education level not provided in your profile.');
    criteria.push({
      criterion: 'Education Level',
      met: false,
      isMissingData: true,
      explanation: `Requires: ${scholarship.educationLevels.join(' or ')}. Profile level is unspecified.`
    });
  } else if (scholarship.educationLevels.includes(profile.educationLevel)) {
    matchingRequirements.push(`Matches required education level: ${profile.educationLevel}`);
    criteria.push({
      criterion: 'Education Level',
      met: true,
      explanation: `Your level (${profile.educationLevel}) is supported.`
    });
  } else {
    unmetRequirements.push(`Requires ${scholarship.educationLevels.join(' or ')}, but you are currently listed as ${profile.educationLevel}`);
    criteria.push({
      criterion: 'Education Level',
      met: false,
      explanation: `Requires: ${scholarship.educationLevels.join(' or ')}. You are listed as ${profile.educationLevel}.`
    });
  }

  // 2. Academic Score / GPA Check
  if (scholarship.minGpa !== undefined) {
    if (profile.gpa === undefined || profile.gpa === 0) {
      missingInformation.push('Cumulative GPA is missing or recorded as 0 in profile.');
      criteria.push({
        criterion: 'Minimum GPA',
        met: false,
        isMissingData: true,
        explanation: `Requires minimum GPA of ${scholarship.minGpa.toFixed(2)}. Your profile GPA is not yet set.`
      });
    } else if (profile.gpa >= scholarship.minGpa) {
      matchingRequirements.push(`Meets GPA threshold: ${profile.gpa.toFixed(2)} ≥ ${scholarship.minGpa.toFixed(2)}`);
      criteria.push({
        criterion: 'Minimum GPA',
        met: true,
        explanation: `Your GPA of ${profile.gpa.toFixed(2)} satisfies the minimum cutoff of ${scholarship.minGpa.toFixed(2)}.`
      });
    } else {
      unmetRequirements.push(`Current GPA (${profile.gpa.toFixed(2)}) is below minimum cutoff of ${scholarship.minGpa.toFixed(2)}`);
      criteria.push({
        criterion: 'Minimum GPA',
        met: false,
        explanation: `Your GPA (${profile.gpa.toFixed(2)}) does not meet the minimum requirement of ${scholarship.minGpa.toFixed(2)}.`
      });
    }
  }

  // 3. Field of Study Check
  if (scholarship.eligibleFields.includes('All Fields')) {
    matchingRequirements.push('Open to all fields of study.');
    criteria.push({
      criterion: 'Field of Study',
      met: true,
      explanation: 'Open to all academic disciplines.'
    });
  } else if (!profile.fieldOfStudy) {
    missingInformation.push('Field of study / major is not recorded in your profile.');
    criteria.push({
      criterion: 'Field of Study',
      met: false,
      isMissingData: true,
      explanation: `Requires one of: ${scholarship.eligibleFields.join(', ')}. Your major is blank.`
    });
  } else {
    const studentMajor = profile.fieldOfStudy.toLowerCase();
    const isFieldMatch = scholarship.eligibleFields.some(field =>
      field.toLowerCase().includes(studentMajor) || studentMajor.includes(field.toLowerCase())
    );
    if (isFieldMatch) {
      matchingRequirements.push(`Major (${profile.fieldOfStudy}) matches eligible target disciplines.`);
      criteria.push({
        criterion: 'Field of Study',
        met: true,
        explanation: `Your field of study (${profile.fieldOfStudy}) aligns with program focus.`
      });
    } else {
      unmetRequirements.push(`Field of study (${profile.fieldOfStudy}) is not in listed disciplines: ${scholarship.eligibleFields.slice(0, 3).join(', ')}...`);
      criteria.push({
        criterion: 'Field of Study',
        met: false,
        explanation: `Designated for: ${scholarship.eligibleFields.join(', ')}.`
      });
    }
  }

  // 4. Financial / Income Ceiling Check
  if (scholarship.maxIncome !== undefined) {
    if (profile.annualFamilyIncome === undefined || profile.annualFamilyIncome === 0) {
      missingInformation.push('Annual household income information not provided in profile.');
      criteria.push({
        criterion: 'Family Income Ceiling',
        met: false,
        isMissingData: true,
        explanation: `Requires annual household income under $${scholarship.maxIncome.toLocaleString()}. Set income in profile.`
      });
    } else if (profile.annualFamilyIncome <= scholarship.maxIncome) {
      matchingRequirements.push(`Income qualification verified: $${profile.annualFamilyIncome.toLocaleString()} ≤ $${scholarship.maxIncome.toLocaleString()}`);
      criteria.push({
        criterion: 'Family Income Ceiling',
        met: true,
        explanation: `Household income ($${profile.annualFamilyIncome.toLocaleString()}) falls within eligibility cap ($${scholarship.maxIncome.toLocaleString()}).`
      });
    } else {
      unmetRequirements.push(`Household income ($${profile.annualFamilyIncome.toLocaleString()}) exceeds program cap of $${scholarship.maxIncome.toLocaleString()}`);
      criteria.push({
        criterion: 'Family Income Ceiling',
        met: false,
        explanation: `Income exceeds maximum allowable ceiling of $${scholarship.maxIncome.toLocaleString()}.`
      });
    }
  }

  // 5. Category-Specific DNA Rules (First-Gen, Diversity)
  if (scholarship.category === 'Need-Based' && scholarship.title.toLowerCase().includes('first-generation')) {
    if (profile.firstGenerationStudent) {
      matchingRequirements.push('First-generation student status verified in student profile.');
      criteria.push({
        criterion: 'First-Gen Status',
        met: true,
        explanation: 'You are registered as a first-generation college student.'
      });
    } else {
      unmetRequirements.push('This grant requires first-generation college student status.');
      criteria.push({
        criterion: 'First-Gen Status',
        met: false,
        explanation: 'Designated specifically for students whose parents did not graduate from university.'
      });
    }
  }

  // Determine overall status and score
  const totalCriteria = criteria.length;
  const metCount = criteria.filter(c => c.met).length;
  const missingCount = criteria.filter(c => c.isMissingData).length;
  const unmetCount = criteria.filter(c => !c.met && !c.isMissingData).length;

  let score = 0;
  if (totalCriteria > 0) {
    score = Math.round((metCount / totalCriteria) * 100);
  }

  let status: EligibilityReport['status'] = 'Not Eligible';

  if (unmetCount > 0) {
    status = 'Not Eligible';
    nextSteps.push('Review eligibility criteria; explore alternate awards that match your current profile.');
  } else if (missingCount > 0) {
    if (metCount > 0) {
      status = 'Potentially Eligible';
      nextSteps.push('Complete missing profile details to definitively verify eligibility.');
    } else {
      status = 'Insufficient Information';
      nextSteps.push('Update your student profile (GPA, major, income) to calculate accurate eligibility.');
    }
  } else {
    status = 'Eligible';
    nextSteps.push('You satisfy preliminary qualifications! Prepare required documentation and apply before the deadline.');
  }

  return {
    status,
    score,
    matchingRequirements,
    unmetRequirements,
    missingInformation,
    nextSteps,
    detailedCriteria: criteria
  };
}

/**
 * Calculates student Opportunity DNA profile
 */
export function calculateOpportunityDNA(profile: StudentProfile) {
  let completenessPoints = 0;
  const totalFields = 10;
  const missingFields: string[] = [];

  if (profile.fullName) completenessPoints++; else missingFields.push('Full Name');
  if (profile.email) completenessPoints++; else missingFields.push('Email');
  if (profile.educationLevel) completenessPoints++; else missingFields.push('Education Level');
  if (profile.fieldOfStudy) completenessPoints++; else missingFields.push('Field of Study');
  if (profile.institution) completenessPoints++; else missingFields.push('Institution');
  if (profile.gpa && profile.gpa > 0) completenessPoints++; else missingFields.push('Cumulative GPA');
  if (profile.annualFamilyIncome > 0) completenessPoints++; else missingFields.push('Household Income');
  if (profile.citizenship) completenessPoints++; else missingFields.push('Citizenship');
  if (profile.bioStatement) completenessPoints++; else missingFields.push('Bio / Goals Statement');
  if (profile.intendedSpecialization) completenessPoints++; else missingFields.push('Specialization');

  const profileCompleteness = Math.round((completenessPoints / totalFields) * 100);

  const dnaBadges: { title: string; type: 'academic' | 'need' | 'diversity' | 'stem'; description: string }[] = [];

  if (profile.gpa >= 3.5) {
    dnaBadges.push({
      title: 'High Honors Scholar',
      type: 'academic',
      description: `GPA ${profile.gpa.toFixed(2)} qualifies for premier competitive merit awards.`
    });
  }

  if (profile.annualFamilyIncome > 0 && profile.annualFamilyIncome <= 55000) {
    dnaBadges.push({
      title: 'High Need Endowment Match',
      type: 'need',
      description: 'Household income qualifies for major need-based equity grants.'
    });
  }

  if (profile.firstGenerationStudent) {
    dnaBadges.push({
      title: 'First-Generation Trailblazer',
      type: 'diversity',
      description: 'Eligible for exclusive first-in-family collegiate fellowships.'
    });
  }

  if (profile.minorityStatus) {
    dnaBadges.push({
      title: 'Underrepresented Scholar',
      type: 'diversity',
      description: 'Eligible for targeted diversity and leadership programs.'
    });
  }

  const stemFields = ['computer science', 'engineering', 'data', 'math', 'physics', 'bio', 'tech', 'science'];
  if (profile.fieldOfStudy && stemFields.some(s => profile.fieldOfStudy.toLowerCase().includes(s))) {
    dnaBadges.push({
      title: 'STEM Innovation Profile',
      type: 'stem',
      description: 'High alignment with corporate tech and research fellowships.'
    });
  }

  return {
    profileCompleteness,
    missingFields,
    dnaBadges
  };
}

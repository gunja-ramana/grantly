import { Scholarship } from '../types';

export const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'sch-001',
    title: 'Future Tech & AI Leadership Scholarship',
    provider: 'Global Technology Institute (Sample)',
    providerType: 'Corporate',
    awardAmount: 15000,
    currency: 'USD',
    awardFrequency: 'Annual',
    category: 'STEM',
    educationLevels: ['Undergraduate', 'Postgraduate'],
    eligibleFields: ['Computer Science', 'Data Science', 'Artificial Intelligence', 'Software Engineering', 'Electrical Engineering'],
    minGpa: 3.4,
    locationRequirements: ['United States', 'Canada', 'United Kingdom', 'India', 'Global'],
    eligibleCitizenships: ['All Citizenships'],
    requiredDocuments: [
      'Official Academic Transcript',
      'Statement of Purpose (AI Ethics & Vision)',
      'Letter of Recommendation',
      'Resume / CV'
    ],
    applicationDeadline: '2026-11-20',
    officialUrl: 'https://example.org/sample-scholarships/future-tech-ai',
    summary: 'Sample merit fellowship model recognizing students pursuing computing and artificial intelligence solutions with societal benefit.',
    description: 'Demonstration opportunity: Designed to illustrate STEM merit matching for students conducting technical research in algorithms and applied computing.',
    benefits: [
      '$15,000 direct tuition & research stipend',
      'Executive 1-on-1 mentorship with industry AI engineers',
      'Access to virtual symposium sessions'
    ],
    applicationProcess: [
      'Submit academic transcripts demonstrating 3.4+ cumulative GPA',
      'Upload 750-word Statement of Purpose on ethical computing',
      'Provide academic recommendation from faculty member',
      'Virtual panel discussion round'
    ],
    importantConditions: [
      'Simulated sample criteria: must maintain 3.3 GPA during award term',
      'Disbursements modeled directly to university registrar'
    ],
    sourceAttribution: 'Sample demonstration record modeled from higher education grant benchmarks',
    isFeatured: true,
    isSampleData: true,
    totalSeats: 25
  },
  {
    id: 'sch-002',
    title: 'Lumina First-Generation Collegiate Grant',
    provider: 'Lumina Educational Foundation (Sample)',
    providerType: 'Foundation',
    awardAmount: 10000,
    currency: 'USD',
    awardFrequency: 'Annual',
    category: 'Need-Based',
    educationLevels: ['Undergraduate'],
    eligibleFields: ['All Fields'],
    minGpa: 2.8,
    maxIncome: 65000,
    locationRequirements: ['United States', 'Canada', 'India', 'United Kingdom'],
    eligibleCitizenships: ['All Citizenships'],
    requiredDocuments: [
      'FAFSA or Official Household Income Proof',
      'Official Academic Transcript',
      'Personal Essay on First-Gen Experience',
      'Verification of First-Generation Status'
    ],
    applicationDeadline: '2026-12-05',
    officialUrl: 'https://example.org/sample-scholarships/lumina-first-gen',
    summary: 'Sample need-based grant model supporting first-generation college students overcoming socioeconomic hurdles.',
    description: 'Demonstration opportunity: Illustrates need-based equity matching where household income caps and parental education level are primary eligibility benchmarks.',
    benefits: [
      '$10,000 educational grant funding',
      'Digital technology equipment stipend ($1,200 value)',
      'Peer mentorship orientation network'
    ],
    applicationProcess: [
      'Verify first-generation student status',
      'Submit household income verification document',
      'Submit 500-word essay about your educational resilience',
      'Selection committee review'
    ],
    importantConditions: [
      'Household income strictly capped at $65,000 threshold',
      'Neither parent has earned a four-year bachelor degree'
    ],
    sourceAttribution: 'Sample demonstration record modeled from higher education grant benchmarks',
    isFeatured: true,
    isSampleData: true,
    totalSeats: 50
  },
  {
    id: 'sch-003',
    title: 'Vanguard Women in STEM Excellence Fellowship',
    provider: 'Vanguard Innovation Council (Sample)',
    providerType: 'Corporate',
    awardAmount: 18000,
    currency: 'USD',
    awardFrequency: 'Annual',
    category: 'Diversity',
    educationLevels: ['Undergraduate', 'Postgraduate'],
    eligibleFields: ['Computer Science', 'Mechanical Engineering', 'Bioengineering', 'Mathematics', 'Physics', 'Information Technology'],
    minGpa: 3.5,
    locationRequirements: ['Global'],
    eligibleCitizenships: ['All Citizenships'],
    requiredDocuments: [
      'Official Academic Transcript',
      'Letter of Recommendation',
      'Technical Project Portfolio or GitHub Repo',
      'Personal Statement (Women in Engineering)'
    ],
    applicationDeadline: '2026-11-15',
    officialUrl: 'https://example.org/sample-scholarships/vanguard-women-stem',
    summary: 'Sample diversity and excellence fellowship honoring women pursuing research and software engineering solutions.',
    description: 'Demonstration opportunity: Designed to show multi-attribute matching where female gender identity, high GPA, and STEM enrollment converge.',
    benefits: [
      '$18,000 annual scholarship funding',
      'Fast-track technical internship interview',
      'Executive networking sessions'
    ],
    applicationProcess: [
      'Submit academic transcripts showing high performance in STEM core courses',
      'Provide portfolio link or project repository',
      'Faculty recommendation endorsement',
      'Panel interview round'
    ],
    importantConditions: [
      'Enrolled full-time in accredited STEM bachelor or master degree program',
      'Complete a peer outreach or mentoring workshop during the year'
    ],
    sourceAttribution: 'Sample demonstration record modeled from higher education grant benchmarks',
    isFeatured: true,
    isSampleData: true,
    totalSeats: 15
  },
  {
    id: 'sch-004',
    title: 'Apex Biomedical & Healthcare Research Grant',
    provider: 'Apex Medical Research Foundation (Sample)',
    providerType: 'Non-Profit',
    awardAmount: 22000,
    currency: 'USD',
    awardFrequency: 'Annual',
    category: 'Research',
    educationLevels: ['Undergraduate', 'Postgraduate', 'Doctorate'],
    eligibleFields: ['Biomedical Sciences', 'Medicine', 'Bioinformatics', 'Pharmacology', 'Biochemistry'],
    minGpa: 3.6,
    locationRequirements: ['Global'],
    eligibleCitizenships: ['All Citizenships'],
    requiredDocuments: [
      'Curriculum Vitae / Resume',
      'Research Proposal (max 1500 words)',
      'Primary Investigator (PI) Endorsement Letter',
      'Official Academic Transcript'
    ],
    applicationDeadline: '2026-12-20',
    officialUrl: 'https://example.org/sample-scholarships/apex-biomedical',
    summary: 'Sample clinical research grant supporting student scientists investigating novel healthcare therapies.',
    description: 'Demonstration opportunity: Models specialized research grant evaluations with faculty mentor endorsements and hypothesis proposals.',
    benefits: [
      '$22,000 research and tuition fellowship',
      'Scientific conference travel stipend up to $2,500',
      'Publication assistance support'
    ],
    applicationProcess: [
      'Complete research grant application profile',
      'Upload structured research proposal with methodology and timeline',
      'Submit PI lab mentor letter',
      'Peer review evaluation'
    ],
    importantConditions: [
      'Must produce a progress report within 12 months',
      'Requires institutional ethics approval if human subject data involved'
    ],
    sourceAttribution: 'Sample demonstration record modeled from higher education grant benchmarks',
    isFeatured: false,
    isSampleData: true,
    totalSeats: 10
  },
  {
    id: 'sch-005',
    title: 'Civic Leadership & Public Policy Scholar Award',
    provider: 'Civic Futures Institute (Sample)',
    providerType: 'Foundation',
    awardAmount: 12000,
    currency: 'USD',
    awardFrequency: 'Annual',
    category: 'Merit',
    educationLevels: ['Undergraduate', 'Postgraduate'],
    eligibleFields: ['Public Policy', 'Political Science', 'Economics', 'Law', 'International Relations', 'Sociology'],
    minGpa: 3.2,
    locationRequirements: ['United States', 'European Union', 'United Kingdom', 'India', 'Australia'],
    eligibleCitizenships: ['All Citizenships'],
    requiredDocuments: [
      'Official Academic Transcript',
      'Policy Memo Essay on Sustainable Governance (1000 words)',
      'Proof of Community Service or Civic Engagement',
      'Letter of Recommendation'
    ],
    applicationDeadline: '2027-01-15',
    officialUrl: 'https://example.org/sample-scholarships/civic-leadership',
    summary: 'Sample merit fellowship recognizing emerging student leaders committed to public governance and policy reform.',
    description: 'Demonstration opportunity: Models social sciences merit awards evaluating service hours and policy innovation.',
    benefits: [
      '$12,000 educational grant funding',
      'Policy summit entry invitation',
      'Published policy memo in student review'
    ],
    applicationProcess: [
      'Submit transcripts and documentation of verified volunteer service',
      'Author an actionable policy recommendation brief',
      'Academic reference letter',
      'Panel interview on community initiatives'
    ],
    importantConditions: [
      'Active participation in student community organization or advocacy group'
    ],
    sourceAttribution: 'Sample demonstration record modeled from higher education grant benchmarks',
    isFeatured: false,
    isSampleData: true,
    totalSeats: 20
  },
  {
    id: 'sch-006',
    title: 'Green Horizons Environmental Ecology Prize',
    provider: 'Earth Ecology Trust (Sample)',
    providerType: 'Non-Profit',
    awardAmount: 8500,
    currency: 'USD',
    awardFrequency: 'One-time',
    category: 'STEM',
    educationLevels: ['Undergraduate', 'Postgraduate'],
    eligibleFields: ['Environmental Science', 'Ecology', 'Renewable Energy', 'Civil Engineering', 'Agronomy'],
    minGpa: 3.0,
    locationRequirements: ['Global'],
    eligibleCitizenships: ['All Citizenships'],
    requiredDocuments: [
      'Official Academic Transcript',
      'Sustainability Project Synopsis (750 words)',
      'Letter of Recommendation'
    ],
    applicationDeadline: '2026-11-28',
    officialUrl: 'https://example.org/sample-scholarships/green-horizons',
    summary: 'Sample environmental grant supporting students conducting ecological field research or clean technology projects.',
    description: 'Demonstration opportunity: In this demo dataset, this award has already been evaluated, officially approved, and disbursed to the student.',
    benefits: [
      '$8,500 direct educational grant (Disbursed in demo)',
      'Field expedition gear allowance ($1,000 value)',
      'Ecology summit attendee pass'
    ],
    applicationProcess: [
      'Complete basic profile and eligibility verification',
      'Upload project synopsis with measurable impact indicators',
      'Submit faculty reference'
    ],
    importantConditions: [
      'Awardee submits an annual progress report detailing project outcomes'
    ],
    sourceAttribution: 'Sample demonstration record modeled from higher education grant benchmarks',
    isFeatured: false,
    isSampleData: true,
    totalSeats: 30
  },
  {
    id: 'sch-007',
    title: 'National Fine Arts & Creative Media Bursary',
    provider: 'National Arts & Cultural Council (Sample)',
    providerType: 'Government',
    awardAmount: 9500,
    currency: 'USD',
    awardFrequency: 'Annual',
    category: 'Arts & Humanities',
    educationLevels: ['Undergraduate', 'Postgraduate'],
    eligibleFields: ['Visual Arts', 'Digital Media', 'Graphic Design', 'Architecture', 'Creative Writing', 'Film & Cinema'],
    minGpa: 2.7,
    locationRequirements: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Global'],
    eligibleCitizenships: ['All Citizenships'],
    requiredDocuments: [
      'Creative Digital Portfolio (10 pieces)',
      'Artist Statement (500 words)',
      'Curriculum Vitae',
      'Official Academic Transcript'
    ],
    applicationDeadline: '2026-12-10',
    officialUrl: 'https://example.org/sample-scholarships/fine-arts-bursary',
    summary: 'Sample arts bursary funding visionary creators, digital media producers, and humanities scholars.',
    description: 'Demonstration opportunity: Models studio supplies and tuition bursaries evaluated via creative portfolios.',
    benefits: [
      '$9,500 scholarship funding',
      'Annual student exhibition feature',
      'Creative software suite subscription coverage'
    ],
    applicationProcess: [
      'Upload portfolio link with creative works',
      'Submit artist philosophy and statement of intent',
      'Provide academic transcript',
      'Portfolio jury review'
    ],
    importantConditions: [
      'Feature funded creative work in student council showcase'
    ],
    sourceAttribution: 'Sample demonstration record modeled from higher education grant benchmarks',
    isFeatured: false,
    isSampleData: true,
    totalSeats: 18
  },
  {
    id: 'sch-008',
    title: 'International Global Scholar Tuition Fellowship',
    provider: 'Rotary International Partner Universities (Sample)',
    providerType: 'Foundation',
    awardAmount: 25000,
    currency: 'USD',
    awardFrequency: 'Annual',
    category: 'International',
    educationLevels: ['Undergraduate', 'Postgraduate'],
    eligibleFields: ['All Fields'],
    minGpa: 3.3,
    locationRequirements: ['Global'],
    eligibleCitizenships: ['Non-resident International Students'],
    requiredDocuments: [
      'Proof of International Student Status or Visa Eligibility',
      'Official English Proficiency or Exemption',
      'Official Academic Transcript',
      'Letter of Recommendation',
      'Personal Statement (Cultural Exchange)'
    ],
    applicationDeadline: '2026-12-15',
    officialUrl: 'https://example.org/sample-scholarships/rotary-global-scholar',
    summary: 'Sample international scholarship addressing tuition differentials for international students studying abroad.',
    description: 'Demonstration opportunity: Models substantial international tuition fellowships fostering cultural diplomacy.',
    benefits: [
      '$25,000 comprehensive tuition contribution',
      'Local advisory and host family immersion support',
      'International alumni connection'
    ],
    applicationProcess: [
      'Verify target university enrollment or conditional offer',
      'Submit transcripts and language proficiency test scores',
      'Write 800-word essay on cross-cultural ambassadorial vision',
      'Virtual interview round'
    ],
    importantConditions: [
      'Enrolled as an international student with valid study permit',
      'Participate in cultural exchange presentations'
    ],
    sourceAttribution: 'Sample demonstration record modeled from higher education grant benchmarks',
    isFeatured: true,
    isSampleData: true,
    totalSeats: 40
  },
  {
    id: 'sch-009',
    title: 'Elite Student Athlete Leadership Grant',
    provider: 'Collegiate Sports Foundation (Sample)',
    providerType: 'Non-Profit',
    awardAmount: 7500,
    currency: 'USD',
    awardFrequency: 'Annual',
    category: 'Athletic',
    educationLevels: ['Undergraduate'],
    eligibleFields: ['All Fields'],
    minGpa: 2.9,
    locationRequirements: ['United States', 'Canada', 'United Kingdom', 'Global'],
    eligibleCitizenships: ['All Citizenships'],
    requiredDocuments: [
      'Coach Recommendation & Athletic Record',
      'Official Academic Transcript',
      'Leadership & Sportsmanship Essay (500 words)'
    ],
    applicationDeadline: '2027-01-30',
    officialUrl: 'https://example.org/sample-scholarships/athletic-leadership',
    summary: 'Sample athletic scholarship for varsity student-athletes balancing sports with academic excellence.',
    description: 'Demonstration opportunity: Models dual-performance criteria combining athletic coach letters and GPA cutoffs.',
    benefits: [
      '$7,500 scholarship funding',
      'Athletic physical therapy and equipment support'
    ],
    applicationProcess: [
      'Submit athletic portfolio and coach recommendation',
      'Provide academic transcripts satisfying minimum GPA requirement',
      'Submit essay on leadership on and off the field'
    ],
    importantConditions: [
      'Remain in active good standing with university athletics team or club'
    ],
    sourceAttribution: 'Sample demonstration record modeled from higher education grant benchmarks',
    isFeatured: false,
    isSampleData: true,
    totalSeats: 20
  },
  {
    id: 'sch-010',
    title: 'Horizon Equity in Education Need-Based Stipend',
    provider: 'Horizon Community Development Fund (Sample)',
    providerType: 'Non-Profit',
    awardAmount: 6000,
    currency: 'USD',
    awardFrequency: 'Annual',
    category: 'Need-Based',
    educationLevels: ['High School', 'Undergraduate'],
    eligibleFields: ['All Fields'],
    minGpa: 2.5,
    maxIncome: 50000,
    locationRequirements: ['Global'],
    eligibleCitizenships: ['All Citizenships'],
    requiredDocuments: [
      'FAFSA or Official Household Income Proof',
      'Official Academic Transcript',
      'Brief Hardship Statement (300 words)'
    ],
    applicationDeadline: '2026-11-25',
    officialUrl: 'https://example.org/sample-scholarships/horizon-equity',
    summary: 'Sample community relief stipend for low-income undergraduate students experiencing financial hardship.',
    description: 'Demonstration opportunity: Models rapid hardship assistance with household income ceilings under $50,000.',
    benefits: [
      '$6,000 grant disbursed in 2 semester installments',
      'Textbook voucher and course materials assistance'
    ],
    applicationProcess: [
      'Fill out household economic situation verification form',
      'Submit tax return or local income certificate',
      'Brief explanation of educational goals'
    ],
    importantConditions: [
      'Family gross income strictly capped at $50,000 threshold'
    ],
    sourceAttribution: 'Sample demonstration record modeled from higher education grant benchmarks',
    isFeatured: false,
    isSampleData: true,
    totalSeats: 60
  }
];

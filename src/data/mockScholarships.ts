import { Scholarship } from '../types';

export const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'sch-001',
    title: 'Future Tech & AI Leadership Scholarship',
    provider: 'Global Technology Institute',
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
    applicationDeadline: '2026-11-20', // Approaching deadline
    officialUrl: 'https://example.org/scholarships/future-tech-ai',
    summary: 'Merit and innovation fellowship empowering undergraduate and graduate students pursuing frontier computing and AI with high societal impact.',
    description: 'The Future Tech & AI Leadership Scholarship recognizes outstanding students developing transformative technological solutions. Recipients receive tuition support, an industry mentorship match, and an invitation to the annual Global AI Symposium.',
    benefits: [
      '$15,000 direct tuition & research stipend',
      'Executive 1-on-1 mentorship with industry AI engineers',
      'All-expenses-paid trip to the Global AI Symposium'
    ],
    applicationProcess: [
      'Submit academic transcripts and cumulative GPA proof',
      'Upload a 750-word Statement of Purpose on ethical technology',
      'Provide two academic or research references',
      'Finalist virtual interview with selection board'
    ],
    importantConditions: [
      'Must maintain at least a 3.3 GPA throughout funding year',
      'Scholarship disbursements sent directly to accredited registrar'
    ],
    sourceAttribution: 'Global Tech Institute Academic Grants Board 2026-2027 Gazette',
    isFeatured: true,
    totalSeats: 25
  },
  {
    id: 'sch-002',
    title: 'Lumina First-Generation Collegiate Grant',
    provider: 'Lumina Educational Foundation',
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
      'High School or College Transcript',
      'Personal Essay on First-Gen Experience',
      'Verification of First-Generation Status'
    ],
    applicationDeadline: '2026-12-05',
    officialUrl: 'https://example.org/scholarships/lumina-first-gen',
    summary: 'Need-based endowment for first-generation university students overcoming socioeconomic barriers to pursue higher education.',
    description: 'Designed specifically to bridge financial inequities, the Lumina Grant covers critical expenses including housing, textbooks, technology access, and student fees for students who are the first in their immediate family to attend university.',
    benefits: [
      '$10,000 unrestricted educational grant',
      'Free laptop or digital workstation voucher ($1,200 value)',
      'Peer mentorship and career orientation network'
    ],
    applicationProcess: [
      'Verify first-generation student status',
      'Submit parent/guardian tax assessment or income certificate',
      'Submit a 500-word essay about your educational resilience',
      'Committee review and award notification within 4 weeks'
    ],
    importantConditions: [
      'Family household gross income must not exceed $65,000 annually',
      'Neither parent has earned a bachelor degree'
    ],
    sourceAttribution: 'Lumina Education Trust Foundation 2026 Program Directory',
    isFeatured: true,
    totalSeats: 50
  },
  {
    id: 'sch-003',
    title: 'Vanguard Women in STEM Excellence Fellowship',
    provider: 'Vanguard Innovation Council',
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
      'Official Transcript',
      'Two Letters of Recommendation (STEM Faculty)',
      'Technical Project Portfolio or GitHub Repo',
      'Personal Statement on Women in Engineering'
    ],
    applicationDeadline: '2026-11-15', // very urgent!
    officialUrl: 'https://example.org/scholarships/vanguard-women-stem',
    summary: 'Prestigious merit fellowship honoring women pioneering research, software, and engineering solutions.',
    description: 'The Vanguard Fellowship supports female researchers and engineers with exceptional academic promise, fostering inclusive technical leadership in cutting-edge industries.',
    benefits: [
      '$18,000 annual scholarship award',
      'Fast-track technical internship interview',
      'Membership in the Global Women in Tech Executive Circle'
    ],
    applicationProcess: [
      'Submit academic transcripts demonstrating high performance in core STEM courses',
      'Provide portfolio link or lab research summary',
      'Faculty recommendation endorsement',
      'Technical presentation round for top 40 candidates'
    ],
    importantConditions: [
      'Enrolled full-time in accredited STEM bachelor or master degree',
      'Must complete a community outreach workshop during award year'
    ],
    sourceAttribution: 'Vanguard Diversity & Inclusion Academic Fund',
    isFeatured: true,
    totalSeats: 15
  },
  {
    id: 'sch-004',
    title: 'Apex Biomedical & Healthcare Research Grant',
    provider: 'Apex Medical Research Foundation',
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
      'Official Transcript'
    ],
    applicationDeadline: '2026-12-20',
    officialUrl: 'https://example.org/scholarships/apex-biomedical',
    summary: 'Substantial research endowment for aspiring biomedical scientists and healthcare investigators developing novel therapies.',
    description: 'Supports student-led clinical, translational, and computational biology projects. Funds can be allocated toward tuition, lab consumables, sequence analysis, or conference dissemination.',
    benefits: [
      '$22,000 comprehensive research and education fellowship',
      'Conference travel stipend up to $2,500',
      'Priority consideration for post-doctoral clinical fellowships'
    ],
    applicationProcess: [
      'Complete online research grant application form',
      'Upload structured research proposal with hypothesis and timeline',
      'Submit lab PI letter validating lab space and mentorship',
      'Scientific review panel evaluation'
    ],
    importantConditions: [
      'Must publish or present research findings within 18 months of award',
      'Requires institutional ethics approval if human subjects or clinical data involved'
    ],
    sourceAttribution: 'Apex Health Endowment Annual Scientific Fellowship',
    isFeatured: false,
    totalSeats: 10
  },
  {
    id: 'sch-005',
    title: 'Civic Leadership & Public Policy Scholar Award',
    provider: 'Civic Futures Institute',
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
      'Transcript of Records',
      'Policy Memo Essay on Sustainable Governance (1000 words)',
      'Proof of Community Service or Civic Engagement',
      'Reference Letter from Community or Academic Mentor'
    ],
    applicationDeadline: '2027-01-15',
    officialUrl: 'https://example.org/scholarships/civic-leadership',
    summary: 'Award recognizing emerging changemakers committed to ethical public governance, civic technology, and policy reform.',
    description: 'Empowers proactive civic leaders who demonstrate significant volunteerism and visionary policy innovation tackling climate resilience, education equity, and democratic transparency.',
    benefits: [
      '$12,000 tuition grant',
      'Washington DC / Geneva Policy Immersion Summit entry',
      'Published policy memo in Civic Futures Review'
    ],
    applicationProcess: [
      'Submit transcripts and documentation of 100+ hours of verified civic service',
      'Author an actionable policy recommendation memo',
      'Provide professional or academic reference',
      'Panel interview on civic initiatives'
    ],
    importantConditions: [
      'Must maintain active participation in university student government or community advocacy group'
    ],
    sourceAttribution: 'Civic Futures Institute Policy Directorate',
    isFeatured: false,
    totalSeats: 20
  },
  {
    id: 'sch-006',
    title: 'Green Horizons Environmental Ecology Prize',
    provider: 'Earth Ecology Trust',
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
      'Academic Record',
      'Sustainability Project Synopsis (750 words)',
      'One Academic Recommendation Letter'
    ],
    applicationDeadline: '2026-11-28',
    officialUrl: 'https://example.org/scholarships/green-horizons',
    summary: 'Grant supporting passionate ecological advocates conducting field research or sustainable development initiatives.',
    description: 'Aimed at grassroots ecological innovators working on carbon sequestration, watershed protection, renewable grid integration, or urban biodiversity.',
    benefits: [
      '$8,500 direct grant',
      'Field expedition gear grant ($1,000 value)',
      'Ecology summit badge'
    ],
    applicationProcess: [
      'Complete basic profile and eligibility verification',
      'Upload project synopsis with measurable ecological impact indicators',
      'Submit faculty reference'
    ],
    importantConditions: [
      'Awardee must submit a 6-month progress report detailing project outcomes'
    ],
    sourceAttribution: 'Earth Ecology Foundation Grants Registry 2026',
    isFeatured: false,
    totalSeats: 30
  },
  {
    id: 'sch-007',
    title: 'National Fine Arts & Creative Media Bursary',
    provider: 'National Arts & Cultural Council',
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
      'Official Transcript'
    ],
    applicationDeadline: '2026-12-10',
    officialUrl: 'https://example.org/scholarships/fine-arts-bursary',
    summary: 'Dedicated funding for visionary visual storytellers, digital creators, and humanities scholars.',
    description: 'Provides critical studio supplies, software licenses, tuition offsets, and exhibition opportunities for undergraduate and master-level creative students.',
    benefits: [
      '$9,500 scholarship funding',
      'Annual Juried Gallery Exhibition feature',
      'Creative software suite subscription covered for 2 years'
    ],
    applicationProcess: [
      'Upload portfolio link with high-resolution creative works',
      'Submit artist philosophy and statement of intent',
      'Provide academic transcript',
      'Portfolio jury review'
    ],
    importantConditions: [
      'Must agree to feature at least one funded piece in the council annual publication'
    ],
    sourceAttribution: 'National Arts Council Federal Education Gazette',
    isFeatured: false,
    totalSeats: 18
  },
  {
    id: 'sch-008',
    title: 'International Global Scholar Tuition Fellowship',
    provider: 'Rotary International & Partner Universities',
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
      'Official English Proficiency (IELTS/TOEFL/Duolingo) or Exemption',
      'Undergraduate or High School Transcripts',
      'Two Letters of Recommendation',
      'Personal Essay on Cultural Exchange'
    ],
    applicationDeadline: '2026-12-15',
    officialUrl: 'https://example.org/scholarships/rotary-global-scholar',
    summary: 'Substantial tuition fellowship for international students studying abroad to build cross-cultural diplomacy.',
    description: 'Mitigates the steep tuition differential faced by international students studying outside their home countries, promoting cross-border collaboration and international goodwill.',
    benefits: [
      '$25,000 comprehensive tuition contribution',
      'Host family cultural immersion and local advisory support',
      'International alumni network connection across 120 countries'
    ],
    applicationProcess: [
      'Verify target university enrollment or conditional admission offer',
      'Submit transcripts and language proficiency test scores',
      'Write 800-word essay on cross-cultural ambassadorial vision',
      'Virtual interview with regional selection committee'
    ],
    importantConditions: [
      'Must be enrolled as a foreign international student with valid study permit',
      'Participation in 2 cultural exchange presentations per academic semester'
    ],
    sourceAttribution: 'Rotary International Global Higher Education Initiative',
    isFeatured: true,
    totalSeats: 40
  },
  {
    id: 'sch-009',
    title: 'Elite Student Athlete Leadership Grant',
    provider: 'Collegiate Sports Foundation',
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
    officialUrl: 'https://example.org/scholarships/athletic-leadership',
    summary: 'Financial support for varsity and club student-athletes who balance competitive sports with rigorous academic pursuits.',
    description: 'Celebrates dual excellence in athletics and classroom discipline, covering sports travel, equipment, nutrition, and academic tuition.',
    benefits: [
      '$7,500 scholarship funding',
      'Sports nutrition and athletic physical therapy grant'
    ],
    applicationProcess: [
      'Submit athletic portfolio and coach endorsement letter',
      'Provide academic transcripts satisfying minimum GPA requirements',
      'Submit essay on leadership on and off the field'
    ],
    importantConditions: [
      'Must remain in active good standing with university athletics team or club'
    ],
    sourceAttribution: 'Collegiate Athletic Foundation Academic Bureau',
    isFeatured: false,
    totalSeats: 20
  },
  {
    id: 'sch-010',
    title: 'Horizon Equity in Education Need-Based Stipend',
    provider: 'Horizon Community Development Fund',
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
      'Household Income Certificate / Tax Filing',
      'Official Transcript or Report Card',
      'Brief Hardship Statement (300 words)'
    ],
    applicationDeadline: '2026-11-25',
    officialUrl: 'https://example.org/scholarships/horizon-equity',
    summary: 'Direct hardship stipend for vulnerable students facing unexpected financial strains or living below median income.',
    description: 'Provides rapid financial relief directly to low-income students for essential living, transportation, and health expenses during their studies.',
    benefits: [
      '$6,000 grant disbursed in 2 semester installments',
      'Emergency textbook and meal voucher support'
    ],
    applicationProcess: [
      'Fill out household economic situation verification form',
      'Submit tax return or local government income certificate',
      'Brief explanation of educational goals'
    ],
    importantConditions: [
      'Family income strictly capped at $50,000'
    ],
    sourceAttribution: 'Horizon Urban Development Community Trust',
    isFeatured: false,
    totalSeats: 60
  }
];

import React, { useState } from 'react';
import {
  Sparkles,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudentProfile, EducationLevel } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { AlertBanner } from '../components/common/AlertBanner';

export const ProfilePage: React.FC = () => {
  const { state, updateProfile, opportunityDNA } = useApp();

  const [formData, setFormData] = useState<StudentProfile>(state.profile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field: keyof StudentProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setSaveSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Student Profile & Opportunity DNA
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Powering deterministic eligibility calculations and high-alignment radar recommendations.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <AlertBanner type="success" title="Profile Successfully Updated">
          <span>Your Opportunity DNA and eligibility scores across all scholarships have been recalculated immediately.</span>
        </AlertBanner>
      )}

      {/* INNOVATION 1: OPPORTUNITY DNA SUMMARY CARD */}
      <div className="card" style={{ padding: '1.75rem', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <Sparkles size={22} color="var(--primary)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
            Opportunity DNA Profile
          </h2>
          <Badge variant="accent">Signature Innovation 1</Badge>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Multi-dimensional matching model evaluating academic excellence, socioeconomic need, diversity attributes, and discipline fit.
        </p>

        {/* Profile Completeness Bar */}
        <div style={{ marginBottom: '1.5rem' }}>
          <ProgressBar
            value={opportunityDNA.profileCompleteness}
            label="Profile Completion Score"
            ariaLabel="Student Profile Completion Score"
            sublabel={
              opportunityDNA.missingFields.length > 0
                ? `Missing fields: ${opportunityDNA.missingFields.join(', ')}`
                : 'Your profile has 100% complete benchmark data for highest-precision matching.'
            }
            variant="primary"
            height={10}
          />
        </div>

        {/* Opportunity DNA Badges */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Unlocked Opportunity DNA Badges
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {opportunityDNA.dnaBadges.map((badge, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem'
                }}
              >
                <CheckCircle2 size={18} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
                    {badge.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {badge.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editable Profile Form */}
      <form onSubmit={handleSave} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Section 1: Basic Identity */}
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
            1. Personal & Contact Information
          </h3>
          <div className="grid-3">
            <div className="input-group">
              <label htmlFor="profile-fullName" className="input-label">Full Name *</label>
              <input
                id="profile-fullName"
                type="text"
                className="input-control"
                required
                value={formData.fullName}
                onChange={e => handleChange('fullName', e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="profile-email" className="input-label">Email Address *</label>
              <input
                id="profile-email"
                type="email"
                className="input-control"
                required
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="profile-phone" className="input-label">Phone Number</label>
              <input
                id="profile-phone"
                type="text"
                className="input-control"
                value={formData.phone}
                onChange={e => handleChange('phone', e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="profile-citizenship" className="input-label">Citizenship</label>
              <input
                id="profile-citizenship"
                type="text"
                className="input-control"
                value={formData.citizenship}
                onChange={e => handleChange('citizenship', e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="profile-residenceCountry" className="input-label">Country of Residence</label>
              <input
                id="profile-residenceCountry"
                type="text"
                className="input-control"
                value={formData.residenceCountry}
                onChange={e => handleChange('residenceCountry', e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="profile-stateProvince" className="input-label">State / Province</label>
              <input
                id="profile-stateProvince"
                type="text"
                className="input-control"
                value={formData.stateProvince}
                onChange={e => handleChange('stateProvince', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Academic Standing */}
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
            2. Academic Background & Performance
          </h3>
          <div className="grid-3">
            <div className="input-group">
              <label htmlFor="profile-educationLevel" className="input-label">Education Level *</label>
              <select
                id="profile-educationLevel"
                className="input-control"
                value={formData.educationLevel}
                onChange={e => handleChange('educationLevel', e.target.value as EducationLevel)}
              >
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate Degree</option>
                <option value="Postgraduate">Master / Postgraduate</option>
                <option value="Doctorate">Doctoral / PhD</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="profile-fieldOfStudy" className="input-label">Field of Study / Major *</label>
              <input
                id="profile-fieldOfStudy"
                type="text"
                className="input-control"
                required
                value={formData.fieldOfStudy}
                onChange={e => handleChange('fieldOfStudy', e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="profile-institution" className="input-label">University / Institution *</label>
              <input
                id="profile-institution"
                type="text"
                className="input-control"
                required
                value={formData.institution}
                onChange={e => handleChange('institution', e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="profile-gpa" className="input-label">Cumulative GPA (e.g. 3.75) *</label>
              <input
                id="profile-gpa"
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                className="input-control"
                required
                value={formData.gpa}
                onChange={e => handleChange('gpa', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="profile-maxGpa" className="input-label">GPA Scale (Max)</label>
              <input
                id="profile-maxGpa"
                type="number"
                step="0.1"
                className="input-control"
                value={formData.maxGpa}
                onChange={e => handleChange('maxGpa', parseFloat(e.target.value) || 4.0)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="profile-graduationYear" className="input-label">Anticipated Graduation Year</label>
              <input
                id="profile-graduationYear"
                type="number"
                className="input-control"
                value={formData.graduationYear}
                onChange={e => handleChange('graduationYear', parseInt(e.target.value) || 2027)}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Financial & Demographics */}
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
            3. Financial & Demographic Matching Factors
          </h3>
          <div className="grid-2" style={{ marginBottom: '1rem' }}>
            <div className="input-group">
              <label htmlFor="profile-annualFamilyIncome" className="input-label">Annual Family Gross Income ($ USD) *</label>
              <input
                id="profile-annualFamilyIncome"
                type="number"
                className="input-control"
                value={formData.annualFamilyIncome}
                onChange={e => handleChange('annualFamilyIncome', parseInt(e.target.value) || 0)}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                Used deterministically to evaluate need-based grant ceilings.
              </span>
            </div>

            <div className="input-group">
              <label htmlFor="profile-householdSize" className="input-label">Household Size (Dependents)</label>
              <input
                id="profile-householdSize"
                type="number"
                min="1"
                className="input-control"
                value={formData.householdSize}
                onChange={e => handleChange('householdSize', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
            <label
              htmlFor="profile-firstGeneration"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.75rem',
                backgroundColor: 'var(--surface-subtle)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              <input
                id="profile-firstGeneration"
                type="checkbox"
                checked={formData.firstGenerationStudent}
                onChange={e => handleChange('firstGenerationStudent', e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>First-Generation Student</span>
            </label>

            <label
              htmlFor="profile-minority"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.75rem',
                backgroundColor: 'var(--surface-subtle)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              <input
                id="profile-minority"
                type="checkbox"
                checked={formData.minorityStatus}
                onChange={e => handleChange('minorityStatus', e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Underrepresented Minority</span>
            </label>

            <label
              htmlFor="profile-disability"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.75rem',
                backgroundColor: 'var(--surface-subtle)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              <input
                id="profile-disability"
                type="checkbox"
                checked={formData.disabilityStatus}
                onChange={e => handleChange('disabilityStatus', e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Student with Disability</span>
            </label>
          </div>
        </div>

        {/* Section 4: Narrative Statement */}
        <div className="input-group">
          <label htmlFor="profile-bioStatement" className="input-label">Academic & Career Goals Statement</label>
          <textarea
            id="profile-bioStatement"
            className="input-control"
            rows={3}
            value={formData.bioStatement}
            onChange={e => handleChange('bioStatement', e.target.value)}
            placeholder="Brief summary of your academic objectives and intended societal impact..."
          />
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <Button variant="primary" type="submit" size="lg" icon={<Save size={18} />}>
            Save Profile & Recalculate DNA
          </Button>
        </div>
      </form>
    </div>
  );
};

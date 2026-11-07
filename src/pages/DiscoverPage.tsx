import React, { useState, useMemo } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  X,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Scholarship, ScholarshipCategory, EducationLevel } from '../types';
import { ScholarshipCard } from '../components/scholarships/ScholarshipCard';
import { ScholarshipDetailModal } from '../components/scholarships/ScholarshipDetailModal';
import { EmptyState } from '../components/common/EmptyState';
import { evaluateEligibility } from '../features/eligibility/engine';

export const DiscoverPage: React.FC = () => {
  const { scholarships, state, radarItems } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<string>('All');
  const [selectedEligibility, setSelectedEligibility] = useState<string>('All');
  const [minAwardAmount, setMinAwardAmount] = useState<number>(0);
  const [deadlineFilter, setDeadlineFilter] = useState<string>('All');
  const [bookmarkedOnly, setBookmarkedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'deadline' | 'award' | 'title'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal State
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  // Categories list
  const categories: (ScholarshipCategory | 'All')[] = [
    'All',
    'STEM',
    'Need-Based',
    'Diversity',
    'Merit',
    'Research',
    'International',
    'Arts & Humanities',
    'Athletic'
  ];

  // Filtering & Sorting Logic
  const filteredScholarships = useMemo(() => {
    const today = new Date();

    return scholarships.filter(sch => {
      // 1. Text Search (title, provider, summary, fields)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = sch.title.toLowerCase().includes(query);
        const matchesProvider = sch.provider.toLowerCase().includes(query);
        const matchesSummary = sch.summary.toLowerCase().includes(query);
        const matchesFields = sch.eligibleFields.some(f => f.toLowerCase().includes(query));
        const matchesCategory = sch.category.toLowerCase().includes(query);

        if (!matchesTitle && !matchesProvider && !matchesSummary && !matchesFields && !matchesCategory) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'All' && sch.category !== selectedCategory) {
        return false;
      }

      // 3. Education Level
      if (selectedEducationLevel !== 'All' && !sch.educationLevels.includes(selectedEducationLevel as EducationLevel)) {
        return false;
      }

      // 4. Min Award Amount
      if (minAwardAmount > 0 && sch.awardAmount < minAwardAmount) {
        return false;
      }

      // 5. Deadline Filter
      const deadlineDate = new Date(sch.applicationDeadline);
      const daysRemaining = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (deadlineFilter === 'urgent' && (daysRemaining < 0 || daysRemaining > 14)) {
        return false;
      } else if (deadlineFilter === '30days' && (daysRemaining < 0 || daysRemaining > 30)) {
        return false;
      } else if (deadlineFilter === 'active' && daysRemaining < 0) {
        return false;
      }

      // 6. Bookmarked Only
      if (bookmarkedOnly && !state.bookmarkedScholarshipIds.includes(sch.id)) {
        return false;
      }

      // 7. Eligibility Filter
      if (selectedEligibility !== 'All') {
        const report = evaluateEligibility(sch, state.profile);
        if (selectedEligibility === 'eligible' && report.status !== 'Eligible') {
          return false;
        } else if (selectedEligibility === 'likely' && report.status !== 'Eligible' && report.status !== 'Potentially Eligible') {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
      }
      if (sortBy === 'award') {
        return b.awardAmount - a.awardAmount;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // Default: Relevance / Priority score
      const itemA = radarItems.find(r => r.scholarship.id === a.id);
      const itemB = radarItems.find(r => r.scholarship.id === b.id);
      return (itemB?.priorityScore || 0) - (itemA?.priorityScore || 0);
    });
  }, [
    scholarships,
    searchQuery,
    selectedCategory,
    selectedEducationLevel,
    minAwardAmount,
    deadlineFilter,
    bookmarkedOnly,
    selectedEligibility,
    sortBy,
    state.bookmarkedScholarshipIds,
    state.profile,
    radarItems
  ]);

  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedEducationLevel !== 'All' ? 1 : 0) +
    (selectedEligibility !== 'All' ? 1 : 0) +
    (minAwardAmount > 0 ? 1 : 0) +
    (deadlineFilter !== 'All' ? 1 : 0) +
    (bookmarkedOnly ? 1 : 0);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedEducationLevel('All');
    setSelectedEligibility('All');
    setMinAwardAmount(0);
    setDeadlineFilter('All');
    setBookmarkedOnly(false);
    setSortBy('relevance');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Discover Scholarships
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Search, filter, and compare verified educational funding opportunities matched to your Opportunity DNA.
        </p>
      </div>

      {/* Search and Main Toolbar */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 320px', position: 'relative' }}>
            <Search
              size={18}
              color="var(--text-subtle)"
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="input-control"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by scholarship title, provider, field of study (e.g., STEM, AI, biology)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search scholarships"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn-icon"
                style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', padding: '0.25rem' }}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Category Selector */}
          <div style={{ flex: '0 0 auto', minWidth: '160px' }}>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="input-control"
              aria-label="Filter by category"
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div style={{ flex: '0 0 auto', minWidth: '180px' }}>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="input-control"
              aria-label="Sort scholarships by"
            >
              <option value="relevance">Sort: Highest Match Score</option>
              <option value="deadline">Sort: Closest Deadline</option>
              <option value="award">Sort: Highest Award Amount</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
          </div>

          {/* View Toggle */}
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('grid')}
              className="btn-icon"
              style={{
                backgroundColor: viewMode === 'grid' ? 'var(--primary-soft)' : '#fff',
                color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)',
                borderRadius: 0
              }}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="btn-icon"
              style={{
                backgroundColor: viewMode === 'list' ? 'var(--primary-soft)' : '#fff',
                color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)',
                borderRadius: 0
              }}
              title="List View"
              aria-label="List View"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Extended Secondary Filters Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-light)'
          }}
        >
          {/* Education Level */}
          <select
            value={selectedEducationLevel}
            onChange={e => setSelectedEducationLevel(e.target.value)}
            className="input-control"
            style={{ width: 'auto', fontSize: '0.82rem', padding: '0.45rem 1.8rem 0.45rem 0.65rem' }}
            aria-label="Filter by education level"
          >
            <option value="All">Level: All</option>
            <option value="High School">High School</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Postgraduate">Postgraduate</option>
            <option value="Doctorate">Doctorate</option>
          </select>

          {/* Eligibility Filter */}
          <select
            value={selectedEligibility}
            onChange={e => setSelectedEligibility(e.target.value)}
            className="input-control"
            style={{ width: 'auto', fontSize: '0.82rem', padding: '0.45rem 1.8rem 0.45rem 0.65rem' }}
            aria-label="Filter by eligibility"
          >
            <option value="All">Eligibility: All</option>
            <option value="eligible">Fully Eligible (100% Match)</option>
            <option value="likely">Eligible & Likely Match</option>
          </select>

          {/* Deadline Filter */}
          <select
            value={deadlineFilter}
            onChange={e => setDeadlineFilter(e.target.value)}
            className="input-control"
            style={{ width: 'auto', fontSize: '0.82rem', padding: '0.45rem 1.8rem 0.45rem 0.65rem' }}
            aria-label="Filter by deadline"
          >
            <option value="All">Deadlines: All</option>
            <option value="urgent">Urgent (&le; 14 days)</option>
            <option value="30days">Within 30 days</option>
            <option value="active">Active (not expired)</option>
          </select>

          {/* Min Award Filter */}
          <select
            value={minAwardAmount}
            onChange={e => setMinAwardAmount(Number(e.target.value))}
            className="input-control"
            style={{ width: 'auto', fontSize: '0.82rem', padding: '0.45rem 1.8rem 0.45rem 0.65rem' }}
            aria-label="Filter by minimum award amount"
          >
            <option value="0">Award: Any Amount</option>
            <option value="5000">$5,000+ Minimum</option>
            <option value="10000">$10,000+ Minimum</option>
            <option value="15000">$15,000+ Minimum</option>
            <option value="20000">$20,000+ Minimum</option>
          </select>

          {/* Saved Only Checkbox */}
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: 'var(--text)',
              padding: '0.4rem 0.65rem',
              backgroundColor: bookmarkedOnly ? 'var(--accent-soft)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}
          >
            <input
              type="checkbox"
              checked={bookmarkedOnly}
              onChange={e => setBookmarkedOnly(e.target.checked)}
              style={{ accentColor: 'var(--primary)' }}
            />
            <span>Saved Only ({state.bookmarkedScholarshipIds.length})</span>
          </label>

          {/* Clear Filters Button */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              style={{
                fontSize: '0.82rem',
                color: 'var(--danger)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginLeft: 'auto'
              }}
            >
              <RotateCcw size={13} />
              Clear all ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>

      {/* Results Count Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredScholarships.length}</strong> of {scholarships.length} scholarships
        </div>
      </div>

      {/* Scholarships List/Grid or Empty State */}
      {filteredScholarships.length === 0 ? (
        <EmptyState
          icon={<Search size={28} />}
          title="No Matching Scholarships Found"
          description="Try broadening your search query or relaxing your active filters to discover more educational opportunities."
          actionText="Reset All Filters"
          onAction={clearAllFilters}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid-3">
          {filteredScholarships.map(sch => (
            <ScholarshipCard
              key={sch.id}
              scholarship={sch}
              onOpenDetails={s => setSelectedScholarship(s)}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredScholarships.map(sch => (
            <ScholarshipCard
              key={sch.id}
              scholarship={sch}
              viewMode="list"
              onOpenDetails={s => setSelectedScholarship(s)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <ScholarshipDetailModal
        scholarship={selectedScholarship}
        isOpen={Boolean(selectedScholarship)}
        onClose={() => setSelectedScholarship(null)}
      />
    </div>
  );
};

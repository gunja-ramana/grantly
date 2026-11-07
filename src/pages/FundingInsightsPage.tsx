import React, { useState, useMemo } from 'react';
import {
  Calculator
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import { EducationExpenses } from '../types';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { AlertBanner } from '../components/common/AlertBanner';

export const FundingInsightsPage: React.FC = () => {
  const { state, scholarships, fundingMetrics, updateExpenses } = useApp();

  // Local expense edit state
  const [expenses, setExpenses] = useState<EducationExpenses>(state.expenses);
  const [scenarioScholarshipIds, setScenarioScholarshipIds] = useState<string[]>(() =>
    state.applications.filter(a => a.status === 'Approved' || a.status === 'Submitted').map(a => a.scholarshipId)
  );

  // Sync state if external changes happen
  const handleExpenseChange = (field: keyof EducationExpenses, value: number) => {
    const updated = { ...expenses, [field]: value };
    setExpenses(updated);
    updateExpenses({ [field]: value });
  };

  // Recharts Data 1: Funding Pipeline Stages
  const pipelineData = [
    {
      stage: 'Total Need (Expenses)',
      amount: fundingMetrics.totalEstimatedExpenses,
      fill: '#CE5A5A'
    },
    {
      stage: 'Potential (Wishlist)',
      amount: fundingMetrics.potentialFunding,
      fill: '#174C3A'
    },
    {
      stage: 'Applied (Submitted)',
      amount: fundingMetrics.appliedFunding,
      fill: '#39765A'
    },
    {
      stage: 'Approved (Awarded)',
      amount: fundingMetrics.approvedFunding,
      fill: '#25845A'
    },
    {
      stage: 'Received (Disbursed)',
      amount: fundingMetrics.receivedFunding,
      fill: '#C8ED79'
    }
  ];

  // Recharts Data 2: Application Status Distribution
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    state.applications.forEach(app => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [state.applications]);

  // Recharts Data 3: Scholarship Category Distribution (by bookmarked / tracked)
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    const relevantIds = Array.from(new Set([...state.bookmarkedScholarshipIds, ...state.applications.map(a => a.scholarshipId)]));
    relevantIds.forEach(id => {
      const sch = scholarships.find(s => s.id === id);
      if (sch) {
        counts[sch.category] = (counts[sch.category] || 0) + sch.awardAmount;
      }
    });

    const colors = ['#174C3A', '#39765A', '#25845A', '#C8ED79', '#D69A38', '#533B85', '#2B6CB0'];
    return Object.entries(counts).map(([name, value], idx) => ({
      name,
      value,
      color: colors[idx % colors.length]
    }));
  }, [state.bookmarkedScholarshipIds, state.applications, scholarships]);

  // INNOVATION 4: Scenario Simulator Calculation
  const scenarioTotal = useMemo(() => {
    return scenarioScholarshipIds.reduce((sum, id) => {
      const sch = scholarships.find(s => s.id === id);
      return sum + (sch ? sch.awardAmount : 0);
    }, 0);
  }, [scenarioScholarshipIds, scholarships]);

  const scenarioRemainingGap = Math.max(0, fundingMetrics.totalEstimatedExpenses - scenarioTotal);
  const scenarioCoveragePercent = fundingMetrics.totalEstimatedExpenses > 0
    ? Math.min(100, Math.round((scenarioTotal / fundingMetrics.totalEstimatedExpenses) * 100))
    : 0;

  const toggleScenarioScholarship = (id: string) => {
    setScenarioScholarshipIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Funding Insights & Gap Simulator
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Transparent financial intelligence distinguishing potential discovery funding from confirmed disbursements.
        </p>
      </div>

      {/* Financial Integrity Policy Alert */}
      <AlertBanner type="warning" title="Financial Reporting Strict Integrity">
        <span>
          <strong>Potential Funding</strong> represents opportunities you have saved or explored. <strong>Applied Funding</strong> is awaiting committee evaluation. Only awards confirmed and explicitly disbursed to your bursar account are counted under <strong>Received Funding</strong>.
        </span>
      </AlertBanner>

      {/* Top 4 Real Financial Metrics */}
      <div className="grid-4">
        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Need (Annual Expenses)</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text)', marginTop: '0.35rem' }}>
            ${fundingMetrics.totalEstimatedExpenses.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Calculated from education expenses</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Potential Opportunities Sum</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.35rem' }}>
            ${fundingMetrics.potentialFunding.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Saved & tracked opportunities</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Applied in Review</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#9C6710', marginTop: '0.35rem' }}>
            ${fundingMetrics.appliedFunding.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
            {state.applications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length} active submissions
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Confirmed Received Funding</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.35rem' }}>
            ${fundingMetrics.receivedFunding.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
            {fundingMetrics.receivedCoveragePercentage}% of total annual expense need covered
          </span>
        </div>
      </div>

      {/* Recharts Analytics Charts */}
      <div className="grid-2">
        {/* Pipeline Bar Chart */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Funding Pipeline Breakdown
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Comparison of annual education need versus discovery potential and confirmed disbursements.
          </p>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis
                  dataKey="stage"
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Pie Chart */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Tracked Value by Category
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Distribution of saved and applied funding potential across disciplines and categories.
          </p>

          {categoryData.length === 0 ? (
            <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-subtle)' }}>
              No scholarships tracked yet.
            </div>
          ) : (
            <div style={{ height: '280px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Value']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Application Status Funnel Summary */}
      <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Application Status Lifecycle Funnel
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
          {statusData.map(st => (
            <div
              key={st.name}
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--surface-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{st.name}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
                {st.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INNOVATION 4: FUNDING GAP SIMULATOR */}
      <div className="card" style={{ padding: '1.75rem', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <Calculator size={22} color="var(--primary)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
            Funding Gap Simulator
          </h2>
          <Badge variant="accent">Signature Innovation 4</Badge>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Simulate education cost scenarios, explore hypothetical win combinations, and calculate exact remaining deficits.
        </p>

        {/* Expenses Grid Inputs */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>
            1. Estimated Annual Education Expenses (USD)
          </h4>
          <div className="grid-3">
            <div className="input-group">
              <label className="input-label">Tuition & Fees</label>
              <input
                type="number"
                className="input-control"
                value={expenses.tuition}
                onChange={e => handleExpenseChange('tuition', Number(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Accommodation / Housing</label>
              <input
                type="number"
                className="input-control"
                value={expenses.accommodation}
                onChange={e => handleExpenseChange('accommodation', Number(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Food & Living Expenses</label>
              <input
                type="number"
                className="input-control"
                value={expenses.livingExpenses}
                onChange={e => handleExpenseChange('livingExpenses', Number(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Books & Course Supplies</label>
              <input
                type="number"
                className="input-control"
                value={expenses.booksAndSupplies}
                onChange={e => handleExpenseChange('booksAndSupplies', Number(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Travel & Commute</label>
              <input
                type="number"
                className="input-control"
                value={expenses.travelAndTransport}
                onChange={e => handleExpenseChange('travelAndTransport', Number(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Health & Other Discretionary</label>
              <input
                type="number"
                className="input-control"
                value={expenses.otherExpenses}
                onChange={e => handleExpenseChange('otherExpenses', Number(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        {/* 2. Scenario Simulator Selection */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>
            2. Hypothetical Award Scenario Builder (Select Opportunities to Simulate)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {scholarships.map(sch => {
              const isChecked = scenarioScholarshipIds.includes(sch.id);
              return (
                <label
                  key={sch.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: isChecked ? 'var(--primary-soft)' : 'var(--surface-subtle)',
                    border: isChecked ? '1px solid var(--primary)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleScenarioScholarship(sch.id)}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>
                      {sch.title.substring(0, 26)}...
                    </div>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                    ${sch.awardAmount.toLocaleString()}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 3. Simulator Output Analysis */}
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'var(--surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
                Simulated Scenario Coverage
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                ${scenarioTotal.toLocaleString()}{' '}
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  of ${fundingMetrics.totalEstimatedExpenses.toLocaleString()} Total Need
                </span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
                Remaining Financial Gap
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: scenarioRemainingGap > 0 ? 'var(--danger)' : 'var(--success)' }}>
                ${scenarioRemainingGap.toLocaleString()}
              </div>
            </div>
          </div>

          <ProgressBar
            value={scenarioCoveragePercent}
            label="Hypothetical Education Cost Coverage"
            sublabel={
              scenarioRemainingGap === 0
                ? 'Congratulations! This hypothetical combination covers 100% of your annual expenses.'
                : `A deficit of $${scenarioRemainingGap.toLocaleString()} remains. Explore additional need-based grants or campus employment to bridge this gap.`
            }
            variant={scenarioCoveragePercent >= 100 ? 'primary' : scenarioCoveragePercent >= 50 ? 'accent' : 'warning'}
            height={10}
          />
        </div>
      </div>
    </div>
  );
};

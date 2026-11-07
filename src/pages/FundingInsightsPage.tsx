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
      stage: 'Total Need',
      amount: fundingMetrics.totalEstimatedExpenses,
      fill: '#CE5A5A'
    },
    {
      stage: 'Total Tracked',
      amount: fundingMetrics.totalTrackedValue,
      fill: '#174C3A'
    },
    {
      stage: 'Potential (Not Awarded)',
      amount: fundingMetrics.potentialFunding,
      fill: '#39765A'
    },
    {
      stage: 'Applied (In Review)',
      amount: fundingMetrics.appliedFunding,
      fill: '#9C6710'
    },
    {
      stage: 'Received (Disbursed)',
      amount: fundingMetrics.receivedFunding,
      fill: '#25845A'
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

      {/* Top 5 Real Financial Lifecycle Metrics - Responsive Class Grid */}
      <div className="funding-kpi-grid">
        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Need (Annual Expenses)</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text)', marginTop: '0.35rem' }}>
            ${fundingMetrics.totalEstimatedExpenses.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Calculated from education expenses</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Tracked Opportunity Value</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.35rem' }}>
            ${fundingMetrics.totalTrackedValue.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>All 4 opportunities in student pipeline</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Potential (Not Yet Awarded)</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text)', marginTop: '0.35rem' }}>
            ${fundingMetrics.potentialFunding.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Saved & in-progress opportunities</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Applied in Review</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#9C6710', marginTop: '0.35rem' }}>
            ${fundingMetrics.appliedFunding.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
            {state.applications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length} active submissions pending
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Confirmed Received</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.35rem' }}>
            ${fundingMetrics.receivedFunding.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
            Green Horizons • {fundingMetrics.receivedCoveragePercentage}% of need covered
          </span>
        </div>
      </div>

      {/* Recharts Analytics Charts - Constrained and Responsive */}
      <div className="grid-2">
        {/* Pipeline Bar Chart */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%', overflow: 'hidden' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Funding Pipeline Breakdown
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Comparison of annual education need versus discovery potential and confirmed disbursements.
          </p>

          <div className="chart-container-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: 10, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis
                  dataKey="stage"
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                  angle={-20}
                  textAnchor="end"
                  height={45}
                  interval={0}
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
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%', overflow: 'hidden' }}>
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
            <div className="chart-container-wrapper">
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
              <label htmlFor="expense-tuition" className="input-label">Tuition & Fees</label>
              <input
                id="expense-tuition"
                type="number"
                className="input-control"
                value={expenses.tuition}
                onChange={e => handleExpenseChange('tuition', Number(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="expense-accommodation" className="input-label">Accommodation / Housing</label>
              <input
                id="expense-accommodation"
                type="number"
                className="input-control"
                value={expenses.accommodation}
                onChange={e => handleExpenseChange('accommodation', Number(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="expense-living" className="input-label">Food & Living Expenses</label>
              <input
                id="expense-living"
                type="number"
                className="input-control"
                value={expenses.livingExpenses}
                onChange={e => handleExpenseChange('livingExpenses', Number(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="expense-books" className="input-label">Books & Course Supplies</label>
              <input
                id="expense-books"
                type="number"
                className="input-control"
                value={expenses.booksAndSupplies}
                onChange={e => handleExpenseChange('booksAndSupplies', Number(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="expense-travel" className="input-label">Travel & Commute</label>
              <input
                id="expense-travel"
                type="number"
                className="input-control"
                value={expenses.travelAndTransport}
                onChange={e => handleExpenseChange('travelAndTransport', Number(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="expense-other" className="input-label">Health & Other Discretionary</label>
              <input
                id="expense-other"
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
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            2. Hypothetical Award Scenario Builder (Select Opportunities to Simulate)
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
            Green Horizons ($8,500) is confirmed received. Toggle other pipeline opportunities to see how new awards close your remaining $27,000 deficit.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '0.75rem', width: '100%', minWidth: 0 }}>
            {scholarships.map(sch => {
              const isChecked = scenarioScholarshipIds.includes(sch.id);
              const isReceived = state.applications.find(a => a.scholarshipId === sch.id)?.status === 'Approved';
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
                    cursor: 'pointer',
                    minWidth: 0,
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleScenarioScholarship(sch.id)}
                      style={{ accentColor: 'var(--primary)', flexShrink: 0 }}
                    />
                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                        {sch.title}
                      </div>
                      {isReceived && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 700 }}>
                          • Awarded & Received
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', flexShrink: 0, marginLeft: '0.5rem' }}>
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

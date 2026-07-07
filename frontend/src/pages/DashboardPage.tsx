import { useEffect, useState } from 'react';
import { DashboardHeader } from '../shared/components/DashboardHeader';
import { KpiCard } from '../shared/components/KpiCard';
import { ActionButton } from '../shared/components/ActionButton';
import type { Route } from '../types/route';
import { API_BASE_URL } from '../config';

type DashboardPageProps = {
  navigate: (to: Route) => void;
};

interface AuthUser {
  username: string;
  roles?: string[];
}

function DashboardPage({ navigate }: DashboardPageProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [serverUser, setServerUser] = useState<AuthUser | null>(null);
  const [actionMessage, setActionMessage] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('authUser');
    if (!stored) {
      navigate({ name: 'login' });
      return;
    }

    const parsed: AuthUser = JSON.parse(stored);
    setUser(parsed);

    // Validate token with backend (non-blocking)
    const token = localStorage.getItem('authToken');
    if (token) {
      fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.user) setServerUser(d.user);
        })
        .catch(() => {
          /* ignore network errors for dashboard shell */
        });
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    setActionMessage('');
    navigate({ name: 'login' });
  }

  function handleQuickAction(action: string) {
    if (action === 'logout') {
      handleLogout();
      return;
    }

    if (action === 'add-customer') {
      navigate({ name: 'customer-add' });
      return;
    }

    // Loan module not implemented yet
    const messages: Record<string, string> = {
      'new-loan': 'Loan Application module will be implemented in a future sprint.',
    };

    setActionMessage(messages[action] || 'Action coming soon.');
    window.setTimeout(() => setActionMessage(''), 4000);
  }

  const displayUser = serverUser || user;
  const username = displayUser?.username || 'User';
  const role = (displayUser?.roles && displayUser.roles.length > 0)
    ? displayUser.roles[0]
    : 'User';

  // KPI definitions - all values intentionally 0 for Sprint 2 v1
  const kpis = [
    { title: 'Total Customers', value: 0, subtitle: 'Active profiles', accent: '#0ea5e9' },
    { title: 'Loan Applications', value: 0, subtitle: 'All time', accent: '#8b5cf6' },
    { title: 'Pending Reviews', value: 0, subtitle: 'Awaiting underwriting', accent: '#f59e0b' },
    { title: 'Approved Loans', value: 0, subtitle: 'This period', accent: '#10b981' },
    { title: 'Rejected Loans', value: 0, subtitle: 'This period', accent: '#ef4444' },
  ];

  return (
    <div
      style={{
        maxWidth: 1180,
        margin: '2rem auto',
        padding: '0 1rem',
      }}
    >
      <DashboardHeader username={username} role={role} onLogout={handleLogout} navigate={navigate} currentPage="dashboard" />

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          padding: '2rem 1.75rem 2.25rem',
        }}
      >
        {/* Welcome Section */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
            Welcome back, {username.split(' ')[0]}.
          </div>
          <div style={{ marginTop: '0.25rem', color: '#475569', fontSize: '0.9375rem' }}>
            Here is a high-level overview of platform activity.
          </div>
        </div>

        {/* User Info Summary */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1.75rem',
            fontSize: '0.875rem',
          }}
        >
          <div style={{ background: '#f8fafc', padding: '0.25rem 0.75rem', borderRadius: 6 }}>
            <strong>Signed in:</strong> {username}
          </div>
          <div
            style={{
              background: '#f1f5f9',
              padding: '0.25rem 0.75rem',
              borderRadius: 6,
            }}
            data-testid="dashboard-role"
          >
            <strong>Role:</strong> {role}
          </div>
        </div>

        {/* KPI Cards - Responsive Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(168px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
          data-testid="kpi-grid"
        >
          {kpis.map((kpi) => (
            <KpiCard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              subtitle={kpi.subtitle}
              accentColor={kpi.accent}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '0.5rem' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.5rem',
            }}
          >
            Quick Actions
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.625rem',
            }}
          >
            <ActionButton
              label="Add Customer"
              onClick={() => handleQuickAction('add-customer')}
              variant="secondary"
              data-testid="action-add-customer"
            />
            <ActionButton
              label="New Loan Application"
              onClick={() => handleQuickAction('new-loan')}
              variant="secondary"
              data-testid="action-new-loan"
            />
            <ActionButton
              label="Logout"
              onClick={() => handleQuickAction('logout')}
              variant="outline"
              data-testid="action-logout"
            />
          </div>
        </div>

        {/* Transient Action Feedback */}
        {actionMessage ? (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.625rem 0.875rem',
              background: '#fefce8',
              border: '1px solid #fde047',
              borderRadius: 6,
              color: '#713f12',
              fontSize: '0.8125rem',
            }}
            data-testid="action-feedback"
          >
            {actionMessage}
          </div>
        ) : null}
      </div>

      {/* Footer Note */}
      <div
        style={{
          marginTop: '1.25rem',
          fontSize: '0.6875rem',
          color: '#94a3b8',
          textAlign: 'center',
        }}
      >
        Sprint 2 • Dashboard v1 • All metrics are placeholders (value = 0)
      </div>
    </div>
  );
}

export default DashboardPage;

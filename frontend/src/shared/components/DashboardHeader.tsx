import { useState } from 'react';
import type { Route } from '../../types/route';

export interface DashboardHeaderProps {
  username: string;
  role?: string;
  onLogout: () => void;
  navigate: (to: Route) => void;
  currentPage?: 'dashboard' | 'customers';
}

export function DashboardHeader({ username, role, onLogout, navigate, currentPage }: DashboardHeaderProps) {
  const roleLabel = role || 'User';
  const [showMenu, setShowMenu] = useState(false);

  const isDashboard = currentPage === 'dashboard';
  const isCustomers = currentPage === 'customers';

  const tabBase: React.CSSProperties = {
    fontSize: '0.8125rem',
    fontWeight: 600,
    padding: '0.25rem 0.875rem',
    border: 'none',
    cursor: 'pointer',
    borderRadius: 6,
    background: 'transparent',
    color: '#475569',
  };

  const tabActive: React.CSSProperties = {
    ...tabBase,
    background: '#fff',
    color: '#0f172a',
    fontWeight: 700,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  };

  return (
    <header
      style={{
        padding: '0.625rem 1.25rem 0.5rem',
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        borderRadius: '12px 12px 0 0',
      }}
      data-testid="dashboard-header"
    >
      {/* Top row: left column (AI Mortgage Platform + subtitle under it) | user + ☰ (right) */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {/* Left stack: Platform name + Enterprise Loan Origination directly under it */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
            AI Mortgage Platform
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: 1 }}>
            Enterprise Loan Origination
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
            {username}
          </span>
          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: 500,
              color: '#475569',
              background: '#f1f5f9',
              padding: '1px 6px',
              borderRadius: 999,
            }}
            data-testid="user-role-badge"
          >
            {roleLabel}
          </span>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                padding: '0.15rem 0.4rem',
                fontSize: '0.7rem',
                border: '1px solid #cbd5e1',
                background: '#fff',
                borderRadius: 6,
                cursor: 'pointer',
                lineHeight: 1,
              }}
              data-testid="user-menu-button"
            >
              ☰
            </button>
            {showMenu && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 4px)',
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  padding: '0.25rem 0',
                  minWidth: 140,
                  zIndex: 10,
                }}
              >
                <button
                  onClick={() => { setShowMenu(false); onLogout(); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 0.875rem',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                  }}
                  data-testid="header-logout-button"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs row: left-aligned under the Enterprise Loan Origination subtitle */}
      <div style={{ marginTop: '0.25rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: 2,
            gap: 2,
          }}
          data-testid="page-tabs"
        >
          <button
            onClick={() => navigate({ name: 'dashboard' })}
            style={isDashboard ? tabActive : tabBase}
            data-testid="nav-dashboard"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate({ name: 'customers-list' })}
            style={isCustomers ? tabActive : tabBase}
            data-testid="nav-customers"
          >
            Customers
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;

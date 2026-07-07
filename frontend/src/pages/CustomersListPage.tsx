import { useEffect, useState } from 'react';
import { DashboardHeader } from '../shared/components/DashboardHeader';
import { ActionButton } from '../shared/components/ActionButton';
import type { Route } from '../types/route';
import { API_BASE_URL } from '../config';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  isActive: boolean;
}

type CustomersListPageProps = {
  navigate: (to: Route) => void;
};

export default function CustomersListPage({ navigate }: CustomersListPageProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const token = localStorage.getItem('authToken');

  async function loadCustomers() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const raw = data.data || [];
        const normalized = raw
          .map((c: any) => {
            const rawId = c.id ?? c.Id ?? c.ID;
            const cleanId = String(rawId ?? '').trim();
            return {
              id: cleanId,
              firstName: c.firstName ?? c.FirstName ?? '',
              lastName: c.lastName ?? c.LastName ?? '',
              email: c.email ?? c.Email,
              phone: c.phone ?? c.Phone,
              isActive: c.isActive ?? c.IsActive ?? true,
            };
          })
          .filter((c: any) => c.id !== ''); // drop only truly empty ids
        setCustomers(normalized);
      } else {
        setError(data.message || 'Failed to load customers');
      }
    } catch {
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      navigate({ name: 'login' });
      return;
    }
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleStatus(customer: Customer) {
    setTogglingId(customer.id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/customers/${customer.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !customer.isActive }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await loadCustomers();
      } else {
        setError(data.message || 'Failed to update status');
      }
    } catch {
      setError('Unable to update status');
    } finally {
      setTogglingId(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    navigate({ name: 'login' });
  }

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('authUser') || '{}'); } catch { return {}; }
  })();
  const username = user.username || 'User';
  const role = (user.roles && user.roles[0]) || 'User';

  return (
    <div style={{ maxWidth: 1180, margin: '1.5rem auto', padding: '0 1rem' }}>
      <DashboardHeader username={username} role={role} onLogout={handleLogout} navigate={navigate} currentPage="customers" />

      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderTop: 'none',
        borderRadius: '0 0 12px 12px',
        padding: '1.75rem 1.5rem 2rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>Customers</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Register and manage customer profiles</div>
          </div>
          <ActionButton
            label="Add New Customer"
            onClick={() => navigate({ name: 'customer-add' })}
            variant="primary"
            data-testid="add-customer-button"
          />
        </div>

        {error && (
          <div style={{ marginBottom: '1rem', color: 'crimson', fontSize: '0.875rem' }}>{error}</div>
        )}

        {loading ? (
          <div style={{ padding: '2rem', color: '#64748b' }}>Loading customers...</div>
        ) : customers.length === 0 ? (
          <div style={{ padding: '2rem', color: '#64748b', textAlign: 'center' }}>
            No customers found. Click "Add New Customer" to register the first customer.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '0.6rem 0.5rem', color: '#475569' }}>Name</th>
                  <th style={{ padding: '0.6rem 0.5rem', color: '#475569' }}>Email</th>
                  <th style={{ padding: '0.6rem 0.5rem', color: '#475569' }}>Phone</th>
                  <th style={{ padding: '0.6rem 0.5rem', color: '#475569' }}>Status</th>
                  <th style={{ padding: '0.6rem 0.5rem', color: '#475569' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>
                      {c.firstName} {c.lastName}
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem', color: '#475569' }}>{c.email || '—'}</td>
                    <td style={{ padding: '0.65rem 0.5rem', color: '#475569' }}>{c.phone || '—'}</td>
                    <td style={{ padding: '0.65rem 0.5rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.75rem',
                          padding: '1px 10px',
                          borderRadius: 999,
                          background: c.isActive ? '#dcfce7' : '#fee2e2',
                          color: c.isActive ? '#166534' : '#991b1b',
                        }}
                      >
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                         <button
                           onClick={() => navigate({ name: 'customer-view', id: String(c.id) })}
                           style={{ fontSize: '0.8125rem', padding: '0.25rem 0.6rem', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, cursor: 'pointer' }}
                           data-testid={`view-${c.id}`}
                         >
                           View
                         </button>
                         <button
                           onClick={() => navigate({ name: 'customer-edit', id: String(c.id) })}
                           style={{ fontSize: '0.8125rem', padding: '0.25rem 0.6rem', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, cursor: 'pointer' }}
                           data-testid={`edit-${c.id}`}
                         >
                           Edit
                         </button>
                        <button
                          onClick={() => toggleStatus(c)}
                          disabled={togglingId === c.id}
                          style={{
                            fontSize: '0.8125rem',
                            padding: '0.25rem 0.6rem',
                            border: '1px solid #cbd5e1',
                            background: '#fff',
                            borderRadius: 6,
                            cursor: togglingId === c.id ? 'not-allowed' : 'pointer',
                            opacity: togglingId === c.id ? 0.6 : 1,
                          }}
                          data-testid={`toggle-${c.id}`}
                        >
                          {c.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: '1.25rem', fontSize: '0.6875rem', color: '#94a3b8' }}>
          Sprint 3 • Customer Management • Active/Inactive status (no delete)
        </div>
      </div>
    </div>
  );
}

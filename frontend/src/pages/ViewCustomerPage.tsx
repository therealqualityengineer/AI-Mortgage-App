import { useEffect, useState } from 'react';
import { DashboardHeader } from '../shared/components/DashboardHeader';
import type { Route } from '../types/route';
import { API_BASE_URL } from '../config';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

type ViewCustomerPageProps = {
  id: string;
  navigate: (to: Route) => void;
  success?: string;
};

export default function ViewCustomerPage({ id, navigate, success }: ViewCustomerPageProps) {
  const token = localStorage.getItem('authToken');

  // Sanitize route id (UUIDs only now).
  const customerId = String(id ?? '').trim();
  const isValidId = customerId.length === 36 && /^[0-9a-f-]{36}$/i.test(customerId);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage] = useState(success || '');
  const [toggling, setToggling] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        const c = json.data;
        setCustomer({
          ...c,
          id: String(c.id ?? c.Id ?? c.ID ?? customerId),
          firstName: c.firstName ?? c.FirstName ?? '',
          lastName: c.lastName ?? c.LastName ?? '',
          isActive: c.isActive ?? c.IsActive ?? true,
        });
      } else {
        setError(json.message || 'Customer not found');
      }
    } catch {
      setError('Unable to load customer');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      navigate({ name: 'login' });
      return;
    }
    if (!isValidId) {
      navigate({ name: 'customers-list' });
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, token, isValidId]);

  async function toggleStatus() {
    if (!customer) return;
    setToggling(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/customers/${customerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !customer.isActive }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        await load();
      } else {
        setError(json.message || 'Failed to update status');
      }
    } catch {
      setError('Unable to update status');
    } finally {
      setToggling(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    navigate({ name: 'login' });
  }

  const user = (() => { try { return JSON.parse(localStorage.getItem('authUser') || '{}'); } catch { return {}; } })();
  const username = user.username || 'User';
  const role = (user.roles && user.roles[0]) || 'User';

  const displayId = (typeof id === 'string' && id.trim()) ? id.trim() : '—';
  const row = (label: string, value?: string | null) => (
    <div style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ width: 140, color: '#64748b', fontSize: '0.8125rem' }}>{label}</div>
      <div style={{ color: '#0f172a' }}>{value || '—'}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: '1.5rem auto', padding: '0 1rem' }}>
      <DashboardHeader username={username} role={role} onLogout={handleLogout} navigate={navigate} currentPage="customers" />

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '1.75rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700 }}>Customer Details</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {displayId}</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => navigate({ name: 'customers-list' })} style={{ padding: '0.5rem 0.9rem', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 8, cursor: 'pointer' }}>Back to List</button>
            {customer && (
              <>
                <button onClick={() => navigate({ name: 'customer-edit', id })} style={{ padding: '0.5rem 0.9rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Edit</button>
                <button onClick={toggleStatus} disabled={toggling} style={{ padding: '0.5rem 0.9rem', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 8, cursor: toggling ? 'not-allowed' : 'pointer' }}>
                  {customer.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </>
            )}
          </div>
        </div>

        {successMessage && (
          <div style={{ marginBottom: '1rem', color: '#166534', background: '#dcfce7', padding: '0.5rem 0.75rem', borderRadius: 6, fontSize: '0.875rem' }}>{successMessage}</div>
        )}
        {error && <div style={{ color: 'crimson', marginBottom: '1rem' }}>{error}</div>}

        {loading || !customer ? (
          <div style={{ padding: '2rem', color: '#64748b' }}>{loading ? 'Loading...' : 'Customer not found.'}</div>
        ) : (
          <div>
            {row('Name', `${customer.firstName} ${customer.lastName}`)}
            {row('Email', customer.email)}
            {row('Phone', customer.phone)}
            {row('Date of Birth', customer.dateOfBirth ? customer.dateOfBirth.split('T')[0] : undefined)}
            {row('Address Line 1', customer.addressLine1)}
            {row('Address Line 2', customer.addressLine2)}
            {row('City / State / Postal', [customer.city, customer.state, customer.postalCode].filter(Boolean).join(', ') || undefined)}
            {row('Country', customer.country)}
            <div style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0' }}>
              <div style={{ width: 140, color: '#64748b', fontSize: '0.8125rem' }}>Status</div>
              <span style={{
                background: customer.isActive ? '#dcfce7' : '#fee2e2',
                color: customer.isActive ? '#166534' : '#991b1b',
                padding: '1px 10px',
                borderRadius: 999,
                fontSize: '0.75rem',
              }}>{customer.isActive ? 'Active' : 'Inactive'}</span>
            </div>
            {row('Created', new Date(customer.createdAt).toLocaleString())}
            {customer.updatedAt && row('Last Updated', new Date(customer.updatedAt).toLocaleString())}
          </div>
        )}

        <div style={{ marginTop: '1.5rem', fontSize: '0.6875rem', color: '#94a3b8' }}>
          Sprint 3 • Customer Management • View only (no delete)
        </div>
      </div>
    </div>
  );
}

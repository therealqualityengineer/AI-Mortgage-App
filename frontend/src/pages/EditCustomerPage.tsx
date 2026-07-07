import { useEffect, useState } from 'react';
import { DashboardHeader } from '../shared/components/DashboardHeader';
import { CustomerForm, type CustomerFormData, normalizeCountry } from '../shared/components/CustomerForm';
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
}

type EditCustomerPageProps = {
  id: string;
  navigate: (to: Route) => void;
};

export default function EditCustomerPage({ id, navigate }: EditCustomerPageProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      navigate({ name: 'login' });
      return;
    }

    async function load() {
      try {
      const res = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (res.ok && json.success && json.data) {
          const c = json.data;
          setCustomer({
            ...c,
            id: String(c.id ?? c.Id ?? c.ID ?? id),
            firstName: c.firstName ?? c.FirstName ?? '',
            lastName: c.lastName ?? c.LastName ?? '',
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

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleLogout() {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    navigate({ name: 'login' });
  }

  const user = (() => { try { return JSON.parse(localStorage.getItem('authUser') || '{}'); } catch { return {}; } })();
  const username = user.username || 'User';
  const role = (user.roles && user.roles[0]) || 'User';

  async function handleSubmit(data: CustomerFormData): Promise<{ success: boolean; error?: string }> {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || null,
      phone: data.phone || null,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : null,
      addressLine1: data.addressLine1 || null,
      addressLine2: data.addressLine2 || null,
      city: data.city || null,
      state: data.state || null,
      postalCode: data.postalCode || null,
      country: data.country || 'United States',
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let json: any = {};
      try { json = await res.json(); } catch { /* non-JSON error body */ }

      if (res.ok && json.success) {
        navigate({ name: 'customer-view', id, success: 'Customer updated successfully.' });
        return { success: true };
      } else {
        const msg = json.message || json.error || (res.status >= 500 ? `Server error (${res.status})` : 'Failed to update customer');
        return { success: false, error: msg };
      }
    } catch {
      return { success: false, error: 'Unable to connect to server' };
    }
  }

  return (
    <div style={{ maxWidth: 860, margin: '1.5rem auto', padding: '0 1rem' }}>
      <DashboardHeader username={username} role={role} onLogout={handleLogout} navigate={navigate} currentPage="customers" />

      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderTop: 'none',
        borderRadius: '0 0 12px 12px',
        padding: '1.75rem 1.5rem 2rem',
      }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>Edit Customer</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {id}</div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', color: '#64748b' }}>Loading...</div>
        ) : error ? (
          <div>
            <div style={{ color: 'crimson', marginBottom: '1rem' }}>{error}</div>
            <button onClick={() => navigate({ name: 'customers-list' })} style={{ padding: '0.5rem 0.9rem', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 8 }}>Back to List</button>
          </div>
        ) : customer ? (
          <CustomerForm
            initialData={{
              firstName: customer.firstName,
              lastName: customer.lastName,
              email: customer.email || '',
              phone: customer.phone || '',
              dateOfBirth: customer.dateOfBirth || '',
              addressLine1: customer.addressLine1 || '',
              addressLine2: customer.addressLine2 || '',
              city: customer.city || '',
              state: customer.state || '',
              postalCode: customer.postalCode || '',
              country: normalizeCountry(customer.country),
            }}
            onSubmit={handleSubmit}
            onCancel={() => navigate({ name: 'customer-view', id })}
            submitLabel="Save Changes"
            isEdit
          />
        ) : null}

        <div style={{ marginTop: '1.5rem', fontSize: '0.6875rem', color: '#94a3b8' }}>
          Sprint 3 • Customer Management • Edit
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { DashboardHeader } from '../shared/components/DashboardHeader';
import { CustomerForm, type CustomerFormData } from '../shared/components/CustomerForm';
import type { Route } from '../types/route';

type AddCustomerPageProps = {
  navigate: (to: Route) => void;
};

export default function AddCustomerPage({ navigate }: AddCustomerPageProps) {
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      navigate({ name: 'login' });
    }
  }, [token, navigate]);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('authUser') || '{}'); } catch { return {}; }
  })();
  const username = user.username || 'User';
  const role = (user.roles && user.roles[0]) || 'User';

  function handleLogout() {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    navigate({ name: 'login' });
  }

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
      country: data.country || 'US',
    };

    try {
      const res = await fetch('http://localhost:5294/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        // Requirement: After successfully adding, redirect back to Customer List
        navigate({ name: 'customers-list' });
        return { success: true };
      } else {
        return { success: false, error: json.message || 'Failed to create customer' };
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
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>Add New Customer</div>
          <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Register customer profile before loan application</div>
        </div>

        <CustomerForm
          onSubmit={handleSubmit}
          onCancel={() => navigate({ name: 'customers-list' })}
          submitLabel="Create Customer"
        />

        <div style={{ marginTop: '1.5rem', fontSize: '0.6875rem', color: '#94a3b8' }}>
          Sprint 3 • Customer Management
        </div>
      </div>
    </div>
  );
}

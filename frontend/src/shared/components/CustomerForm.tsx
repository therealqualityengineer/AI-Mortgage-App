import { useState } from 'react';

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CustomerFormProps {
  initialData?: Partial<CustomerFormData>;
  onSubmit: (data: CustomerFormData) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
  submitLabel?: string;
  isEdit?: boolean;
}

export function CustomerForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save Customer',
  isEdit: _isEdit = false,
}: CustomerFormProps) {
  const [form, setForm] = useState<CustomerFormData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    dateOfBirth: initialData?.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
    addressLine1: initialData?.addressLine1 || '',
    addressLine2: initialData?.addressLine2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    postalCode: initialData?.postalCode || '',
    country: initialData?.country || 'US',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function update(field: keyof CustomerFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('First name and last name are required.');
      return;
    }

    setSubmitting(true);
    setError('');

    const result = await onSubmit(form);
    if (!result.success) {
      setError(result.error || 'Failed to save customer.');
      setSubmitting(false);
    }
    // On success, parent handles redirect
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem',
    fontSize: '0.9375rem',
    border: '1px solid #cbd5e1',
    borderRadius: 6,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '0.25rem',
    display: 'block',
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={labelStyle}>First Name *</label>
          <input
            style={inputStyle}
            value={form.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            required
            data-testid="first-name"
          />
        </div>
        <div>
          <label style={labelStyle}>Last Name *</label>
          <input
            style={inputStyle}
            value={form.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            required
            data-testid="last-name"
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            style={inputStyle}
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            data-testid="email"
          />
        </div>
        <div>
          <label style={labelStyle}>Phone</label>
          <input
            style={inputStyle}
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            data-testid="phone"
          />
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Date of Birth</label>
        <input
          type="date"
          style={inputStyle}
          value={form.dateOfBirth}
          onChange={(e) => update('dateOfBirth', e.target.value)}
          data-testid="dob"
        />
      </div>

      <div style={{ marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
        Address
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={labelStyle}>Address Line 1</label>
          <input
            style={inputStyle}
            value={form.addressLine1}
            onChange={(e) => update('addressLine1', e.target.value)}
            data-testid="addr1"
          />
        </div>
        <div>
          <label style={labelStyle}>Address Line 2</label>
          <input
            style={inputStyle}
            value={form.addressLine2}
            onChange={(e) => update('addressLine2', e.target.value)}
            data-testid="addr2"
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={labelStyle}>City</label>
          <input style={inputStyle} value={form.city} onChange={(e) => update('city', e.target.value)} data-testid="city" />
        </div>
        <div>
          <label style={labelStyle}>State</label>
          <input style={inputStyle} value={form.state} onChange={(e) => update('state', e.target.value)} data-testid="state" />
        </div>
        <div>
          <label style={labelStyle}>Postal Code</label>
          <input style={inputStyle} value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} data-testid="postal" />
        </div>
        <div>
          <label style={labelStyle}>Country</label>
          <input style={inputStyle} value={form.country} onChange={(e) => update('country', e.target.value)} data-testid="country" />
        </div>
      </div>

      {error && (
        <div style={{ color: 'crimson', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '0.625rem 1.5rem',
            background: '#0f172a',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.7 : 1,
          }}
          data-testid="submit-customer"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '0.625rem 1.25rem',
            background: '#fff',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            fontWeight: 600,
            cursor: 'pointer',
          }}
          data-testid="cancel-customer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default CustomerForm;

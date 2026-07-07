import { useState } from 'react';

const countryList = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Congo-Brazzaville)', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czechia (Czech Republic)', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
  'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
  'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
  'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
  'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar (Burma)', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan',
  'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
  'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal',
  'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea',
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Tajikistan', 'Tanzania',
  'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda',
  'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
  'Yemen', 'Zambia', 'Zimbabwe'
];

export function normalizeCountry(c?: string): string {
  if (!c) return 'United States';
  const trimmed = c.trim();
  if (trimmed === 'US' || trimmed === 'USA' || trimmed.toLowerCase() === 'united states') return 'United States';
  if (countryList.includes(trimmed)) return trimmed;
  const match = countryList.find(x => x.toLowerCase() === trimmed.toLowerCase());
  return match || 'United States';
}

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
    phone: (initialData?.phone || '').replace(/\D/g, '').slice(0, 10),
    dateOfBirth: initialData?.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
    addressLine1: initialData?.addressLine1 || '',
    addressLine2: initialData?.addressLine2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    postalCode: initialData?.postalCode || '',
    country: normalizeCountry(initialData?.country),
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function update(field: keyof CustomerFormData, value: string) {
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('First name and last name are required.');
      return;
    }

    if (!form.email || !form.email.trim()) {
      setError('Email is required.');
      return;
    }

    if (!form.email.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!form.phone || form.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
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
          <label style={labelStyle}>Email *</label>
          <input
            type="email"
            style={inputStyle}
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
            data-testid="email"
          />
        </div>
        <div>
          <label style={labelStyle}>Phone *</label>
          <input
            style={inputStyle}
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            required
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 180px 320px', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={labelStyle}>City</label>
          <input style={inputStyle} value={form.city} onChange={(e) => update('city', e.target.value)} data-testid="city" />
        </div>
        <div>
          <label style={labelStyle}>State</label>
          <input style={inputStyle} value={form.state} onChange={(e) => update('state', e.target.value)} data-testid="state" />
        </div>
        <div>
          <label style={{ ...labelStyle, whiteSpace: 'nowrap' }}>Zip Code</label>
          <input style={inputStyle} value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} data-testid="postal" />
        </div>
        <div>
          <label style={labelStyle}>Country</label>
          <select
            style={inputStyle}
            value={form.country}
            onChange={(e) => update('country', e.target.value)}
            data-testid="country"
          >
            {countryList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
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

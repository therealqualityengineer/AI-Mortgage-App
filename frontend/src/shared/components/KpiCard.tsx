export interface KpiCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  accentColor?: string;
}

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: '1.5rem 1.75rem',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
  minHeight: 108,
};

const valueStyle: React.CSSProperties = {
  fontSize: '2.25rem',
  fontWeight: 700,
  color: '#0f172a',
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
};

const titleStyle: React.CSSProperties = {
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#94a3b8',
};

export function KpiCard({ title, value, subtitle, accentColor }: KpiCardProps) {
  return (
    <div
      style={{
        ...cardStyle,
        borderTop: accentColor ? `3px solid ${accentColor}` : undefined,
      }}
      data-testid={`kpi-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div style={titleStyle}>{title}</div>
      <div style={valueStyle}>{value}</div>
      {subtitle ? <div style={subtitleStyle}>{subtitle}</div> : null}
    </div>
  );
}

export default KpiCard;

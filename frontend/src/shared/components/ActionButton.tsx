export interface ActionButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  'data-testid'?: string;
}

const baseStyle: React.CSSProperties = {
  padding: '0.625rem 1.25rem',
  fontSize: '0.9375rem',
  fontWeight: 600,
  borderRadius: 8,
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'transform 0.1s ease, box-shadow 0.1s ease, background 0.2s ease',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  whiteSpace: 'nowrap',
};

const variants: Record<string, React.CSSProperties> = {
  primary: {
    background: '#0f172a',
    color: '#ffffff',
    borderColor: '#0f172a',
  },
  secondary: {
    background: '#f1f5f9',
    color: '#0f172a',
    borderColor: '#cbd5e1',
  },
  outline: {
    background: '#ffffff',
    color: '#334155',
    borderColor: '#cbd5e1',
  },
};

export function ActionButton({
  label,
  onClick,
  variant = 'secondary',
  disabled = false,
  'data-testid': testId,
}: ActionButtonProps) {
  const style: React.CSSProperties = {
    ...baseStyle,
    ...variants[variant],
    opacity: disabled ? 0.55 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={style}
      data-testid={testId}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(0.985)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {label}
    </button>
  );
}

export default ActionButton;

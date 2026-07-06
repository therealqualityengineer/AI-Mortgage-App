import { useEffect, useState } from 'react';

type DashboardPageProps = {
  navigate: (to: '/' | '/dashboard') => void;
};

function DashboardPage({ navigate }: DashboardPageProps) {
  const [user, setUser] = useState<{ username: string; roles?: string[] } | null>(null);
  const [serverUser, setServerUser] = useState<{ username: string; roles?: string[] } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('authUser');
    if (!stored) {
      navigate('/');
      return;
    }

    setUser(JSON.parse(stored));

    // Demonstrate calling a protected endpoint with the JWT
    const token = localStorage.getItem('authToken');
    if (token) {
      fetch('http://localhost:5294/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d?.user) setServerUser(d.user); })
        .catch(() => { /* ignore for demo */ });
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    navigate('/');
  }

  return (
    <div style={{ maxWidth: 760, margin: '3rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: 12 }}>
      <h1>Dashboard</h1>
      <p>Welcome to the AI Mortgage App shell. JWT login is active.</p>
      {user ? (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Signed in as:</strong> {user.username}</p>
          <p><strong>Roles (from login response):</strong> {user.roles?.join(', ') || 'None'}</p>
        </div>
      ) : null}

      {serverUser ? (
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f8f8f8', borderRadius: 6 }}>
          <p><strong>Server-validated via /api/auth/me (JWT protected):</strong></p>
          <p>Username: {serverUser.username}</p>
          <p>Roles: {serverUser.roles?.join(', ') || 'None'}</p>
        </div>
      ) : null}

      <button onClick={handleLogout} style={{ marginTop: '1.5rem', padding: '0.75rem', cursor: 'pointer' }}>Log out</button>
    </div>
  );
}

export default DashboardPage;

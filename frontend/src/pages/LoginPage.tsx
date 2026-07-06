import type { FormEvent } from 'react';
import { useState } from 'react';
import type { Route } from '../App';

type LoginPageProps = {
  navigate: (to: Route) => void;
};

function LoginPage({ navigate }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearMessage() {
    if (message) setMessage('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setMessage('Username and password are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5294/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('authUser', JSON.stringify(data.user));
        localStorage.setItem('authToken', data.token);
        setMessage('');
        navigate({ name: 'dashboard' });
        return;
      }

      // Always show a safe, consistent message for authentication failures.
      // Do not reveal whether username exists or password was wrong.
      setMessage('Invalid username or password.');
      setPassword(''); // clear password on failure (security + UX)
    } catch {
      setMessage('Unable to connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '4rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: 12 }}>
      <h1>Mortgage Platform Login</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <label>
          Username
          <input
            value={username}
            onChange={(event) => { setUsername(event.target.value); clearMessage(); }}
            required
            autoComplete="username"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => { setPassword(event.target.value); clearMessage(); }}
            required
            autoComplete="current-password"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ padding: '0.75rem', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      {message ? <p style={{ color: 'crimson', marginTop: '1rem' }}>{message}</p> : null}
    </div>
  );
}

export default LoginPage;

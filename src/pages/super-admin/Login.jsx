import { useState } from 'react';
import '../../styles/admin.css';
export default function Login({ onLogin, message }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setBusy(true); setError('');
    try { await onLogin(values.get('email').trim(), values.get('password')); }
    catch (error) { setError(error.message); form.elements.password.value = ''; }
    finally { setBusy(false); }
  }
  return <main className="admin-ui admin-session-screen"><section className="admin-login admin-card">
    <a href="/"><img src="/brand/educonnect-logo.png" width="150" alt="EduConnect home" /></a>
    <h1>System Administration</h1><p>Sign in with your System Admin account.</p>
    {message && <p role="status" className="admin-notice">{message}</p>}
    <form onSubmit={submit} className="admin-stack">
      <label>Email<input name="email" type="email" autoComplete="username" required maxLength={254} disabled={busy} /></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required disabled={busy} /></label>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <button disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form><a href="/" className="admin-back">Back to Home</a>
  </section></main>;
}

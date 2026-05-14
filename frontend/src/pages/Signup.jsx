import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [busy, setBusy] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signup(name, email, password, role);
      showToast('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Signup failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card slide-up" onSubmit={handleSubmit} id="signup-form">
        <h1 className="auth-card__title">Create Account</h1>
        <p className="auth-card__sub">Join Task Forge and start forging</p>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input id="name" type="text" required value={name}
            onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required minLength={6} value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? 'Creating...' : 'Create Account'}
        </button>
        <div className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
}

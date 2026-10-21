import React, { useState } from 'react';
import { X, Lock, Mail, User, Briefcase, Clock, AlertCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [interests, setInterests] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState(15);
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await onRegister({
          name,
          email,
          password,
          role,
          interests,
          hoursPerWeek: Number(hoursPerWeek),
          bio,
        });
      } else {
        await onLogin(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword(demoRole === 'ADMIN' ? 'admin123' : demoRole === 'MENTOR' ? 'mentor123' : 'student123');
    setIsRegister(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {isRegister ? 'Create SkillSync Account' : 'Welcome to SkillSync'}
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Quick Fill Bar for Demo */}
        <div style={{ padding: '12px 24px', background: 'rgba(99, 102, 241, 0.08)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: '#c7d2fe', fontWeight: 600, marginBottom: '6px' }}>
            DEMO PRESETS (Click to Autofill):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
              onClick={() => handleQuickFill('rahul@student.edu', 'STUDENT')}
            >
              Student (Rahul)
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
              onClick={() => handleQuickFill('ananya@student.edu', 'STUDENT')}
            >
              Student (Ananya)
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
              onClick={() => handleQuickFill('sarah.chen@skillsync.edu', 'MENTOR')}
            >
              Mentor (Dr. Chen)
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
              onClick={() => handleQuickFill('admin@skillsync.edu', 'ADMIN')}
            >
              Admin Coordinator
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#f87171',
              marginBottom: '16px',
              fontSize: '0.875rem'
            }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Account Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="STUDENT">Student</option>
                  <option value="MENTOR">Mentor</option>
                  <option value="ADMIN">Academic Coordinator / Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="e.g. student@skillsync.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label">Domain Interests (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Full Stack Web, Cloud & DevOps, AI / Machine Learning"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                />
              </div>

              {role === 'STUDENT' && (
                <div className="form-group">
                  <label className="form-label">Available Hours Per Week ({hoursPerWeek} hrs)</label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="5"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(e.target.value)}
                    style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Short Bio</label>
                <textarea
                  rows="2"
                  className="form-textarea"
                  placeholder="Brief introduction of your technical background..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : isRegister ? 'Complete Registration' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <span
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
            >
              {isRegister ? 'Sign In' : 'Create one'}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

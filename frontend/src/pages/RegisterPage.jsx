import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User, UserPlus, AlertCircle, Shield } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await register(name, email, password, role);
      if (res.success) {
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <GraduationCap size={32} />
          </div>
          <h2>Join LearnHub</h2>
          <p>Create your learner profile to enroll in courses and track progress.</p>
        </div>

        {error && (
          <div className="alert-message alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input
                id="name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                id="email"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password (min. 6 characters)</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Select Account Role</label>
            <div className="role-selector-grid">
              <button
                type="button"
                className={`role-option ${role === 'student' ? 'active' : ''}`}
                onClick={() => setRole('student')}
              >
                <GraduationCap size={20} />
                <div className="role-text-col">
                  <strong>Student</strong>
                  <span>Browse, enroll, and study courses</span>
                </div>
              </button>

              <button
                type="button"
                className={`role-option ${role === 'admin' ? 'active' : ''}`}
                onClick={() => setRole('admin')}
              >
                <Shield size={20} />
                <div className="role-text-col">
                  <strong>Administrator</strong>
                  <span>Manage courses (CRUD) & analytics</span>
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading-flex">
                <span className="spinner-sm"></span> Creating Profile...
              </span>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create Free Account</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer-text">
          <span>Already have an account? </span>
          <Link to="/login" className="auth-link">
            Log In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;


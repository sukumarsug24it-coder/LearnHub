import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, LogIn, AlertCircle, Sparkles, UserCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(redirectPath);
        }
      } else {
        setError(res.message || 'Login failed. Please verify credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <GraduationCap size={32} />
          </div>
          <h2>Welcome Back to LearnHub</h2>
          <p>Log in to access your enrolled courses and learning materials.</p>
        </div>

        {/* Demo Account Quick Buttons */}
        <div className="demo-accounts-box">
          <div className="demo-box-header">
            <Sparkles size={14} className="text-warning" />
            <span>Fast Evaluation: One-Click Demo Credentials</span>
          </div>
          <div className="demo-btn-group">
            <button
              type="button"
              className="btn btn-outline btn-xs demo-fill-btn"
              onClick={() => fillDemoAccount('student@learnhub.dev', 'password123')}
            >
              <UserCheck size={14} />
              <span>Fill Student Demo</span>
            </button>
            <button
              type="button"
              className="btn btn-outline btn-xs demo-fill-btn"
              onClick={() => fillDemoAccount('admin@learnhub.dev', 'password123')}
            >
              <Sparkles size={14} />
              <span>Fill Admin Demo</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="alert-message alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
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

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading-flex">
                <span className="spinner-sm"></span> Signing In...
              </span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer-text">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="auth-link">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


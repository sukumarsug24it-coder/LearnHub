import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Layers,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon-wrap">
            <GraduationCap className="logo-icon" />
          </div>
          <span className="brand-text">
            Learn<span className="text-gradient">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <Link
            to="/courses"
            className={`nav-link ${isActive('/courses') ? 'active' : ''}`}
          >
            <BookOpen size={17} />
            <span>Course Catalogue</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/my-courses"
                className={`nav-link ${isActive('/my-courses') ? 'active' : ''}`}
              >
                <Layers size={17} />
                <span>My Courses</span>
              </Link>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </Link>
            </>
          )}

          {isAdmin && (
            <div className="admin-nav-group">
              <Link
                to="/admin"
                className={`nav-link admin-pill ${isActive('/admin') ? 'active' : ''}`}
              >
                <Sparkles size={16} />
                <span>Admin Panel</span>
              </Link>
              <Link
                to="/admin/courses"
                className={`nav-link ${isActive('/admin/courses') ? 'active' : ''}`}
              >
                <Settings size={16} />
                <span>Manage Courses</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Right Auth Action Buttons */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <div className="user-badge">
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                  alt={user?.name}
                  className="user-avatar"
                />
                <div className="user-info-text">
                  <span className="user-name">{user?.name}</span>
                  <span className={`role-tag role-${user?.role || 'student'}`}>
                    {user?.role === 'admin' ? 'Admin' : 'Student'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm logout-btn"
                title="Log Out"
              >
                <LogOut size={16} />
                <span className="btn-label-desktop">Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons-group">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <Link
            to="/courses"
            className={`mobile-link ${isActive('/courses') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <BookOpen size={18} />
            <span>Course Catalogue</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/my-courses"
                className={`mobile-link ${isActive('/my-courses') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Layers size={18} />
                <span>My Courses</span>
              </Link>
              <Link
                to="/dashboard"
                className={`mobile-link ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={18} />
                <span>Student Dashboard</span>
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <div className="mobile-divider" />
              <Link
                to="/admin"
                className={`mobile-link ${isActive('/admin') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles size={18} />
                <span>Admin Analytics</span>
              </Link>
              <Link
                to="/admin/courses"
                className={`mobile-link ${isActive('/admin/courses') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings size={18} />
                <span>Manage Courses (CRUD)</span>
              </Link>
            </>
          )}

          <div className="mobile-divider" />

          {isAuthenticated ? (
            <button onClick={handleLogout} className="mobile-link logout-link">
              <LogOut size={18} />
              <span>Log Out ({user?.name})</span>
            </button>
          ) : (
            <div className="mobile-auth-grid">
              <Link
                to="/login"
                className="btn btn-outline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;


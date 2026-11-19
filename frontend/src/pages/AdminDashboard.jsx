import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, courseService } from '../services/api';
import {
  Sparkles,
  BookOpen,
  Users,
  Layers,
  Award,
  TrendingUp,
  PlusCircle,
  Settings,
  RefreshCw,
  Star,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [resetNotice, setResetNotice] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (usersRes.data.success) {
        setUsers(usersRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleResetData = async () => {
    if (!window.confirm('Are you sure you want to restore the default sample dataset?')) {
      return;
    }
    setResetting(true);
    try {
      const res = await adminService.resetData();
      if (res.data.success) {
        setResetNotice('Demo dataset successfully restored to original factory defaults!');
        await fetchAdminData();
        setTimeout(() => setResetNotice(''), 4000);
      }
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Admin Intelligence & Metrics...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Admin Top Header */}
      <div className="admin-header-banner">
        <div className="admin-header-left">
          <div className="admin-pill">
            <Sparkles size={16} />
            <span>Administrator Control Center</span>
          </div>
          <h1>Platform Overview & Analytics</h1>
          <p>
            Monitor course enrollment velocity, student progression rates, and
            system statistics.
          </p>
        </div>

        <div className="admin-header-actions">
          <Link to="/admin/courses" className="btn btn-primary btn-md">
            <PlusCircle size={18} />
            <span>Manage Courses (CRUD)</span>
          </Link>
          <button
            onClick={handleResetData}
            disabled={resetting}
            className="btn btn-outline btn-md reset-btn"
            title="Reset to default seed dataset"
          >
            <RefreshCw size={16} className={resetting ? 'spin-icon' : ''} />
            <span>{resetting ? 'Resetting...' : 'Reseed Demo Data'}</span>
          </button>
        </div>
      </div>

      {resetNotice && (
        <div className="alert-message alert-success admin-notice">
          <CheckCircle size={18} />
          <span>{resetNotice}</span>
        </div>
      )}

      <div className="admin-container">
        {/* Metric Cards Row */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-wrap icon-blue">
              <BookOpen size={24} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Published Courses</span>
              <strong className="metric-value">{stats?.totalCourses || 0}</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap icon-purple">
              <Users size={24} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Registered Users</span>
              <strong className="metric-value">{stats?.totalUsers || 0}</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap icon-green">
              <Layers size={24} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Total Enrollments</span>
              <strong className="metric-value">{stats?.totalEnrollments || 0}</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap icon-amber">
              <Award size={24} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Avg. Completion Rate</span>
              <strong className="metric-value">{stats?.avgCompletionRate || 0}%</strong>
            </div>
          </div>
        </div>

        {/* Analytics Section: Top Courses & Category Breakdown */}
        <div className="admin-analytics-grid">
          {/* Top Courses Table */}
          <div className="admin-box top-courses-box">
            <div className="admin-box-header">
              <h3>Top Performing Courses</h3>
              <Link to="/admin/courses" className="link-action">
                <span>View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Course Title</th>
                    <th>Category</th>
                    <th>Students</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.topCourses?.map((course) => (
                    <tr key={course.id || course._id}>
                      <td className="table-title-cell">
                        <Link to={`/courses/${course.id || course._id}`}>
                          {course.title}
                        </Link>
                      </td>
                      <td>
                        <span className="badge category-badge">
                          {course.category}
                        </span>
                      </td>
                      <td>
                        <strong>{course.enrolledCount}</strong> learners
                      </td>
                      <td>
                        <span className="rating-pill">
                          <Star size={14} className="star-icon" />
                          <span>{course.rating}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Category Distribution Box */}
          <div className="admin-box category-dist-box">
            <div className="admin-box-header">
              <h3>Category Distribution</h3>
            </div>

            <div className="cat-bars-list">
              {stats?.categoryBreakdown?.map((cat, idx) => {
                const total = stats.totalCourses || 1;
                const percentage = Math.round((cat.count / total) * 100);
                return (
                  <div key={idx} className="cat-stat-row">
                    <div className="cat-stat-labels">
                      <span className="cat-stat-name">{cat.name}</span>
                      <span className="cat-stat-count">
                        {cat.count} courses ({percentage}%)
                      </span>
                    </div>
                    <div className="progress-outer-track">
                      <div
                        className="progress-inner-fill"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: cat.color || '#3b82f6',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Registered Users Table */}
        <div className="admin-box">
          <div className="admin-box-header">
            <h3>Platform User Accounts</h3>
            <span className="count-pill">{users.length} Total Users</span>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Member Since</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id || u._id}>
                    <td>
                      <div className="user-table-cell">
                        <img
                          src={
                            u.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`
                          }
                          alt={u.name}
                          className="user-avatar-sm"
                        />
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-tag role-${u.role}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


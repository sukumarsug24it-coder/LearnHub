import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentService } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  PlayCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Flame,
  Layers,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await enrollmentService.getMyEnrollments();
        if (res.data.success) {
          setEnrollments(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard enrollments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const totalEnrolled = enrollments.length;
  const completedCourses = enrollments.filter(
    (e) => e.isCompleted || e.progressPercentage >= 100
  ).length;
  const inProgressCourses = totalEnrolled - completedCourses;
  const totalCompletedLessons = enrollments.reduce(
    (acc, curr) => acc + (curr.completedLessons?.length || 0),
    0
  );

  const averageProgress =
    totalEnrolled > 0
      ? Math.round(
          enrollments.reduce((acc, curr) => acc + curr.progressPercentage, 0) /
            totalEnrolled
        )
      : 0;

  // Find most recently accessed course
  const recentCourse =
    enrollments.length > 0
      ? [...enrollments].sort(
          (a, b) => new Date(b.lastAccessedAt || 0) - new Date(a.lastAccessedAt || 0)
        )[0]
      : null;

  return (
    <div className="dashboard-page">
      {/* Student Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-badge">
            <Sparkles size={16} />
            <span>Welcome back, {user?.name || 'Learner'}!</span>
          </div>
          <h1>Track Your Learning Milestones</h1>
          <p>
            Consistency is the key to mastery. Continue your active tracks and build
            real-world engineering muscle.
          </p>
        </div>

        <div className="welcome-stats-pill">
          <Flame size={24} className="streak-icon" />
          <div>
            <strong>Active Learner</strong>
            <span>{totalCompletedLessons} lessons finished</span>
          </div>
        </div>
      </div>

      <div className="dashboard-container">
        {/* KPI Metrics Row */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-wrap icon-blue">
              <BookOpen size={24} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Enrolled Courses</span>
              <strong className="metric-value">{totalEnrolled}</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap icon-purple">
              <Layers size={24} />
            </div>
            <div className="metric-data">
              <span className="metric-label">In Progress</span>
              <strong className="metric-value">{inProgressCourses}</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap icon-green">
              <Award size={24} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Completed Courses</span>
              <strong className="metric-value">{completedCourses}</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap icon-amber">
              <TrendingUp size={24} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Avg. Progress</span>
              <strong className="metric-value">{averageProgress}%</strong>
            </div>
          </div>
        </div>

        {/* Continue Learning Spotlight Card */}
        {recentCourse && recentCourse.courseDetails && (
          <div className="spotlight-card">
            <div className="spotlight-header">
              <span className="spotlight-tag">Pick Up Where You Left Off</span>
            </div>
            <div className="spotlight-body">
              <img
                src={recentCourse.courseDetails.thumbnail}
                alt={recentCourse.courseDetails.title}
                className="spotlight-thumb"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="spotlight-info">
                <h3>{recentCourse.courseDetails.title}</h3>
                <p className="spotlight-meta">
                  Category: <strong>{recentCourse.courseDetails.category}</strong> • Level: <strong>{recentCourse.courseDetails.level}</strong>
                </p>

                <div className="spotlight-progress-wrap">
                  <div className="progress-labels">
                    <span>
                      {recentCourse.completedLessons?.length || 0} of{' '}
                      {recentCourse.courseDetails.lessons?.length || 0} lessons done
                    </span>
                    <strong>{recentCourse.progressPercentage}%</strong>
                  </div>
                  <ProgressBar
                    value={recentCourse.progressPercentage}
                    showLabel={false}
                    height={10}
                  />
                </div>

                <div className="spotlight-actions">
                  <Link
                    to={`/learning/${recentCourse.courseDetails.id || recentCourse.courseDetails._id}`}
                    className="btn btn-primary btn-md"
                  >
                    <PlayCircle size={18} />
                    <span>Resume Course</span>
                  </Link>
                  <Link
                    to={`/courses/${recentCourse.courseDetails.id || recentCourse.courseDetails._id}`}
                    className="btn btn-outline btn-md"
                  >
                    <span>View Syllabus</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enrolled Courses Grid */}
        <div className="dashboard-section">
          <div className="section-header-flex">
            <div>
              <h2>My Learning Tracks</h2>
              <p>All courses currently in your library</p>
            </div>
            <Link to="/courses" className="btn btn-outline btn-sm">
              <BookOpen size={16} />
              <span>Browse More Courses</span>
            </Link>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2].map((n) => (
                <div key={n} className="skeleton-card" />
              ))}
            </div>
          ) : enrollments.length > 0 ? (
            <div className="dashboard-courses-grid">
              {enrollments.map((enr) => {
                const c = enr.courseDetails;
                if (!c) return null;
                const cId = c.id || c._id;
                const isFinished = enr.isCompleted || enr.progressPercentage >= 100;

                return (
                  <div key={enr.id || enr._id} className="dash-course-card">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="dash-thumb"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="dash-card-body">
                      <div className="dash-card-top">
                        <span className="badge category-badge">{c.category}</span>
                        {isFinished ? (
                          <span className="badge completed-chip">Done</span>
                        ) : (
                          <span className="badge active-chip">{enr.progressPercentage}%</span>
                        )}
                      </div>

                      <h4 className="dash-course-title">
                        <Link to={`/learning/${cId}`}>{c.title}</Link>
                      </h4>

                      <div className="dash-progress-box">
                        <ProgressBar
                          value={enr.progressPercentage}
                          height={6}
                          showLabel={false}
                        />
                      </div>

                      <div className="dash-footer">
                        <span className="dash-lessons-count">
                          {enr.completedLessons?.length || 0}/{c.lessons?.length || 0} Lessons
                        </span>
                        <Link
                          to={`/learning/${cId}`}
                          className="btn btn-primary btn-xs"
                        >
                          Continue
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state-box">
              <BookOpen size={48} className="empty-icon" />
              <h3>Start Your First Course</h3>
              <p>Explore our catalogue to find courses that align with your career goals.</p>
              <Link to="/courses" className="btn btn-primary">
                Browse Course Catalogue
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;


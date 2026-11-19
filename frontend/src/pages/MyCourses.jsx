import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentService } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import {
  Layers,
  BookOpen,
  ArrowRight,
  CheckCircle,
  PlayCircle,
  Clock,
  Search,
} from 'lucide-react';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'in-progress', 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await enrollmentService.getMyEnrollments();
        if (res.data.success) {
          setEnrollments(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching enrollments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  const filteredEnrollments = enrollments.filter((enr) => {
    const course = enr.courseDetails;
    if (!course) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        course.title.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Tab filter
    if (filterTab === 'completed') return enr.isCompleted || enr.progressPercentage >= 100;
    if (filterTab === 'in-progress') return !enr.isCompleted && enr.progressPercentage < 100;
    return true;
  });

  return (
    <div className="my-courses-page">
      <div className="my-courses-header">
        <div className="my-courses-header-inner">
          <div className="section-tag">Student Center</div>
          <h1>My Enrolled Courses</h1>
          <p>
            Track your ongoing learning tracks, resume where you left off, and review completed subjects.
          </p>

          <div className="my-courses-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Filter your enrolled courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="my-courses-container">
        {/* Filter Tabs */}
        <div className="tabs-header-bar">
          <div className="tab-buttons">
            <button
              className={`tab-btn ${filterTab === 'all' ? 'active' : ''}`}
              onClick={() => setFilterTab('all')}
            >
              All Courses ({enrollments.length})
            </button>
            <button
              className={`tab-btn ${filterTab === 'in-progress' ? 'active' : ''}`}
              onClick={() => setFilterTab('in-progress')}
            >
              In Progress ({enrollments.filter((e) => !e.isCompleted && e.progressPercentage < 100).length})
            </button>
            <button
              className={`tab-btn ${filterTab === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterTab('completed')}
            >
              Completed ({enrollments.filter((e) => e.isCompleted || e.progressPercentage >= 100).length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="skeleton-card" />
            ))}
          </div>
        ) : filteredEnrollments.length > 0 ? (
          <div className="my-courses-grid">
            {filteredEnrollments.map((enr) => {
              const course = enr.courseDetails;
              const courseId = course.id || course._id;
              const totalLessons = course.lessons?.length || 0;
              const completedCount = enr.completedLessons?.length || 0;
              const isFinished = enr.isCompleted || enr.progressPercentage >= 100;

              return (
                <div key={enr.id || enr._id} className="enrolled-card">
                  <div className="enrolled-thumbnail-col">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <span className="badge category-badge-float">{course.category}</span>
                  </div>

                  <div className="enrolled-details-col">
                    <div className="enrolled-top-row">
                      <span className={`badge level-badge level-${course.level?.toLowerCase()}`}>
                        {course.level}
                      </span>
                      {isFinished ? (
                        <span className="badge completed-chip">
                          <CheckCircle size={14} /> Completed
                        </span>
                      ) : (
                        <span className="badge active-chip">In Progress</span>
                      )}
                    </div>

                    <h3 className="enrolled-title">
                      <Link to={`/learning/${courseId}`}>{course.title}</Link>
                    </h3>

                    <p className="enrolled-instructor">
                      Instructor: <strong>{course.instructor?.name}</strong>
                    </p>

                    <div className="enrolled-progress-box">
                      <div className="progress-numbers">
                        <span>
                          {completedCount} of {totalLessons} lessons completed
                        </span>
                        <strong>{enr.progressPercentage}%</strong>
                      </div>
                      <div className="progress-outer-track">
                        <div
                          className="progress-inner-fill"
                          style={{
                            width: `${enr.progressPercentage}%`,
                            backgroundColor: isFinished ? '#10b981' : '#4f46e5',
                          }}
                        />
                      </div>
                    </div>

                    <div className="enrolled-actions-row">
                      <Link
                        to={`/learning/${courseId}`}
                        className="btn btn-primary btn-sm"
                      >
                        <PlayCircle size={16} />
                        <span>{completedCount === 0 ? 'Start Course' : 'Continue Learning'}</span>
                      </Link>
                      <Link
                        to={`/courses/${courseId}`}
                        className="btn btn-outline btn-sm"
                      >
                        <span>Syllabus</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state-box">
            <Layers size={48} className="empty-icon" />
            <h3>No courses found</h3>
            <p>
              {searchQuery
                ? 'No enrolled courses match your search criteria.'
                : filterTab === 'completed'
                ? "You haven't completed any courses yet. Keep learning!"
                : 'You have not enrolled in any courses yet. Start your journey today!'}
            </p>
            <Link to="/courses" className="btn btn-primary">
              <BookOpen size={16} />
              <span>Explore Course Catalogue</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;


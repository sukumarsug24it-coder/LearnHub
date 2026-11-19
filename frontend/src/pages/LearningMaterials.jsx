import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService, enrollmentService } from '../services/api';
import {
  PlayCircle,
  CheckCircle,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  Award,
  Layers,
  ExternalLink,
  Code2,
  Check,
} from 'lucide-react';

const LearningMaterials = () => {
  const { id } = useParams(); // courseId
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes', 'resources', 'overview'
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const loadCourseAndEnrollment = async () => {
      setLoading(true);
      try {
        const [courseRes, statusRes] = await Promise.all([
          courseService.getById(id),
          enrollmentService.getStatus(id),
        ]);

        if (courseRes.data.success) {
          const c = courseRes.data.data;
          setCourse(c);

          if (statusRes.data.success && statusRes.data.isEnrolled) {
            setEnrollment(statusRes.data.data);

            // If user has a last accessed lesson, resume it
            if (statusRes.data.data.lastAccessedLesson && c.lessons) {
              const idx = c.lessons.findIndex(
                (l) => (l.id || l._id) === statusRes.data.data.lastAccessedLesson
              );
              if (idx !== -1) {
                setActiveLessonIndex(idx);
              }
            }
          } else {
            // Auto-enroll if accessing materials
            const autoEnr = await enrollmentService.enroll(id);
            if (autoEnr.data.success) {
              setEnrollment(autoEnr.data.data);
            }
          }
        }
      } catch (err) {
        console.error('Error loading classroom:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourseAndEnrollment();
  }, [id]);

  const activeLesson =
    course && course.lessons && course.lessons.length > 0
      ? course.lessons[activeLessonIndex]
      : null;

  const activeLessonId = activeLesson ? activeLesson.id || activeLesson._id : '';

  const isCompleted =
    enrollment &&
    enrollment.completedLessons &&
    enrollment.completedLessons.includes(activeLessonId);

  const handleToggleComplete = async () => {
    if (!activeLessonId) return;
    setUpdatingProgress(true);
    try {
      const res = await enrollmentService.toggleLesson(id, activeLessonId);
      if (res.data.success) {
        setEnrollment(res.data.data);
      }
    } catch (err) {
      console.error('Error toggling lesson progress:', err);
    } finally {
      setUpdatingProgress(false);
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(activeLessonIndex - 1);
    }
  };

  const handleNextLesson = () => {
    if (course && course.lessons && activeLessonIndex < course.lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Opening Learning Classroom...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="error-screen">
        <h2>Course not found</h2>
        <Link to="/courses" className="btn btn-primary">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const progressPercent = enrollment?.progressPercentage || 0;
  const completedCount = enrollment?.completedLessons?.length || 0;
  const totalLessons = course.lessons?.length || 0;

  return (
    <div className="classroom-page">
      {/* Top Classroom Bar */}
      <div className="classroom-top-bar">
        <div className="top-bar-left">
          <Link to="/my-courses" className="back-link">
            <ArrowLeft size={18} />
            <span>My Courses</span>
          </Link>
          <div className="top-bar-divider" />
          <h2 className="course-classroom-title">{course.title}</h2>
        </div>

        <div className="top-bar-right">
          <div className="classroom-progress-info">
            <span>
              {completedCount} / {totalLessons} Lessons Done
            </span>
            <div className="mini-progress-track">
              <div
                className="mini-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <strong>{progressPercent}%</strong>
          </div>

          <button
            className="btn btn-outline btn-xs toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Layers size={14} />
            <span>{sidebarOpen ? 'Hide Lessons' : 'Show Lessons'}</span>
          </button>
        </div>
      </div>

      {/* Classroom Content Layout */}
      <div className="classroom-body">
        {/* Main Stage (Player & Notes) */}
        <div className="classroom-stage">
          {activeLesson ? (
            <>
              {/* Media Player Container */}
              <div className="media-player-box">
                {activeLesson.videoUrl ? (
                  <div className="responsive-video-wrap">
                    <iframe
                      src={activeLesson.videoUrl}
                      title={activeLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="lesson-iframe"
                    />
                  </div>
                ) : (
                  <div className="no-video-placeholder">
                    <FileText size={48} className="placeholder-icon" />
                    <h3>Text-based Lecture & Interactive Lab</h3>
                    <p>Read the lecture notes, code snippets, and review materials below.</p>
                  </div>
                )}
              </div>

              {/* Lesson Action Header */}
              <div className="lesson-action-header">
                <div className="lesson-info-left">
                  <span className="lesson-order-chip">
                    Lesson {activeLessonIndex + 1} of {totalLessons}
                  </span>
                  <h1 className="active-lesson-heading">{activeLesson.title}</h1>
                  <span className="lesson-duration-tag">
                    Duration: {activeLesson.duration}
                  </span>
                </div>

                <div className="lesson-action-right">
                  <button
                    onClick={handleToggleComplete}
                    className={`btn ${
                      isCompleted ? 'btn-success-solid' : 'btn-primary'
                    }`}
                    disabled={updatingProgress}
                  >
                    {isCompleted ? (
                      <>
                        <Check size={18} />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        <span>Mark as Completed</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Lesson Stepper Controls */}
              <div className="lesson-stepper-row">
                <button
                  onClick={handlePrevLesson}
                  disabled={activeLessonIndex === 0}
                  className="btn btn-outline btn-sm stepper-btn"
                >
                  <ChevronLeft size={16} />
                  <span>Previous Lesson</span>
                </button>

                <button
                  onClick={handleNextLesson}
                  disabled={activeLessonIndex === totalLessons - 1}
                  className="btn btn-outline btn-sm stepper-btn"
                >
                  <span>Next Lesson</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Materials Tabs: Notes / Resources / Course Overview */}
              <div className="materials-tabs-wrapper">
                <div className="materials-tab-nav">
                  <button
                    className={`mat-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notes')}
                  >
                    <FileText size={16} />
                    <span>Lesson Notes & Code</span>
                  </button>
                  <button
                    className={`mat-tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
                    onClick={() => setActiveTab('resources')}
                  >
                    <Download size={16} />
                    <span>Resources ({activeLesson.resources?.length || 0})</span>
                  </button>
                  <button
                    className={`mat-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <BookOpen size={16} />
                    <span>Course Overview</span>
                  </button>
                </div>

                <div className="materials-tab-content">
                  {activeTab === 'notes' && (
                    <div className="notes-rendered-box">
                      <div className="markdown-prose">
                        {activeLesson.content ? (
                          <pre className="notes-raw-display">{activeLesson.content}</pre>
                        ) : (
                          <p className="empty-text">No additional text notes for this lesson.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'resources' && (
                    <div className="resources-list-box">
                      {activeLesson.resources && activeLesson.resources.length > 0 ? (
                        <div className="resources-grid">
                          {activeLesson.resources.map((res, i) => (
                            <a
                              key={i}
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="resource-card-link"
                            >
                              <div className="resource-icon">
                                {res.type === 'code' ? (
                                  <Code2 size={20} />
                                ) : (
                                  <Download size={20} />
                                )}
                              </div>
                              <div className="resource-info">
                                <strong>{res.title}</strong>
                                <span>External link / attachment</span>
                              </div>
                              <ExternalLink size={16} className="ext-icon" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="empty-state-box">
                          <FileText size={36} />
                          <p>No downloadable files or attachments for this lesson.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'overview' && (
                    <div className="overview-tab-box">
                      <h3>About {course.title}</h3>
                      <p>{course.description}</p>
                      {course.learningOutcomes?.length > 0 && (
                        <div className="overview-outcomes">
                          <h4>Key Outcomes:</h4>
                          <ul>
                            {course.learningOutcomes.map((item, idx) => (
                              <li key={idx}>✔ {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state-box">
              <BookOpen size={48} />
              <h3>No lessons available yet</h3>
              <p>The instructor has not added modules to this course yet.</p>
            </div>
          )}
        </div>

        {/* Right Sidebar Curriculum */}
        {sidebarOpen && (
          <aside className="classroom-sidebar">
            <div className="sidebar-header">
              <h3>Course Syllabus</h3>
              <span className="sidebar-lesson-count">
                {completedCount}/{totalLessons} completed
              </span>
            </div>

            <div className="sidebar-lessons-list">
              {course.lessons?.map((lesson, idx) => {
                const lId = lesson.id || lesson._id;
                const isLessonDone =
                  enrollment?.completedLessons &&
                  enrollment.completedLessons.includes(lId);
                const isActive = idx === activeLessonIndex;

                return (
                  <div
                    key={lId || idx}
                    className={`sidebar-lesson-item ${isActive ? 'active' : ''} ${
                      isLessonDone ? 'done' : ''
                    }`}
                    onClick={() => setActiveLessonIndex(idx)}
                  >
                    <div className="sidebar-item-checkbox">
                      {isLessonDone ? (
                        <CheckCircle size={18} className="text-success" />
                      ) : (
                        <div className="empty-circle" />
                      )}
                    </div>

                    <div className="sidebar-item-content">
                      <span className="sidebar-lesson-title">
                        {idx + 1}. {lesson.title}
                      </span>
                      <span className="sidebar-lesson-meta">
                        {lesson.duration} • {lesson.type}
                      </span>
                    </div>

                    {isActive && <div className="active-indicator" />}
                  </div>
                );
              })}
            </div>

            {progressPercent >= 100 && (
              <div className="course-completed-badge-card">
                <Award size={32} className="trophy-icon" />
                <h4>Course Completed!</h4>
                <p>You have finished 100% of the lessons in this track.</p>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
};

export default LearningMaterials;


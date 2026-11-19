import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseService, enrollmentService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  Star,
  Users,
  BookOpen,
  CheckCircle,
  PlayCircle,
  ArrowRight,
  ShieldCheck,
  FileText,
  AlertCircle,
  Lock,
} from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await courseService.getById(id);
        if (res.data.success) {
          setCourse(res.data.data);
        }

        if (isAuthenticated) {
          const statusRes = await enrollmentService.getStatus(id);
          if (statusRes.data.success && statusRes.data.isEnrolled) {
            setIsEnrolled(true);
            setEnrollment(statusRes.data.data);
          }
        }
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    setEnrolling(true);
    setFeedbackMsg('');
    try {
      const res = await enrollmentService.enroll(id);
      if (res.data.success) {
        setIsEnrolled(true);
        setEnrollment(res.data.data);
        setFeedbackMsg('🎉 Congratulations! You have successfully enrolled.');
        // Brief timeout then jump to learning page
        setTimeout(() => {
          navigate(`/learning/${id}`);
        }, 1200);
      }
    } catch (err) {
      setFeedbackMsg(err.response?.data?.message || 'Error during enrollment.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="error-screen">
        <h2>Course Not Found</h2>
        <p>The requested course could not be loaded or has been archived.</p>
        <Link to="/courses" className="btn btn-primary">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const courseId = course.id || course._id;
  const isFree = course.isFree || course.price === 0;

  return (
    <div className="course-details-page">
      {/* Top Breadcrumb & Hero */}
      <section className="course-hero-banner">
        <div className="course-hero-inner">
          <div className="hero-left-info">
            <div className="breadcrumb-nav">
              <Link to="/courses">Courses</Link>
              <span className="separator">/</span>
              <span>{course.category}</span>
              <span className="separator">/</span>
              <span className="active-crumb">{course.title}</span>
            </div>

            <div className="hero-badges-row">
              <span className="badge category-badge">{course.category}</span>
              <span className={`badge level-badge level-${course.level?.toLowerCase()}`}>
                {course.level}
              </span>
            </div>

            <h1 className="course-main-title">{course.title}</h1>
            <p className="course-lead-desc">{course.shortDescription}</p>

            <div className="hero-meta-items">
              <div className="meta-pill">
                <Star size={16} className="star-icon" />
                <strong>{course.rating}</strong>
                <span>({course.numReviews} ratings)</span>
              </div>
              <div className="meta-pill">
                <Users size={16} />
                <span>{course.enrolledCount} enrolled students</span>
              </div>
              <div className="meta-pill">
                <Clock size={16} />
                <span>{course.duration}</span>
              </div>
            </div>

            <div className="instructor-header-meta">
              <img
                src={course.instructor?.avatar}
                alt={course.instructor?.name}
                className="inst-avatar"
              />
              <div>
                <span className="inst-label">Created by</span>
                <strong className="inst-name">{course.instructor?.name}</strong>
              </div>
            </div>
          </div>

          {/* Sticky Enrollment Card on Desktop Right */}
          <div className="hero-card-col">
            <div className="enrollment-sticky-card">
              <div className="card-media-preview">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>

              <div className="card-enroll-body">
                <div className="price-display-row">
                  <span className="price-large">
                    {isFree ? 'Free Enrollment' : `$${course.price}`}
                  </span>
                  {isFree && <span className="free-badge">100% Free</span>}
                </div>

                {feedbackMsg && (
                  <div
                    className={`enroll-feedback ${
                      feedbackMsg.includes('error') ? 'alert-error' : 'alert-success'
                    }`}
                  >
                    {feedbackMsg}
                  </div>
                )}

                {isEnrolled ? (
                  <div className="enrolled-action-box">
                    <div className="enrolled-status-chip">
                      <ShieldCheck size={18} className="text-success" />
                      <span>You are enrolled in this course!</span>
                    </div>
                    <Link
                      to={`/learning/${courseId}`}
                      className="btn btn-primary btn-block btn-lg"
                    >
                      <span>Go to Learning Materials</span>
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="btn btn-primary btn-block btn-lg"
                    disabled={enrolling}
                  >
                    {enrolling ? (
                      <span className="btn-loading-flex">
                        <span className="spinner-sm"></span> Enrolling...
                      </span>
                    ) : (
                      <>
                        <span>Enroll Now (Free)</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                )}

                <div className="card-guarantees">
                  <div className="guarantee-row">
                    <PlayCircle size={16} />
                    <span>{course.lessons?.length || 0} on-demand video lessons</span>
                  </div>
                  <div className="guarantee-row">
                    <FileText size={16} />
                    <span>Downloadable learning resources & code</span>
                  </div>
                  <div className="guarantee-row">
                    <CheckCircle size={16} />
                    <span>Lesson completion tracking & certificate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="course-main-layout">
        <div className="course-details-content">
          {/* What You'll Learn */}
          {course.learningOutcomes?.length > 0 && (
            <div className="content-box outcomes-box">
              <h3>What you'll learn in this course</h3>
              <div className="outcomes-grid">
                {course.learningOutcomes.map((item, idx) => (
                  <div key={idx} className="outcome-item">
                    <CheckCircle size={18} className="outcome-check" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum / Lessons Breakdown */}
          <div className="content-box curriculum-box">
            <div className="curriculum-header">
              <div>
                <h3>Course Content & Lessons</h3>
                <p>
                  {course.lessons?.length || 0} lessons • {course.duration} total duration
                </p>
              </div>
            </div>

            <div className="lessons-accordion-list">
              {course.lessons?.map((lesson, idx) => (
                <div key={lesson.id || lesson._id || idx} className="lesson-item-row">
                  <div className="lesson-left">
                    <span className="lesson-index">{idx + 1}</span>
                    <PlayCircle size={18} className="lesson-type-icon" />
                    <span className="lesson-name">{lesson.title}</span>
                  </div>

                  <div className="lesson-right">
                    {lesson.isPreview ? (
                      <span className="preview-tag">Free Preview</span>
                    ) : isEnrolled ? (
                      <span className="unlocked-tag">Unlocked</span>
                    ) : (
                      <Lock size={15} className="lock-icon" />
                    )}
                    <span className="lesson-length">{lesson.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Course Description */}
          <div className="content-box">
            <h3>Course Description</h3>
            <div className="rich-description-text">
              <p>{course.description}</p>
            </div>
          </div>

          {/* Prerequisites */}
          {course.prerequisites?.length > 0 && (
            <div className="content-box">
              <h3>Prerequisites</h3>
              <ul className="bullet-list">
                {course.prerequisites.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructor Bio Box */}
          <div className="content-box instructor-profile-box">
            <h3>About the Instructor</h3>
            <div className="instructor-card-inner">
              <img
                src={course.instructor?.avatar}
                alt={course.instructor?.name}
                className="instructor-large-avatar"
              />
              <div className="instructor-bio-info">
                <h4>{course.instructor?.name}</h4>
                <p className="instructor-title-text">{course.instructor?.bio}</p>
                <p className="instructor-email-text">{course.instructor?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;


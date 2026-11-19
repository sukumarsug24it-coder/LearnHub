import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Users, BookOpen, ArrowRight } from 'lucide-react';

const CourseCard = ({ course, isEnrolled = false, enrollmentProgress = 0 }) => {
  const courseId = course.id || course._id;
  const isFree = course.isFree || course.price === 0;

  return (
    <div className="course-card">
      <div className="course-thumbnail-wrap">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="course-thumbnail"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="course-badges-overlay">
          <span className="badge category-badge">{course.category}</span>
          <span className={`badge level-badge level-${course.level?.toLowerCase()}`}>
            {course.level}
          </span>
        </div>
      </div>

      <div className="course-body">
        <h3 className="course-title" title={course.title}>
          <Link to={`/courses/${courseId}`}>{course.title}</Link>
        </h3>
        
        <p className="course-description">{course.shortDescription}</p>

        {isEnrolled && (
          <div className="card-progress-section">
            <div className="progress-labels">
              <span>Progress</span>
              <span className="progress-value">{enrollmentProgress}%</span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${enrollmentProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="course-meta-row">
          <div className="meta-item">
            <Clock size={15} />
            <span>{course.duration || '6 hours'}</span>
          </div>
          <div className="meta-item">
            <Star size={15} className="star-icon" />
            <span className="rating-value">{course.rating || '4.8'}</span>
            <span className="reviews-count">({course.numReviews || 50})</span>
          </div>
          <div className="meta-item">
            <BookOpen size={15} />
            <span>{course.lessons?.length || 0} Lessons</span>
          </div>
        </div>

        <div className="course-footer">
          <div className="instructor-mini">
            <img
              src={
                course.instructor?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
              }
              alt={course.instructor?.name || 'Instructor'}
              className="instructor-avatar-sm"
            />
            <span className="instructor-name">
              {course.instructor?.name || 'Instructor'}
            </span>
          </div>

          <div className="price-tag-wrap">
            <span className={`price-text ${isFree ? 'free' : ''}`}>
              {isFree ? 'FREE' : `$${course.price}`}
            </span>
          </div>
        </div>

        <div className="card-actions">
          {isEnrolled ? (
            <Link
              to={`/learning/${courseId}`}
              className="btn btn-primary btn-block"
            >
              <span>Continue Learning</span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <Link
              to={`/courses/${courseId}`}
              className="btn btn-secondary btn-block"
            >
              <span>View Details</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;


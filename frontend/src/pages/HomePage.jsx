import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseService, categoryService } from '../services/api';
import CourseCard from '../components/CourseCard';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle,
  GraduationCap,
  Users,
  Award,
  Layers,
  Code2,
  Terminal,
  Database,
  Cpu,
  Cloud,
  Search,
} from 'lucide-react';

const categoryIcons = {
  'web-development': Code2,
  programming: Terminal,
  database: Database,
  'ai-data-science': Cpu,
  'cloud-devops': Cloud,
};

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, catRes] = await Promise.all([
          courseService.getAll({ sort: 'popular' }),
          categoryService.getAll(),
        ]);
        if (courseRes.data.success) {
          setCourses(courseRes.data.data.slice(0, 6));
        }
        if (catRes.data.success) {
          setCategories(catRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  return (
    <div className="homepage-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-pill">
            <Sparkles size={16} className="sparkle-icon" />
            <span>Next-Generation Learning Resource Platform</span>
          </div>
          <h1 className="hero-title">
            Unlock Your Potential with{' '}
            <span className="text-gradient">LearnHub</span>
          </h1>
          <p className="hero-subtitle">
            Explore industry-crafted courses in Web Development, Programming,
            Database Engineering, and AI. Track your daily lessons, master
            hands-on code, and earn verified skill milestones.
          </p>

          {/* Quick Search in Hero */}
          <form className="hero-search-form" onSubmit={handleSearchSubmit}>
            <Search className="hero-search-icon" size={20} />
            <input
              type="text"
              placeholder="Search courses, skills, or technologies (e.g. React, Python, MongoDB)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hero-search-input"
            />
            <button type="submit" className="btn btn-primary hero-search-btn">
              Explore
            </button>
          </form>

          <div className="hero-action-buttons">
            <Link to="/courses" className="btn btn-primary btn-lg">
              <span>Browse All Courses</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              <span>Create Free Account</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="hero-highlights">
            <div className="highlight-item">
              <CheckCircle size={16} className="text-success" />
              <span>100% Free Course Access</span>
            </div>
            <div className="highlight-item">
              <CheckCircle size={16} className="text-success" />
              <span>Full CRUD Course Engine</span>
            </div>
            <div className="highlight-item">
              <CheckCircle size={16} className="text-success" />
              <span>Interactive Progress Tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Active Learners</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">40+</div>
            <div className="stat-label">Modular Lessons</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">4.9 / 5.0</div>
            <div className="stat-label">Student Satisfaction</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100%</div>
            <div className="stat-label">Self-Paced Flexibility</div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <div className="section-tag">Learning Tracks</div>
          <h2 className="section-title">Explore by Domain & Technology</h2>
          <p className="section-subtitle">
            Curated roadmaps designed to take you from fundamentals to enterprise engineering.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.slug] || BookOpen;
            return (
              <Link
                key={cat.id || cat._id}
                to={`/courses?category=${encodeURIComponent(cat.name)}`}
                className="category-card"
              >
                <div
                  className="cat-icon-wrap"
                  style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
                >
                  <Icon size={28} />
                </div>
                <h3 className="cat-name">{cat.name}</h3>
                <p className="cat-desc">{cat.description}</p>
                <div className="cat-link-text">
                  <span>View Courses</span>
                  <ArrowRight size={15} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="featured-courses-section">
        <div className="section-header-flex">
          <div>
            <div className="section-tag">Popular Right Now</div>
            <h2 className="section-title">Featured Learning Resources</h2>
          </div>
          <Link to="/courses" className="btn btn-outline btn-sm">
            <span>View All Catalogue</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="loading-grid">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard key={course.id || course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* How LearnHub Works */}
      <section className="how-it-works-section">
        <div className="section-header">
          <div className="section-tag">Simplified Journey</div>
          <h2 className="section-title">How LearnHub Works</h2>
          <p className="section-subtitle">
            A frictionless learning architecture built to help you study, practice, and track progress.
          </p>
        </div>

        <div className="workflow-steps-grid">
          <div className="workflow-step-card">
            <div className="step-badge">01</div>
            <h3>Create Account</h3>
            <p>
              Sign up in seconds as a student or explore with one-click demo credentials.
            </p>
          </div>
          <div className="workflow-step-card">
            <div className="step-badge">02</div>
            <h3>Browse Catalogue</h3>
            <p>
              Filter courses by topic, skill level, and category with real-time search.
            </p>
          </div>
          <div className="workflow-step-card">
            <div className="step-badge">03</div>
            <h3>Enroll & Learn</h3>
            <p>
              Access HD video lessons, curated markdown notes, code snippets, and resources.
            </p>
          </div>
          <div className="workflow-step-card">
            <div className="step-badge">04</div>
            <h3>Track Progress</h3>
            <p>
              Check off completed lessons, view real-time percentage bars, and complete courses.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-banner-section">
        <div className="cta-card">
          <h2>Ready to Supercharge Your Tech Skills?</h2>
          <p>
            Join thousands of developers advancing their careers with LearnHub. Free forever.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started for Free
            </Link>
            <Link to="/courses" className="btn btn-outline-white btn-lg">
              Browse Catalogue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;


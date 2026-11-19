import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Github, Code, Database, Server } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-brand-col">
          <Link to="/" className="brand-logo footer-logo">
            <div className="logo-icon-wrap">
              <GraduationCap className="logo-icon" />
            </div>
            <span className="brand-text">
              Learn<span className="text-gradient">Hub</span>
            </span>
          </Link>
          <p className="footer-bio">
            LearnHub is an end-to-end Learning Resource Management System
            empowering students to browse course catalogues, track lesson progress,
            and access structured learning materials in one intuitive platform.
          </p>
          <div className="tech-stack-badges">
            <span className="tech-badge"><Code size={12} /> React.js</span>
            <span className="tech-badge"><Server size={12} /> Node & Express</span>
            <span className="tech-badge"><Database size={12} /> MongoDB</span>
          </div>
        </div>

        <div className="footer-links-col">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/courses">Course Catalogue</Link></li>
            <li><Link to="/courses?category=Web+Development">Web Development</Link></li>
            <li><Link to="/courses?category=Programming">Programming</Link></li>
            <li><Link to="/courses?category=Database">Database Systems</Link></li>
            <li><Link to="/courses?category=AI+%26+Data+Science">AI & Machine Learning</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/dashboard">Student Dashboard</Link></li>
            <li><Link to="/my-courses">My Learning</Link></li>
            <li><Link to="/login">Account Login</Link></li>
            <li><Link to="/register">Create Account</Link></li>
            <li><Link to="/admin">Admin Panel</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Architecture & Features</h4>
          <ul className="footer-spec-list">
            <li>✔ Full RESTful API CRUD</li>
            <li>✔ JWT Authentication</li>
            <li>✔ Interactive Lesson Player</li>
            <li>✔ Real-time Progress Tracking</li>
            <li>✔ Category & Search Filtering</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>
            © {new Date().getFullYear()} LearnHub – Learning Resource Management System. All rights reserved.
          </p>
          <div className="system-status-indicator">
            <span className="status-dot"></span>
            <span className="status-text">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


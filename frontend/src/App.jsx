import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import CourseCatalogue from './pages/CourseCatalogue';
import CourseDetails from './pages/CourseDetails';
import MyCourses from './pages/MyCourses';
import LearningMaterials from './pages/LearningMaterials';
import AdminDashboard from './pages/AdminDashboard';
import ManageCourses from './pages/ManageCourses';

import './App.css';

// App Content with conditional footer for distraction-free learning
const AppContent = () => {
  const location = useLocation();
  const isLearningView = location.pathname.startsWith('/learning/');

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/courses" element={<CourseCatalogue />} />
          <Route path="/courses/:id" element={<CourseDetails />} />

          {/* Student Protected Pages */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-courses"
            element={
              <ProtectedRoute>
                <MyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning/:id"
            element={
              <ProtectedRoute>
                <LearningMaterials />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Pages */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute requireAdmin={true}>
                <ManageCourses />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {!isLearningView && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;


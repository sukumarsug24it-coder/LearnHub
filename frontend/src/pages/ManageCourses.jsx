import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService, categoryService } from '../services/api';
import Modal from '../components/Modal';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Layers,
  X,
  PlayCircle,
  FileText,
} from 'lucide-react';

const initialCourseForm = {
  title: '',
  shortDescription: '',
  description: '',
  category: 'Web Development',
  level: 'Beginner',
  duration: '8 hours',
  price: 0,
  isFree: true,
  thumbnail:
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
  status: 'published',
  tags: '',
  learningOutcomes: [''],
  prerequisites: [''],
  lessons: [
    {
      title: '1. Course Introduction & Foundations',
      duration: '15 mins',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/nu_pCVPKzTk',
      content: '### Welcome to this course!\n\nReview the core concepts and follow along with practical exercises.',
      isPreview: true,
    },
  ],
};

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [formData, setFormData] = useState(initialCourseForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchCoursesAndCategories = async () => {
    setLoading(true);
    try {
      const [coursesRes, catsRes] = await Promise.all([
        courseService.getAll({ status: undefined }), // all statuses
        categoryService.getAll(),
      ]);

      if (coursesRes.data.success) {
        setCourses(coursesRes.data.data);
      }
      if (catsRes.data.success) {
        setCategories(catsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndCategories();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrentCourseId(null);
    setFormData(initialCourseForm);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (course) => {
    setIsEditMode(true);
    setCurrentCourseId(course.id || course._id);
    setFormData({
      title: course.title || '',
      shortDescription: course.shortDescription || '',
      description: course.description || '',
      category: course.category || 'Web Development',
      level: course.level || 'Beginner',
      duration: course.duration || '8 hours',
      price: course.price || 0,
      isFree: course.isFree !== undefined ? course.isFree : true,
      thumbnail: course.thumbnail || '',
      status: course.status || 'published',
      tags: Array.isArray(course.tags) ? course.tags.join(', ') : '',
      learningOutcomes:
        course.learningOutcomes && course.learningOutcomes.length > 0
          ? course.learningOutcomes
          : [''],
      prerequisites:
        course.prerequisites && course.prerequisites.length > 0
          ? course.prerequisites
          : [''],
      lessons:
        course.lessons && course.lessons.length > 0
          ? course.lessons
          : [
              {
                title: '1. Introduction Lesson',
                duration: '15 mins',
                type: 'video',
                videoUrl: '',
                content: '',
                isPreview: true,
              },
            ],
    });
    setIsModalOpen(true);
  };

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Dynamic Outcomes Builder
  const handleOutcomeChange = (index, value) => {
    const updated = [...formData.learningOutcomes];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, learningOutcomes: updated }));
  };

  const addOutcome = () => {
    setFormData((prev) => ({
      ...prev,
      learningOutcomes: [...prev.learningOutcomes, ''],
    }));
  };

  const removeOutcome = (index) => {
    setFormData((prev) => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index),
    }));
  };

  // Dynamic Lessons Builder
  const handleLessonChange = (index, field, value) => {
    const updated = [...formData.lessons];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, lessons: updated }));
  };

  const addLesson = () => {
    setFormData((prev) => ({
      ...prev,
      lessons: [
        ...prev.lessons,
        {
          title: `${prev.lessons.length + 1}. New Lesson Topic`,
          duration: '20 mins',
          type: 'video',
          videoUrl: '',
          content: '### New Lesson Notes\n\nAdd step-by-step instructions here.',
          isPreview: false,
        },
      ],
    }));
  };

  const removeLesson = (index) => {
    setFormData((prev) => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== index),
    }));
  };

  // Submit Create or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        learningOutcomes: formData.learningOutcomes.filter((o) => o.trim() !== ''),
        prerequisites: formData.prerequisites.filter((p) => p.trim() !== ''),
        tags: typeof formData.tags === 'string'
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : formData.tags,
      };

      if (isEditMode) {
        // Update (CRUD: Update)
        const res = await courseService.update(currentCourseId, payload);
        if (res.data.success) {
          showToast(`✔ Course "${payload.title}" updated successfully!`);
          setIsModalOpen(false);
          await fetchCoursesAndCategories();
        }
      } else {
        // Create (CRUD: Create)
        const res = await courseService.create(payload);
        if (res.data.success) {
          showToast(`✔ Course "${payload.title}" created successfully!`);
          setIsModalOpen(false);
          await fetchCoursesAndCategories();
        }
      }
    } catch (err) {
      console.error('Error saving course:', err);
      alert(err.response?.data?.message || 'Error saving course.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Course (CRUD: Delete)
  const handleDeleteCourse = async (id, title) => {
    try {
      const res = await courseService.delete(id);
      if (res.data.success) {
        showToast(`🗑 Course "${title}" deleted.`);
        setDeleteConfirmId(null);
        await fetchCoursesAndCategories();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting course.');
    }
  };

  // Filter list
  const filteredCourses = courses.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedCategory !== 'All' && c.category !== selectedCategory) {
      return false;
    }
    if (selectedStatus !== 'All' && c.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  return (
    <div className="manage-courses-page">
      {/* Top Header */}
      <div className="manage-header-row">
        <div>
          <div className="section-tag">CRUD Operations Hub</div>
          <h1>Manage Courses & Curriculum</h1>
          <p>
            Create, update, inspect, and delete courses. Configure dynamic video
            lessons and learning notes.
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary btn-lg">
          <Plus size={20} />
          <span>Add New Course</span>
        </button>
      </div>

      {toast && (
        <div className="toast-notification">
          <CheckCircle size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="manage-toolbar">
        <div className="search-box-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search courses by title or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select-input"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id || cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="select-input"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Courses Management Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="loading-grid">
            <div className="skeleton-card" />
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="admin-table-responsive">
            <table className="admin-table manage-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Lessons</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((c) => {
                  const cId = c.id || c._id;
                  return (
                    <tr key={cId}>
                      <td className="course-title-cell">
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          className="manage-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="course-info-col">
                          <strong>{c.title}</strong>
                          <span className="inst-subtext">
                            By {c.instructor?.name || 'Instructor'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="badge category-badge">{c.category}</span>
                      </td>
                      <td>
                        <span className={`badge level-badge level-${c.level?.toLowerCase()}`}>
                          {c.level}
                        </span>
                      </td>
                      <td>
                        <strong>{c.lessons?.length || 0}</strong> modules
                      </td>
                      <td>
                        <strong>{c.enrolledCount || 0}</strong>
                      </td>
                      <td>
                        <span className={`status-pill status-${c.status || 'published'}`}>
                          {c.status || 'published'}
                        </span>
                      </td>
                      <td className="text-right actions-cell">
                        <Link
                          to={`/courses/${cId}`}
                          className="action-btn-circle view"
                          title="Preview Course"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="action-btn-circle edit"
                          title="Edit Course"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(cId)}
                          className="action-btn-circle delete"
                          title="Delete Course"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-box">
            <BookOpen size={48} className="empty-icon" />
            <h3>No courses match your criteria</h3>
            <p>Try clearing your search terms or create a new course.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          title="Confirm Course Deletion"
          maxWidth="460px"
        >
          <div className="delete-modal-content">
            <AlertCircle size={44} className="text-danger" />
            <h3>Are you absolutely sure?</h3>
            <p>
              This will permanently delete this course and remove its learning
              materials and curriculum from the database.
            </p>
            <div className="modal-actions-row">
              <button
                className="btn btn-outline"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  const courseToDelete = courses.find(
                    (c) => (c.id || c._id) === deleteConfirmId
                  );
                  handleDeleteCourse(
                    deleteConfirmId,
                    courseToDelete?.title || 'Course'
                  );
                }}
              >
                Delete Course
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Course Full Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Edit Course Details & Syllabus' : 'Create New Course'}
        maxWidth="840px"
      >
        <form onSubmit={handleSubmit} className="course-form-grid">
          {/* Section 1: Basic Information */}
          <div className="form-section-title">1. Course Core Metadata</div>

          <div className="form-group full-width">
            <label htmlFor="title">Course Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Master React & Next.js Architecture"
              required
            />
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id || cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="level">Skill Level</label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label htmlFor="duration">Estimated Duration</label>
              <input
                id="duration"
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 12 hours"
              />
            </div>

            <div className="form-group">
              <label htmlFor="thumbnail">Thumbnail Image URL</label>
              <input
                id="thumbnail"
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="shortDescription">Short Hook / Tagline *</label>
            <input
              id="shortDescription"
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              maxLength={220}
              placeholder="A punchy 1-2 sentence overview shown in catalogue cards"
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Full Course Description *</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a comprehensive breakdown of topics, real-world applications, and methodologies."
              required
            />
          </div>

          {/* Section 2: Learning Outcomes Builder */}
          <div className="form-section-title">
            2. Learning Outcomes ({formData.learningOutcomes.length})
          </div>
          <div className="dynamic-list-box full-width">
            {formData.learningOutcomes.map((outcome, idx) => (
              <div key={idx} className="dynamic-input-row">
                <input
                  type="text"
                  placeholder={`Learning outcome #${idx + 1}`}
                  value={outcome}
                  onChange={(e) => handleOutcomeChange(idx, e.target.value)}
                />
                {formData.learningOutcomes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOutcome(idx)}
                    className="btn btn-outline btn-xs"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOutcome}
              className="btn btn-ghost btn-xs add-sub-btn"
            >
              + Add Another Outcome
            </button>
          </div>

          {/* Section 3: Dynamic Lessons & Curriculum Builder */}
          <div className="form-section-title">
            3. Curriculum Lessons & Learning Materials ({formData.lessons.length})
          </div>

          <div className="dynamic-lessons-builder full-width">
            {formData.lessons.map((lesson, idx) => (
              <div key={idx} className="lesson-builder-card">
                <div className="lesson-builder-header">
                  <strong>Lesson {idx + 1}</strong>
                  {formData.lessons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLesson(idx)}
                      className="btn btn-ghost btn-xs text-danger"
                    >
                      <Trash2 size={14} /> Remove Lesson
                    </button>
                  )}
                </div>

                <div className="form-row two-col">
                  <div className="form-group">
                    <label>Lesson Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. 1. Introduction & Setup"
                      value={lesson.title}
                      onChange={(e) =>
                        handleLessonChange(idx, 'title', e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 15 mins"
                      value={lesson.duration}
                      onChange={(e) =>
                        handleLessonChange(idx, 'duration', e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Video Embed URL (YouTube embed or mp4 link)</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/embed/..."
                    value={lesson.videoUrl || ''}
                    onChange={(e) =>
                      handleLessonChange(idx, 'videoUrl', e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Lesson Notes, Code & Markdown Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="Provide lecture notes, code blocks, or reading instructions..."
                    value={lesson.content || ''}
                    onChange={(e) =>
                      handleLessonChange(idx, 'content', e.target.value)
                    }
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addLesson}
              className="btn btn-outline btn-block add-lesson-btn"
            >
              <Plus size={16} />
              <span>Add New Lesson Module</span>
            </button>
          </div>

          {/* Form Actions */}
          <div className="modal-actions-row full-width">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <span className="btn-loading-flex">
                  <span className="spinner-sm"></span> Saving Course...
                </span>
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Publish Course'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCourses;


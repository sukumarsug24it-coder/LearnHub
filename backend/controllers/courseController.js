const { dataStore } = require('../config/store');

// @desc    Get all courses with optional filtering and search
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const { search, category, level, status, sort } = req.query;
    const courses = await dataStore.getCourses({
      search,
      category,
      level,
      status: status || 'published',
      sort,
    });

    res.json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving courses.',
    });
  }
};

// @desc    Get single course by ID or slug
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await dataStore.getCourseById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching course details.',
    });
  }
};

// @desc    Create a new course (CRUD: Create)
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      description,
      category,
      level,
      price,
      isFree,
      duration,
      thumbnail,
      tags,
      learningOutcomes,
      prerequisites,
      lessons,
      status,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and category.',
      });
    }

    const course = await dataStore.createCourse({
      title,
      shortDescription: shortDescription || description.slice(0, 180),
      description,
      category,
      level: level || 'Beginner',
      price: price ? Number(price) : 0,
      isFree: isFree !== undefined ? isFree : true,
      duration: duration || '6 hours',
      thumbnail:
        thumbnail ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [],
      learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes : [],
      prerequisites: Array.isArray(prerequisites) ? prerequisites : [],
      lessons: Array.isArray(lessons) ? lessons : [],
      status: status || 'published',
      instructor: {
        name: req.user ? req.user.name : 'LearnHub Expert',
        email: req.user ? req.user.email : 'admin@learnhub.dev',
        avatar: req.user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      data: course,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating course.',
    });
  }
};

// @desc    Update course details (CRUD: Update)
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  try {
    const updated = await dataStore.updateCourse(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Course updated successfully.',
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating course.',
    });
  }
};

// @desc    Delete course (CRUD: Delete)
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    const deleted = await dataStore.deleteCourse(req.params.id);

    res.json({
      success: true,
      message: 'Course deleted successfully.',
      data: deleted,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Error deleting course.',
    });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await dataStore.getCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategories,
};


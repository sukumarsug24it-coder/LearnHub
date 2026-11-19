const { dataStore } = require('../config/store');

// @desc    Enroll logged in user into a course
// @route   POST /api/enrollments/:courseId
// @access  Private
const enrollInCourse = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { courseId } = req.params;

    const enrollment = await dataStore.enrollUser(userId, courseId);

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course!',
      data: enrollment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error enrolling in course.',
    });
  }
};

// @desc    Get all enrollments for current user
// @route   GET /api/enrollments/my
// @access  Private
const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const enrollments = await dataStore.getUserEnrollments(userId);

    res.json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching enrollments.',
    });
  }
};

// @desc    Get enrollment details for a specific course
// @route   GET /api/enrollments/status/:courseId
// @access  Private
const getEnrollmentStatus = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { courseId } = req.params;

    const enrollment = await dataStore.getEnrollment(userId, courseId);

    res.json({
      success: true,
      isEnrolled: !!enrollment,
      data: enrollment || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle lesson progress (mark complete / incomplete)
// @route   POST /api/enrollments/:courseId/lessons/:lessonId/toggle
// @access  Private
const toggleLessonProgress = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { courseId, lessonId } = req.params;

    const updated = await dataStore.toggleLessonProgress(
      userId,
      courseId,
      lessonId
    );

    res.json({
      success: true,
      message: 'Lesson progress updated.',
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating lesson progress.',
    });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentStatus,
  toggleLessonProgress,
};


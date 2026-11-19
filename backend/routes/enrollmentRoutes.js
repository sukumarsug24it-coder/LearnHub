const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentStatus,
  toggleLessonProgress,
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All enrollment routes require authentication

router.get('/my', getMyEnrollments);
router.post('/:courseId', enrollInCourse);
router.get('/status/:courseId', getEnrollmentStatus);
router.post('/:courseId/lessons/:lessonId/toggle', toggleLessonProgress);

module.exports = router;


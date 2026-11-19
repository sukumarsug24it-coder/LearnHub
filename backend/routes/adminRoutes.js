const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  resetData,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.post('/reset-data', resetData);

module.exports = router;


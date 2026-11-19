const { dataStore } = require('../config/store');
const {
  initialCategories,
  initialCourses,
  initialUsers,
  initialEnrollments,
} = require('../seed/seedData');

// @desc    Get Admin analytics and platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const stats = await dataStore.getPlatformStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching admin stats.',
    });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const safeUsers = dataStore.users.map((u) => {
      const { password, ...rest } = u;
      return rest;
    });

    res.json({
      success: true,
      count: safeUsers.length,
      data: safeUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reset and reseed demo data
// @route   POST /api/admin/reset-data
// @access  Private/Admin
const resetData = async (req, res) => {
  try {
    dataStore.courses = JSON.parse(JSON.stringify(initialCourses));
    dataStore.categories = JSON.parse(JSON.stringify(initialCategories));
    dataStore.enrollments = JSON.parse(JSON.stringify(initialEnrollments));
    await dataStore.initDefaultUsers();

    res.json({
      success: true,
      message: 'Demo dataset reset successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  resetData,
};


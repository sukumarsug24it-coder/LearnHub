const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/courseController');

router.get('/', getCategories);

module.exports = router;


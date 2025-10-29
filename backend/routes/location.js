const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Location services routes (public)
router.get('/search', uploadController.searchLocation);
router.get('/reverse', uploadController.reverseGeocode);
router.get('/current', uploadController.getCurrentLocation);

module.exports = router;

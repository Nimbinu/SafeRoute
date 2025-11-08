const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// Hazard photo upload routes (require authentication)
router.post('/hazard-photo', authMiddleware, upload.hazard.single('photo'), uploadController.uploadHazardPhoto);
router.delete('/hazard-photo/:filename', authMiddleware, uploadController.deleteHazardPhoto);

// Profile photo upload routes (require authentication)
router.post('/profile-photo', authMiddleware, upload.profile.single('avatar'), uploadController.uploadProfilePhoto);
router.delete('/profile-photo', authMiddleware, uploadController.deleteProfilePhoto);

// Validation route
router.post('/validate-hazard', authMiddleware, uploadController.validateHazardReport);

module.exports = router;

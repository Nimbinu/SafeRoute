const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// Photo upload routes (require authentication)
router.post('/hazard-photo', authMiddleware, upload.single('photo'), uploadController.uploadHazardPhoto);
router.delete('/hazard-photo/:filename', authMiddleware, uploadController.deleteHazardPhoto);

// Validation route
router.post('/validate-hazard', authMiddleware, uploadController.validateHazardReport);

module.exports = router;

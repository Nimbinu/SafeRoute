const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const hazardController = require('../controllers/hazardController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Validation rules
const createHazardValidation = [
  body('hazardType')
    .notEmpty().withMessage('Hazard type is required')
    .isIn(['Pothole', 'Debris', 'Flooding', 'Ice', 'Accident', 'Road Closure', 'Construction', 'Broken Traffic Light', 'Other'])
    .withMessage('Invalid hazard type'),
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 }).withMessage('Coordinates must be [longitude, latitude]'),
  body('location.address')
    .notEmpty().withMessage('Address is required')
];

const updateStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Pending', 'Verified', 'Resolved']).withMessage('Invalid status')
];

// Public routes
router.get('/', hazardController.getAllHazards);
router.get('/nearby', hazardController.getNearbyHazards);
router.get('/:id', hazardController.getHazardById);

// Protected routes (require authentication)
router.post('/', authMiddleware, createHazardValidation, hazardController.createHazard);
router.get('/user/my-reports', authMiddleware, hazardController.getMyReports);
router.delete('/:id', authMiddleware, hazardController.deleteHazard);

// Admin/Moderator routes
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin', 'moderator']), updateStatusValidation, hazardController.updateHazardStatus);
router.get('/admin/stats', authMiddleware, roleMiddleware(['admin', 'moderator']), hazardController.getHazardStats);

module.exports = router;

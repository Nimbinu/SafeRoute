const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const routeController = require('../controllers/routeController');
const authMiddleware = require('../middleware/auth');

// Validation rules
const calculateRouteValidation = [
  body('origin.address')
    .notEmpty().withMessage('Origin address is required'),
  body('origin.coordinates')
    .isArray({ min: 2, max: 2 }).withMessage('Origin coordinates must be [longitude, latitude]'),
  body('destination.address')
    .notEmpty().withMessage('Destination address is required'),
  body('destination.coordinates')
    .isArray({ min: 2, max: 2 }).withMessage('Destination coordinates must be [longitude, latitude]')
];

const selectRouteValidation = [
  body('routeType')
    .notEmpty().withMessage('Route type is required')
    .isIn(['fastest', 'shortest', 'safest']).withMessage('Invalid route type')
];

// All routes require authentication
router.use(authMiddleware);

// Route calculation
router.post('/calculate', calculateRouteValidation, routeController.calculateRoute);

// Route history
router.get('/history', routeController.getRouteHistory);
router.get('/stats', routeController.getRouteStats);

// Single route operations
router.get('/:id', routeController.getRouteById);
router.delete('/:id', routeController.deleteRoute);
router.patch('/:id/select', selectRouteValidation, routeController.selectRoute);

module.exports = router;

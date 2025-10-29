const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Validation rules
const updateProfileValidation = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

const updateRoleValidation = [
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['user', 'admin', 'moderator']).withMessage('Invalid role')
];

// Protected routes (require authentication)
router.use(authMiddleware);

// User profile routes
router.get('/profile', userController.getUserProfile);
router.put('/profile', updateProfileValidation, userController.updateUserProfile);
router.delete('/profile', userController.deleteUserAccount);

// User hazards and activity
router.get('/my-hazards', userController.getUserHazards);
router.get('/activity', userController.getUserActivity);

// User preferences
router.patch('/preferences', userController.updateUserPreferences);

// Admin routes
router.get('/', roleMiddleware(['admin']), userController.getAllUsers);
router.get('/:id', roleMiddleware(['admin', 'moderator']), userController.getUserById);
router.patch('/:id/role', roleMiddleware(['admin']), updateRoleValidation, userController.updateUserRole);
router.patch('/:id/status', roleMiddleware(['admin']), userController.toggleUserStatus);

module.exports = router;

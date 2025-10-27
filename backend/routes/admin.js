const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Validation rules
const changeRoleValidation = [
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['user', 'admin', 'moderator']).withMessage('Invalid role')
];

// All routes require authentication and admin/moderator role
router.use(authMiddleware);

// Dashboard statistics (admin and moderator)
router.get('/stats', roleMiddleware(['admin', 'moderator']), adminController.getDashboardStats);

// Hazard management (admin and moderator)
router.get('/hazards', roleMiddleware(['admin', 'moderator']), adminController.getAllHazardReports);
router.patch('/hazards/:id/verify', roleMiddleware(['admin', 'moderator']), adminController.verifyHazard);
router.patch('/hazards/:id/resolve', roleMiddleware(['admin', 'moderator']), adminController.resolveHazard);
router.delete('/hazards/:id', roleMiddleware(['admin', 'moderator']), adminController.deleteHazardReport);

// User management (admin only)
router.get('/users', roleMiddleware(['admin']), adminController.getAllUsers);
router.patch('/users/:id/ban', roleMiddleware(['admin']), adminController.toggleUserBan);
router.patch('/users/:id/role', roleMiddleware(['admin']), changeRoleValidation, adminController.changeUserRole);

// System activity and analytics (admin and moderator)
router.get('/activity', roleMiddleware(['admin', 'moderator']), adminController.getSystemActivity);
router.get('/analytics', roleMiddleware(['admin', 'moderator']), adminController.getAnalytics);

module.exports = router;

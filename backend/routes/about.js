const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const aboutController = require('../controllers/aboutController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Validation rules
const contentValidation = [
  body('section')
    .notEmpty().withMessage('Section is required')
    .isIn(['mission', 'features', 'team', 'contact', 'faq', 'testimonials', 'privacy', 'terms'])
    .withMessage('Invalid section'),
  body('title')
    .notEmpty().withMessage('Title is required')
    .trim()
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('content')
    .notEmpty().withMessage('Content is required')
];

const teamMemberValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('role')
    .notEmpty().withMessage('Role is required')
    .trim(),
  body('bio')
    .notEmpty().withMessage('Bio is required')
    .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters')
];

const faqValidation = [
  body('question')
    .notEmpty().withMessage('Question is required')
    .trim(),
  body('answer')
    .notEmpty().withMessage('Answer is required')
    .trim()
];

// ========== PUBLIC ROUTES ==========

// About content routes
router.get('/content', aboutController.getAllContent);
router.get('/content/:section', aboutController.getContentBySection);

// Team member routes
router.get('/team', aboutController.getAllTeamMembers);
router.get('/team/:id', aboutController.getTeamMemberById);

// FAQ routes
router.get('/faq', aboutController.getAllFAQs);
router.get('/faq/categories/list', aboutController.getFAQCategories);
router.get('/faq/:id', aboutController.getFAQById);
router.patch('/faq/:id/feedback', aboutController.faqFeedback);

// ========== ADMIN ROUTES ==========

// About content management (Admin only)
router.post('/content', authMiddleware, roleMiddleware(['admin']), contentValidation, aboutController.createOrUpdateContent);
router.delete('/content/:section', authMiddleware, roleMiddleware(['admin']), aboutController.deleteContent);

// Team member management (Admin only)
router.post('/team', authMiddleware, roleMiddleware(['admin']), teamMemberValidation, aboutController.addTeamMember);
router.put('/team/:id', authMiddleware, roleMiddleware(['admin']), aboutController.updateTeamMember);
router.delete('/team/:id', authMiddleware, roleMiddleware(['admin']), aboutController.deleteTeamMember);

// FAQ management (Admin only)
router.post('/faq', authMiddleware, roleMiddleware(['admin']), faqValidation, aboutController.addFAQ);
router.put('/faq/:id', authMiddleware, roleMiddleware(['admin']), aboutController.updateFAQ);
router.delete('/faq/:id', authMiddleware, roleMiddleware(['admin']), aboutController.deleteFAQ);

module.exports = router;

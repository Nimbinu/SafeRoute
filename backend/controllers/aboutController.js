const { validationResult } = require('express-validator');
const AboutContent = require('../models/AboutContent');
const TeamMember = require('../models/TeamMember');
const FAQ = require('../models/FAQ');

// ========== ABOUT CONTENT MANAGEMENT ==========

// @desc    Get all about page content
// @route   GET /api/about/content
// @access  Public
exports.getAllContent = async (req, res) => {
  try {
    const content = await AboutContent.find({ isActive: true })
      .sort('order')
      .select('-__v');

    res.status(200).json({
      success: true,
      data: { content }
    });
  } catch (error) {
    console.error('Get all content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content',
      error: error.message
    });
  }
};

// @desc    Get content by section
// @route   GET /api/about/content/:section
// @access  Public
exports.getContentBySection = async (req, res) => {
  try {
    const content = await AboutContent.findOne({
      section: req.params.section,
      isActive: true
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content section not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { content }
    });
  } catch (error) {
    console.error('Get content by section error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content',
      error: error.message
    });
  }
};

// @desc    Create or update about content
// @route   POST /api/about/content
// @access  Private (Admin)
exports.createOrUpdateContent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { section, title, content, order, metadata } = req.body;

    // Check if section already exists
    let aboutContent = await AboutContent.findOne({ section });

    if (aboutContent) {
      // Update existing content
      aboutContent.title = title;
      aboutContent.content = content;
      aboutContent.order = order !== undefined ? order : aboutContent.order;
      aboutContent.metadata = metadata || aboutContent.metadata;
      aboutContent.lastUpdatedBy = req.user.id;
      
      await aboutContent.save();
    } else {
      // Create new content
      aboutContent = await AboutContent.create({
        section,
        title,
        content,
        order,
        metadata,
        lastUpdatedBy: req.user.id
      });
    }

    res.status(200).json({
      success: true,
      message: `Content ${aboutContent ? 'updated' : 'created'} successfully`,
      data: { content: aboutContent }
    });
  } catch (error) {
    console.error('Create/Update content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving content',
      error: error.message
    });
  }
};

// @desc    Delete about content
// @route   DELETE /api/about/content/:section
// @access  Private (Admin)
exports.deleteContent = async (req, res) => {
  try {
    const content = await AboutContent.findOne({ section: req.params.section });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    content.isActive = false;
    await content.save();

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting content',
      error: error.message
    });
  }
};

// ========== TEAM MEMBER MANAGEMENT ==========

// @desc    Get all team members
// @route   GET /api/about/team
// @access  Public
exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ isActive: true })
      .sort('order')
      .select('-__v');

    res.status(200).json({
      success: true,
      data: { teamMembers }
    });
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team members',
      error: error.message
    });
  }
};

// @desc    Get single team member
// @route   GET /api/about/team/:id
// @access  Public
exports.getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember || !teamMember.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { teamMember }
    });
  } catch (error) {
    console.error('Get team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team member',
      error: error.message
    });
  }
};

// @desc    Add team member
// @route   POST /api/about/team
// @access  Private (Admin)
exports.addTeamMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, role, bio, avatar, email, socialLinks, order } = req.body;

    const teamMember = await TeamMember.create({
      name,
      role,
      bio,
      avatar,
      email,
      socialLinks,
      order,
      addedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Team member added successfully',
      data: { teamMember }
    });
  } catch (error) {
    console.error('Add team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding team member',
      error: error.message
    });
  }
};

// @desc    Update team member
// @route   PUT /api/about/team/:id
// @access  Private (Admin)
exports.updateTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    const { name, role, bio, avatar, email, socialLinks, order } = req.body;

    if (name) teamMember.name = name;
    if (role) teamMember.role = role;
    if (bio) teamMember.bio = bio;
    if (avatar !== undefined) teamMember.avatar = avatar;
    if (email !== undefined) teamMember.email = email;
    if (socialLinks) teamMember.socialLinks = socialLinks;
    if (order !== undefined) teamMember.order = order;

    await teamMember.save();

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: { teamMember }
    });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating team member',
      error: error.message
    });
  }
};

// @desc    Delete team member
// @route   DELETE /api/about/team/:id
// @access  Private (Admin)
exports.deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    teamMember.isActive = false;
    await teamMember.save();

    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting team member',
      error: error.message
    });
  }
};

// ========== FAQ MANAGEMENT ==========

// @desc    Get all FAQs
// @route   GET /api/about/faq
// @access  Public
exports.getAllFAQs = async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    const faqs = await FAQ.find(query)
      .sort('order')
      .select('-__v');

    res.status(200).json({
      success: true,
      data: { faqs }
    });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching FAQs',
      error: error.message
    });
  }
};

// @desc    Get single FAQ
// @route   GET /api/about/faq/:id
// @access  Public
exports.getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq || !faq.isActive) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    // Increment view count
    faq.views += 1;
    await faq.save();

    res.status(200).json({
      success: true,
      data: { faq }
    });
  } catch (error) {
    console.error('Get FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching FAQ',
      error: error.message
    });
  }
};

// @desc    Add FAQ
// @route   POST /api/about/faq
// @access  Private (Admin)
exports.addFAQ = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { question, answer, category, order } = req.body;

    const faq = await FAQ.create({
      question,
      answer,
      category,
      order,
      addedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'FAQ added successfully',
      data: { faq }
    });
  } catch (error) {
    console.error('Add FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding FAQ',
      error: error.message
    });
  }
};

// @desc    Update FAQ
// @route   PUT /api/about/faq/:id
// @access  Private (Admin)
exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    const { question, answer, category, order } = req.body;

    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (category) faq.category = category;
    if (order !== undefined) faq.order = order;

    await faq.save();

    res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      data: { faq }
    });
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating FAQ',
      error: error.message
    });
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/about/faq/:id
// @access  Private (Admin)
exports.deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    faq.isActive = false;
    await faq.save();

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting FAQ',
      error: error.message
    });
  }
};

// @desc    Mark FAQ as helpful/not helpful
// @route   PATCH /api/about/faq/:id/feedback
// @access  Public
exports.faqFeedback = async (req, res) => {
  try {
    const { helpful } = req.body;
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    if (helpful === true) {
      faq.helpful += 1;
    } else if (helpful === false) {
      faq.notHelpful += 1;
    }

    await faq.save();

    res.status(200).json({
      success: true,
      message: 'Feedback recorded successfully'
    });
  } catch (error) {
    console.error('FAQ feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording feedback',
      error: error.message
    });
  }
};

// @desc    Get FAQ categories
// @route   GET /api/about/faq/categories
// @access  Public
exports.getFAQCategories = async (req, res) => {
  try {
    const categories = await FAQ.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get FAQ categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching FAQ categories',
      error: error.message
    });
  }
};

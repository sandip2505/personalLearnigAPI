const express = require('express');
const PageController = require('../controller/pageController');

const router = express.Router();

// Validation middleware for page and section names
const validateParams = (req, res, next) => {
  const { pageName, sectionName } = req.params;
  
  // Basic validation for page name
  if (pageName && !/^[a-zA-Z0-9_-]+$/.test(pageName)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid page name. Only letters, numbers, underscores, and hyphens are allowed.'
    });
  }
  
  // Basic validation for section name
  if (sectionName && !/^[a-zA-Z0-9_-]+$/.test(sectionName)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid section name. Only letters, numbers, underscores, and hyphens are allowed.'
    });
  }
  
  next();
};

// Validation middleware for request body
const validateSectionBody = (req, res, next) => {
  const { sectionTitle, fields } = req.body;
  
  if (!sectionTitle || typeof sectionTitle !== 'string' || sectionTitle.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Section title is required and must be a non-empty string.'
    });
  }
  
  // Validate fields if provided
  if (fields) {
    if (Array.isArray(fields)) {
      // Validate array format
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        if (!field.fieldName || !field.fieldType) {
          return res.status(400).json({
            success: false,
            message: `Field at index ${i} must have fieldName and fieldType properties.`
          });
        }
        
        const validTypes = ['text', 'textarea', 'image', 'url', 'number', 'boolean', 'rich_text'];
        if (!validTypes.includes(field.fieldType)) {
          return res.status(400).json({
            success: false,
            message: `Invalid field type '${field.fieldType}'. Valid types: ${validTypes.join(', ')}`
          });
        }
      }
    } else if (typeof fields === 'object') {
      // Validate object format
      for (const [fieldName, fieldData] of Object.entries(fields)) {
        if (!fieldData || typeof fieldData !== 'object') {
          return res.status(400).json({
            success: false,
            message: `Field '${fieldName}' must be an object with type and value properties.`
          });
        }
        
        const validTypes = ['text', 'textarea', 'image', 'url', 'number', 'boolean', 'rich_text'];
        if (fieldData.type && !validTypes.includes(fieldData.type)) {
          return res.status(400).json({
            success: false,
            message: `Invalid field type '${fieldData.type}' for field '${fieldName}'. Valid types: ${validTypes.join(', ')}`
          });
        }
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Fields must be an array or object.'
      });
    }
  }
  
  next();
};

// Error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error('Route error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(error.errors).map(err => err.message)
    });
  }
  
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Resource already exists'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};

// Routes

// GET /api/pages - Get all pages (admin route)
router.get('/pages', PageController.getAllPages);

// GET /api/:pageName/:sectionName - Get specific section
router.get('/:pageName/:sectionName', 
  validateParams, 
  PageController.getPageSection
);

// GET /api/:pageName - Get all sections of a page
router.get('/:pageName', 
  validateParams, 
  PageController.getPageWithSections
);

// POST /api/:pageName - Create new page
router.post('/:pageName', 
  validateParams,
  (req, res, next) => {
    const { pageTitle } = req.body;
    if (!pageTitle || typeof pageTitle !== 'string' || pageTitle.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Page title is required and must be a non-empty string.'
      });
    }
    next();
  },
  PageController.createPage
);

// POST /api/:pageName/:sectionName - Create or update section
router.post('/:pageName/:sectionName', 
  validateParams,
  validateSectionBody,
  PageController.createOrUpdateSection
);

// PUT /api/:pageName/:sectionName - Update section (alias for POST)
router.put('/:pageName/:sectionName', 
  validateParams,
  validateSectionBody,
  PageController.createOrUpdateSection
);

// DELETE /api/:pageName/:sectionName - Delete section
router.delete('/:pageName/:sectionName', 
  validateParams,
  PageController.deleteSection
);

// Handle 404 for unmatched routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableRoutes: [
      'GET /api/pages',
      'GET /api/:pageName',
      'GET /api/:pageName/:sectionName',
      'POST /api/:pageName',
      'POST /api/:pageName/:sectionName',
      'PUT /api/:pageName/:sectionName',
      'DELETE /api/:pageName/:sectionName'
    ]
  });
});

// Apply error handler
router.use(errorHandler);

module.exports = router;
const Page = require('../model/Page');

class PageController {
  // GET /api/:pageName/:sectionName - Get specific section
  static async getPageSection(req, res) {
    try {
      const { pageName, sectionName } = req.params;
      
      const result = await Page.findSectionByPageAndSection(pageName, sectionName);
      
      if (!result || result.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Section '${sectionName}' not found in page '${pageName}'`
        });
      }

      const data = result[0];
      const responseData = {
        pageName: data.pageName,
        pageTitle: data.pageTitle,
        sectionName: data.section.sectionName,
        sectionTitle: data.section.sectionTitle,
        fields: {},
        metadata: {
          order: data.section.order,
          lastUpdated: data.section.updatedAt
        }
      };

      // Convert fields array to object for easier frontend consumption
      data.section.fields.forEach(field => {
        responseData.fields[field.fieldName] = {
          value: field.fieldValue,
          type: field.fieldType,
          required: field.isRequired
        };
      });

      res.status(200).json({
        success: true,
        data: responseData
      });

    } catch (error) {
      console.error('Error fetching page section:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/:pageName - Get all sections of a page
  static async getPageWithSections(req, res) {
    try {
      const { pageName } = req.params;
      
      const page = await Page.findByPageName(pageName);
      
      if (!page) {
        return res.status(404).json({
          success: false,
          message: `Page '${pageName}' not found`
        });
      }

      const responseData = {
        pageName: page.pageName,
        pageTitle: page.pageTitle,
        metadata: page.metadata,
        sections: page.sections
          .filter(section => section.isActive)
          .sort((a, b) => a.order - b.order)
          .map(section => {
            const sectionData = {
              sectionName: section.sectionName,
              sectionTitle: section.sectionTitle,
              fields: {},
              metadata: {
                order: section.order,
                lastUpdated: section.updatedAt
              }
            };

            // Convert fields array to object
            section.fields.forEach(field => {
              sectionData.fields[field.fieldName] = {
                value: field.fieldValue,
                type: field.fieldType,
                required: field.isRequired
              };
            });

            return sectionData;
          })
      };

      res.status(200).json({
        success: true,
        data: responseData
      });

    } catch (error) {
      console.error('Error fetching page:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // POST /api/:pageName - Create new page
  static async createPage(req, res) {
    try {
      const { pageName } = req.params;
      const { pageTitle, sections = [], metadata = {} } = req.body;

      // Check if page already exists
      const existingPage = await Page.findByPageName(pageName);
      if (existingPage) {
        return res.status(409).json({
          success: false,
          message: `Page '${pageName}' already exists`
        });
      }

      const page = new Page({
        pageName: pageName.toLowerCase(),
        pageTitle,
        sections,
        metadata
      });

      await page.save();

      res.status(201).json({
        success: true,
        message: 'Page created successfully',
        data: {
          pageName: page.pageName,
          pageTitle: page.pageTitle,
          sectionsCount: page.sections.length
        }
      });

    } catch (error) {
      console.error('Error creating page:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // POST /api/:pageName/:sectionName - Create/Update section
  static async createOrUpdateSection(req, res) {
    try {
      const { pageName, sectionName } = req.params;
      const { sectionTitle, fields = [], order = 0 } = req.body;

      let page = await Page.findByPageName(pageName);
      
      if (!page) {
        return res.status(404).json({
          success: false,
          message: `Page '${pageName}' not found`
        });
      }

      // Convert fields object to array format if needed
      let fieldsArray = fields;
      if (typeof fields === 'object' && !Array.isArray(fields)) {
        fieldsArray = Object.entries(fields).map(([fieldName, fieldData]) => ({
          fieldName,
          fieldType: fieldData.type || 'text',
          fieldValue: fieldData.value,
          isRequired: fieldData.required || false
        }));
      }

      const existingSection = page.getSection(sectionName);
      
      if (existingSection) {
        // Update existing section
        existingSection.sectionTitle = sectionTitle;
        existingSection.fields = fieldsArray;
        existingSection.order = order;
      } else {
        // Create new section
        page.sections.push({
          sectionName: sectionName.toLowerCase(),
          sectionTitle,
          fields: fieldsArray,
          order
        });
      }

      await page.save();

      res.status(200).json({
        success: true,
        message: existingSection ? 'Section updated successfully' : 'Section created successfully',
        data: {
          pageName: page.pageName,
          sectionName: sectionName.toLowerCase(),
          fieldsCount: fieldsArray.length
        }
      });

    } catch (error) {
      console.error('Error creating/updating section:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // DELETE /api/:pageName/:sectionName - Delete section
  static async deleteSection(req, res) {
    try {
      const { pageName, sectionName } = req.params;

      const page = await Page.findByPageName(pageName);
      
      if (!page) {
        return res.status(404).json({
          success: false,
          message: `Page '${pageName}' not found`
        });
      }

      const section = page.getSection(sectionName);
      if (!section) {
        return res.status(404).json({
          success: false,
          message: `Section '${sectionName}' not found`
        });
      }

      await page.deleteSection(sectionName);

      res.status(200).json({
        success: true,
        message: 'Section deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting section:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/pages - Get all pages (admin route)
  static async getAllPages(req, res) {
    try {
      const pages = await Page.find({ isActive: true })
        .select('pageName pageTitle metadata createdAt updatedAt')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: pages,
        count: pages.length
      });

    } catch (error) {
      console.error('Error fetching all pages:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = PageController;
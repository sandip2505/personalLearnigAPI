const Page = require('../model/Page');

const PageController = {};

PageController.getPages = async (req, res) => {
  try {
    const pages = await Page.find();
    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

PageController.createPage = async (req, res) => {
  try {
    const { name, slug, metadata } = req.body;
    // Validate required fields
    if (!name) {
      return res.status(400).json({ success: false, message: 'Page name is required' });
    }
    // Convert keywords string to array if it's a string
    if (metadata && typeof metadata.keywords === 'string') {
      metadata.keywords = metadata.keywords.split(',').map(k => k.trim());
    }
    console.log(name, slug, metadata, 'Request body for creating page');
    await Page.create({ name, slug, metadata })
    res.status(201).json({ success: true, data: newPage });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Page with this name already exists' });
    }
    console.error('Error creating page:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
PageController.editPage = async (req, res) => {
  try {
    const id = req.params.id;
    const editPage = await Page.findById(id);
    if (!editPage) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    res.status(200).json({ success: true, data: editPage });
  } catch (error) {
    console.error('Error editing page:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
PageController.updatePage = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, slug, metaData } = req.body;
    const updatedPage = await Page.findByIdAndUpdate(id, { name, slug, metaData }, { new: true });
    if (!updatedPage) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    res.status(200).json({ success: true, data: updatedPage });
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
PageController.deletePage = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedPage = await Page.findByIdAndDelete(id);
    if (!deletedPage) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    res.status(200).json({ success: true, data: deletedPage });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}



module.exports = PageController;
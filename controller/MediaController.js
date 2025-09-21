const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });
const MediaController = {};

// Media Library Page
MediaController.getMediaLibrary = async (req, res) => {
    try {
        const { page = 1, fileType = 'all', category = 'all', search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        const response = await axios.get(`${process.env.API_URL}/api/media`, {
            params: { page, fileType, category, search, sortBy, sortOrder }
        });

        res.render('media-library', {
            title: 'Media Library',
            layout: 'partials/layout-vertical',
            media: response.data.data || [],
            pagination: response.data.pagination || {},
            filters: { fileType, category, search, sortBy, sortOrder }
        });
    } catch (error) {
        console.error('Error fetching media library:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Upload Media Page
MediaController.uploadMedia = async (req, res) => {
    try {
        res.render('upload-media', {
            title: 'Upload Media',
            layout: 'partials/layout-vertical'
        });
    } catch (error) {
        console.error('Error rendering upload page:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Handle Media Upload
MediaController.handleUpload = async (req, res) => {
    try {
        const { fileType, category, altText, description, tags } = req.body;
        const file = req.files?.mediaFile;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Create form data for API call
        const formData = new FormData();
        formData.append('mediaFile', file.data, {
            filename: file.name,
            contentType: file.mimetype
        });

        // Add other fields
        if (fileType) formData.append('fileType', fileType);
        if (category) formData.append('category', category);
        if (altText) formData.append('altText', altText);
        if (description) formData.append('description', description);
        if (tags) formData.append('tags', tags);

        const response = await axios.post(`${process.env.API_URL}/api/media/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        res.json({
            success: true,
            data: response.data.data,
            message: 'Media uploaded successfully'
        });
    } catch (error) {
        console.error('Error uploading media:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading media',
            error: error.message
        });
    }
};

// Edit Media Page
MediaController.editMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${process.env.API_URL}/api/media/${id}`);

        res.render('edit-media', {
            title: 'Edit Media',
            layout: 'partials/layout-vertical',
            media: response.data.data || response.data
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Update Media
MediaController.updateMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.put(`${process.env.API_URL}/api/media/${id}`, req.body);

        res.json({
            success: true,
            data: response.data.data,
            message: 'Media updated successfully'
        });
    } catch (error) {
        console.error('Error updating media:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating media',
            error: error.message
        });
    }
};

// Delete Media
MediaController.deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;
        await axios.delete(`${process.env.API_URL}/api/media/${id}`);

        res.json({
            success: true,
            message: 'Media deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting media:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting media',
            error: error.message
        });
    }
};

// Get Media for Selection (AJAX endpoint for popup)
MediaController.getMediaForSelection = async (req, res) => {
    try {
        const { fileType = 'all', page = 1, search = '' } = req.query;

        const response = await axios.get(`${process.env.API_URL}/api/media`, {
            params: { fileType, page, search, limit: 20 }
        });

        res.json({
            success: true,
            data: response.data.data || [],
            pagination: response.data.pagination || {}
        });
    } catch (error) {
        console.error('Error fetching media for selection:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching media',
            error: error.message
        });
    }
};

module.exports = MediaController;
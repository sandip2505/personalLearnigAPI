const axios = require('axios');

const MediaController = {};

MediaController.getMedia = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/media`);
        res.render('media', { title: 'Media', layout: 'partials/layout-vertical', media: response.data });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = MediaController;
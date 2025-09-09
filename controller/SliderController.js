const axios = require('axios');
const SliderController = {};

// Get all sliders
SliderController.getSliders = async (req, res) => {
    try {
        const sliders = await axios.get(`${process.env.API_URL}/api/sliders`);
        res.render('sliders', { title: 'Sliders', layout: 'partials/layout-vertical', sliders: sliders.data });
    } catch (error) {
        console.error('Error fetching sliders:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
// Create a new slider
SliderController.addSlider = async (req, res) => {
    try {
        res.render('add-slider', { title: 'Add Slider', layout: 'partials/layout-vertical' });
    } catch (error) {
        console.error('Error creating slider:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

SliderController.getSliderById = async (req, res) => {
    try {
        const sliderId = req.params.id;
        const sliderData = await axios.get(`${process.env.API_URL}/api/editSlider/${sliderId}`);
        if (!sliderData.data) {
            return res.status(404).json({ success: false, message: 'Slider not found' });
        }
        console.log(sliderData.data, " sliderData");
        res.render('edit-slider', { title: 'Edit Slider', layout: 'partials/layout-vertical', slider: sliderData.data });
    } catch (error) {
        console.error('Error fetching slider:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

SliderController.createSlider = async (req, res) => {
    try {
        const imageFile = req.files?.image || null;

        if (imageFile) {
            const uploadPath = `uploads/${imageFile.name}`;
            await imageFile.mv(uploadPath);
        }

        const { image, title, desc, link, titleCategory, info, sliderBtn, order } = req.body;
        let isActive = req.body.isActive || false;
        isActive = isActive === 'on' ? true : false;

        await axios.post(`${process.env.API_URL}/api/createSlider`, {
            image: imageFile ? imageFile.name : null, title, desc, link, titleCategory, info, sliderBtn, order, isActive
        });
        
        res.redirect('/sliders');
    } catch (error) {
        console.error('Error creating slider cc:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });

    }
}
// Edit a slider
SliderController.editSlider = async (req, res) => {
    try {
        const sliderId = req.params.id;
        const sliderData = await axios.get(`${process.env.API_URL}/api/editSlider/${sliderId}`);
        if (!sliderData.data) {
            return res.status(404).json({ success: false, message: 'Slider not found' });
        }
        res.render('edit-slider', { title: 'Edit Slider', layout: 'partials/layout-vertical', slider: sliderData.data });
    } catch (error) {
        console.error('Error fetching slider:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
// Update a slider
SliderController.updateSlider = async (req, res) => {
    try {
        const sliderId = req.params.id;
        const { image, title, desc, link, titleCategory, info, sliderBtn, order, isActive } = req.body;
        await axios.put(`${process.env.API_URL}/api/updateSlider/${sliderId}`, {
            image, title, desc, link, titleCategory, sliderBtn, info, order, isActive
        });
        res.redirect('/sliders');
    } catch (error) {
        console.error('Error updating slider:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = SliderController;

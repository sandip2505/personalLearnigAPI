const Slider = require('../model/Slider');

const SliderController = {};

// Get all sliders
SliderController.getSliders = async (req, res) => {
    try {
        const sliders = await Slider.find();
        res.status(200).json(sliders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sliders', error });
    }
}
// Create a new slider
SliderController.createSlider = async (req, res) => {
    try {
        const { image, title, desc, link, titleCategory, info, sliderBtn, order, isActive } = req.body;
        const newSlider = new Slider({
            image, title, desc, link, order, info, titleCategory, sliderBtn, isActive
        });
        
        await newSlider.save();
        res.status(201).json(newSlider);
    } catch (error) {
        console.log
        res.status(500).json({ message: 'Error creating slider', error });
    }
};

// Edit a slider
SliderController.editSlider = async (req, res) => {
    try {
        const sliderId = req.params.id;
        const sliderData = await Slider.findById(sliderId);
        if (!sliderData) {
            return res.status(404).json({ message: 'Slider not found' });
        }
        res.status(200).json(sliderData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching slider', error });
    }
};
// Update a slider
SliderController.updateSlider = async (req, res) => {
    try {
        const sliderId = req.params.id;
        let image = '';

        // Handle file upload if present
        if (req.files && req.files.image) {
            const image = req.files.image;
            const uploadPath = `uploads/${image.name}`;
            await image.mv(uploadPath);
            image = image.name;
            console.log('File moved successfully');
        }
        const { title, desc, link, titleCategory, info, sliderBtn, order, isActive } = req.body;
        const updatedSlider = await Slider.findByIdAndUpdate(sliderId, {
            image, title, desc, link, order, info, titleCategory, sliderBtn, isActive
        }, { new: true });
        if (!updatedSlider) {
            return res.status(404).json({ message: 'Slider not found' });
        }
        res.status(200).json({ status: 'success', data: updatedSlider });
    } catch (error) {
        res.status(500).json({ message: 'Error updating slider', error });
    }
};
// Delete a slider
SliderController.deleteSlider = async (req, res) => {
    try {
        const sliderId = req.params.id;
        const deletedSlider = await Slider.findByIdAndDelete(sliderId);
        if (!deletedSlider) {
            return res.status(404).json({ status: 'error', message: 'Slider not found' });
        }
        res.status(200).json({ status: true, message: 'Slider deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error deleting slider', error });
    }
};
module.exports = SliderController;
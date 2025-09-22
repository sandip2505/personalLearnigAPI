const Review = require('../model/Review');

const ReviewController = {};

ReviewController.create = async (req, res) => {
    try {
        const review = await Review.create(req.body);
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

ReviewController.list = async (req, res) => {
    try {
        const reviews = await Review.find().populate('user', 'name email').populate('course', 'title').sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

ReviewController.get = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('user', 'name email').populate('course', 'title');
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

ReviewController.update = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

ReviewController.listByCourse = async (req, res) => {
    try {
        const items = await Review.find({ course: req.params.courseId }).populate('user', 'name');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

ReviewController.remove = async (req, res) => {
    try {
        const item = await Review.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Review not found' });
        res.status(200).json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = ReviewController;



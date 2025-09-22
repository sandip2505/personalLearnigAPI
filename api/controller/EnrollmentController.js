const Enrollment = require('../model/Enrollment');

const EnrollmentController = {};

EnrollmentController.enroll = async (req, res) => {
    try {
        const { user, course } = req.body;
        const existing = await Enrollment.findOne({ user, course });
        if (existing) return res.status(200).json(existing);
        const enroll = await Enrollment.create({ user, course });
        res.status(201).json(enroll);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

EnrollmentController.list = async (req, res) => {
    try {
        const enrollments = await Enrollment.find().populate('user', 'name email').populate('course', 'title').sort({ createdAt: -1 });
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

EnrollmentController.get = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id).populate('user', 'name email').populate('course', 'title');
        if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
        res.status(200).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

EnrollmentController.update = async (req, res) => {
    try {
        const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
        res.status(200).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

EnrollmentController.remove = async (req, res) => {
    try {
        const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
        if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
        res.status(200).json({ message: 'Enrollment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

EnrollmentController.listByCourse = async (req, res) => {
    try {
        const items = await Enrollment.find({ course: req.params.courseId }).populate('user', 'name email');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

EnrollmentController.listByUser = async (req, res) => {
    try {
        const items = await Enrollment.find({ user: req.params.userId }).populate('course', 'title');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = EnrollmentController;



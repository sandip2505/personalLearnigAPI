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



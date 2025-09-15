const Payment = require('../model/Payment');

const PaymentController = {};

PaymentController.create = async (req, res) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

PaymentController.listByCourse = async (req, res) => {
    try {
        const payments = await Payment.find({ course: req.params.courseId }).populate('user', 'name email');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

PaymentController.listByUser = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.params.userId }).populate('course', 'title');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = PaymentController;



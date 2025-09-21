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

PaymentController.list = async (req, res) => {
    try {
        const payments = await Payment.find().populate('user', 'name email').populate('course', 'title').sort({ createdAt: -1 });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

PaymentController.get = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('user', 'name email').populate('course', 'title');
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

PaymentController.update = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

PaymentController.remove = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json({ message: 'Payment deleted' });
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



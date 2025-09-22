const Notification = require('../model/Notification');

const NotificationController = {};

NotificationController.create = async (req, res) => {
    try {
        const notification = await Notification.create(req.body);
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

NotificationController.list = async (req, res) => {
    try {
        const notifications = await Notification.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

NotificationController.get = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id).populate('user', 'name email');
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

NotificationController.update = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

NotificationController.remove = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

NotificationController.listForUser = async (req, res) => {
    try {
        const userId = req.params.userId || req.user?.id;
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

NotificationController.markRead = async (req, res) => {
    try {
        const note = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        if (!note) return res.status(404).json({ message: 'Notification not found' });
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = NotificationController;



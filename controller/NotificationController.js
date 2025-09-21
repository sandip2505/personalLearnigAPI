const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });

const NotificationController = {};

NotificationController.getNotifications = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/notifications`);
        res.render('notifications', {
            title: 'Notifications',
            layout: 'partials/layout-vertical',
            notifications: response.data
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).send('Internal Server Error');
    }
};

NotificationController.addNotification = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        // Get users for dropdown
        const usersResponse = await axios.get(`${process.env.API_URL}/api/users`);
        res.render('add-notification', {
            title: 'Add Notification',
            layout: 'partials/layout-vertical',
            users: usersResponse.data
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
};

NotificationController.createNotification = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        await axios.post(`${process.env.API_URL}/api/notifications`, req.body);
        res.redirect('/notifications');
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).send('Internal Server Error');
    }
};

NotificationController.editNotification = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { id } = req.params;
        const [notificationResponse, usersResponse] = await Promise.all([
            axios.get(`${process.env.API_URL}/api/notifications/${id}`),
            axios.get(`${process.env.API_URL}/api/users`)
        ]);

        res.render('edit-notification', {
            title: 'Edit Notification',
            layout: 'partials/layout-vertical',
            notification: notificationResponse.data,
            users: usersResponse.data
        });
    } catch (error) {
        console.error('Error fetching notification:', error);
        res.status(500).send('Internal Server Error');
    }
};

NotificationController.updateNotification = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { id } = req.params;
        await axios.put(`${process.env.API_URL}/api/notifications/${id}`, req.body);
        res.redirect('/notifications');
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).send('Internal Server Error');
    }
};

NotificationController.deleteNotification = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { id } = req.params;
        await axios.delete(`${process.env.API_URL}/api/notifications/${id}`);
        res.redirect('/notifications');
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = NotificationController;

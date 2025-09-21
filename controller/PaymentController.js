const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });

const PaymentController = {};

PaymentController.getPayments = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/payments`);
        res.render('payments', {
            title: 'Payments',
            layout: 'partials/layout-vertical',
            payments: response.data
        });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).send('Internal Server Error');
    }
};

PaymentController.addPayment = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        // Get courses and users for dropdowns
        const [coursesResponse, usersResponse] = await Promise.all([
            axios.get(`${process.env.API_URL}/api/courses`),
            axios.get(`${process.env.API_URL}/api/users`)
        ]);

        res.render('add-payment', {
            title: 'Add Payment',
            layout: 'partials/layout-vertical',
            courses: coursesResponse.data,
            users: usersResponse.data
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
};

PaymentController.createPayment = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        await axios.post(`${process.env.API_URL}/api/payments`, req.body);
        res.redirect('/payments');
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).send('Internal Server Error');
    }
};

PaymentController.editPayment = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { id } = req.params;
        const [paymentResponse, coursesResponse, usersResponse] = await Promise.all([
            axios.get(`${process.env.API_URL}/api/payments/${id}`),
            axios.get(`${process.env.API_URL}/api/courses`),
            axios.get(`${process.env.API_URL}/api/users`)
        ]);

        res.render('edit-payment', {
            title: 'Edit Payment',
            layout: 'partials/layout-vertical',
            payment: paymentResponse.data,
            courses: coursesResponse.data,
            users: usersResponse.data
        });
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).send('Internal Server Error');
    }
};

PaymentController.updatePayment = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { id } = req.params;
        await axios.put(`${process.env.API_URL}/api/payments/${id}`, req.body);
        res.redirect('/payments');
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).send('Internal Server Error');
    }
};

PaymentController.deletePayment = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { id } = req.params;
        await axios.delete(`${process.env.API_URL}/api/payments/${id}`);
        res.redirect('/payments');
    } catch (error) {
        console.error('Error deleting payment:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = PaymentController;

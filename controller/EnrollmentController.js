const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });

const EnrollmentController = {};

EnrollmentController.getEnrollments = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/enrollments`);
        res.render('enrollments', {
            title: 'Enrollments',
            layout: 'partials/layout-vertical',
            enrollments: response.data
        });
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        res.status(500).send('Internal Server Error');
    }
};

EnrollmentController.addEnrollment = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        // Get courses and users for dropdowns
        const [coursesResponse, usersResponse] = await Promise.all([
            axios.get(`${process.env.API_URL}/api/courses`),
            axios.get(`${process.env.API_URL}/api/users`)
        ]);

        res.render('add-enrollment', {
            title: 'Add Enrollment',
            layout: 'partials/layout-vertical',
            courses: coursesResponse.data,
            users: usersResponse.data
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
};

EnrollmentController.createEnrollment = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        await axios.post(`${process.env.API_URL}/api/enrollments`, req.body);
        res.redirect('/enrollments');
    } catch (error) {
        console.error('Error creating enrollment:', error);
        res.status(500).send('Internal Server Error');
    }
};

EnrollmentController.editEnrollment = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { id } = req.params;
        const [enrollmentResponse, coursesResponse, usersResponse] = await Promise.all([
            axios.get(`${process.env.API_URL}/api/enrollments/${id}`),
            axios.get(`${process.env.API_URL}/api/courses`),
            axios.get(`${process.env.API_URL}/api/users`)
        ]);

        res.render('edit-enrollment', {
            title: 'Edit Enrollment',
            layout: 'partials/layout-vertical',
            enrollment: enrollmentResponse.data,
            courses: coursesResponse.data,
            users: usersResponse.data
        });
    } catch (error) {
        console.error('Error fetching enrollment:', error);
        res.status(500).send('Internal Server Error');
    }
};

EnrollmentController.updateEnrollment = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { id } = req.params;
        await axios.put(`${process.env.API_URL}/api/enrollments/${id}`, req.body);
        res.redirect('/enrollments');
    } catch (error) {
        console.error('Error updating enrollment:', error);
        res.status(500).send('Internal Server Error');
    }
};

EnrollmentController.deleteEnrollment = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { id } = req.params;
        await axios.delete(`${process.env.API_URL}/api/enrollments/${id}`);
        res.redirect('/enrollments');
    } catch (error) {
        console.error('Error deleting enrollment:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = EnrollmentController;

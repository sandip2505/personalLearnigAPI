const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });

const ReviewController = {};

ReviewController.getReviews = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/reviews`);
        res.render('reviews', {
            title: 'Reviews',
            layout: 'partials/layout-vertical',
            reviews: response.data
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Internal Server Error');
    }
};

ReviewController.addReview = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        // Get courses and users for dropdowns
        const [coursesResponse, usersResponse] = await Promise.all([
            axios.get(`${process.env.API_URL}/api/courses`),
            axios.get(`${process.env.API_URL}/api/users`)
        ]);

        res.render('add-review', {
            title: 'Add Review',
            layout: 'partials/layout-vertical',
            courses: coursesResponse.data,
            users: usersResponse.data
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
};

ReviewController.createReview = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { courseId } = req.body;
        await axios.post(`${process.env.API_URL}/api/courses/${courseId}/reviews`, req.body);
        res.redirect('/reviews');
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).send('Internal Server Error');
    }
};

ReviewController.editReview = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { id } = req.params;
        const [reviewResponse, coursesResponse, usersResponse] = await Promise.all([
            axios.get(`${process.env.API_URL}/api/reviews/${id}`),
            axios.get(`${process.env.API_URL}/api/courses`),
            axios.get(`${process.env.API_URL}/api/users`)
        ]);

        res.render('edit-review', {
            title: 'Edit Review',
            layout: 'partials/layout-vertical',
            review: reviewResponse.data,
            courses: coursesResponse.data,
            users: usersResponse.data
        });
    } catch (error) {
        console.error('Error fetching review:', error);
        res.status(500).send('Internal Server Error');
    }
};

ReviewController.updateReview = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { id } = req.params;
        await axios.put(`${process.env.API_URL}/api/reviews/${id}`, req.body);
        res.redirect('/reviews');
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).send('Internal Server Error');
    }
};

ReviewController.deleteReview = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { id } = req.params;
        await axios.delete(`${process.env.API_URL}/api/reviews/${id}`);
        res.redirect('/reviews');
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = ReviewController;

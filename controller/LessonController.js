const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });

const LessonController = {};

LessonController.getLessons = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/lessons`);
        res.render('lessons', {
            title: 'Lessons',
            layout: 'partials/layout-vertical',
            lessons: response.data
        });
    } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).send('Internal Server Error');
    }
};

LessonController.addLesson = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        // Get courses for dropdown
        const coursesResponse = await axios.get(`${process.env.API_URL}/api/courses`);
        res.render('add-lesson', {
            title: 'Add Lesson',
            layout: 'partials/layout-vertical',
            courses: coursesResponse.data
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send('Internal Server Error');
    }
};

LessonController.createLesson = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        await axios.post(`${process.env.API_URL}/api/lessons`, req.body);
        res.redirect('/lessons');
    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).send('Internal Server Error');
    }
};

LessonController.editLesson = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { id } = req.params;
        const [lessonResponse, coursesResponse] = await Promise.all([
            axios.get(`${process.env.API_URL}/api/lessons/${id}`),
            axios.get(`${process.env.API_URL}/api/courses`)
        ]);

        res.render('edit-lesson', {
            title: 'Edit Lesson',
            layout: 'partials/layout-vertical',
            lesson: lessonResponse.data,
            courses: coursesResponse.data
        });
    } catch (error) {
        console.error('Error fetching lesson:', error);
        res.status(500).send('Internal Server Error');
    }
};

LessonController.updateLesson = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { id } = req.params;
        await axios.put(`${process.env.API_URL}/api/lessons/${id}`, req.body);
        res.redirect('/lessons');
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).send('Internal Server Error');
    }
};

LessonController.deleteLesson = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { id } = req.params;
        await axios.delete(`${process.env.API_URL}/api/lessons/${id}`);
        res.redirect('/lessons');
    } catch (error) {
        console.error('Error deleting lesson:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = LessonController;

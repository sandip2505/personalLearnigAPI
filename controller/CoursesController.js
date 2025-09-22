const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });
const CoursesController = {};

CoursesController.getCourses = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/courses`);
        console.log(response.data);
        res.render('courses', {
            title: 'Courses',
            layout: 'partials/layout-vertical',
            courses: response.data.data || response.data
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send('Internal Server Error');
    }
};

CoursesController.addCourse = async (req, res) => {
    try {
        // Get categories and instructors for dropdowns
        const [categoriesResponse, instructorsResponse] = await Promise.all([
            axios.get(`${process.env.API_URL}/api/categories`),
            axios.get(`${process.env.API_URL}/api/users`)
        ]);

        res.render('add-course', {
            title: 'Add Course',
            layout: 'partials/layout-vertical',
            categories: categoriesResponse.data.data || categoriesResponse.data,
            instructors: instructorsResponse.data.data || instructorsResponse.data
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
};

CoursesController.createCourse = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        await axios.post(`${process.env.API_URL}/api/courses`, req.body);
        res.redirect('/courses');
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).send('Internal Server Error');
    }
};

CoursesController.editCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const [courseResponse, categoriesResponse, instructorsResponse] = await Promise.all([
            axios.get(`${process.env.API_URL}/api/courses/${id}`),
            axios.get(`${process.env.API_URL}/api/categories`),
            axios.get(`${process.env.API_URL}/api/users`)
        ]);

        res.render('edit-course', {
            title: 'Edit Course',
            layout: 'partials/layout-vertical',
            course: courseResponse.data.data || courseResponse.data,
            categories: categoriesResponse.data.data || categoriesResponse.data,
            instructors: instructorsResponse.data.data || instructorsResponse.data
        });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).send('Internal Server Error');
    }
};

CoursesController.updateCourse = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const { id } = req.params;
        await axios.put(`${process.env.API_URL}/api/courses/${id}`, req.body);
        res.redirect('/courses');
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).send('Internal Server Error');
    }
};

CoursesController.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        await axios.delete(`${process.env.API_URL}/api/courses/${id}`);
        res.redirect('/courses');
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Course Content Management Methods
CoursesController.getCourseContent = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/course-content`);
        res.render('course-content', {
            title: 'Course Content',
            layout: 'partials/layout-vertical',
            courseContent: response.data.data || response.data
        });
    } catch (error) {
        console.error('Error fetching course content:', error);
        res.status(500).send('Internal Server Error');
    }
};

CoursesController.addCourseContent = async (req, res) => {
    try {
        const [coursesResponse] = await Promise.all([
            axios.get(`${process.env.API_URL}/api/courses`)
        ]);

        res.render('add-course-content', {
            title: 'Add Course Content',
            layout: 'partials/layout-vertical',
            courses: coursesResponse.data.data || coursesResponse.data
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
};

CoursesController.createCourseContent = async (req, res) => {
    try {
        await axios.post(`${process.env.API_URL}/api/course-content`, req.body);
        res.redirect('/course-content');
    } catch (error) {
        console.error('Error creating course content:', error);
        res.status(500).send('Internal Server Error');
    }
};

CoursesController.editCourseContent = async (req, res) => {
    try {
        const { id } = req.params;
        const [contentResponse, coursesResponse] = await Promise.all([
            axios.get(`${process.env.API_URL}/api/course-content/${id}`),
            axios.get(`${process.env.API_URL}/api/courses`)
        ]);

        res.render('edit-course-content', {
            title: 'Edit Course Content',
            layout: 'partials/layout-vertical',
            courseContent: contentResponse.data.data || contentResponse.data,
            courses: coursesResponse.data.data || coursesResponse.data
        });
    } catch (error) {
        console.error('Error fetching course content:', error);
        res.status(500).send('Internal Server Error');
    }
};

CoursesController.updateCourseContent = async (req, res) => {
    try {
        const { id } = req.params;
        await axios.put(`${process.env.API_URL}/api/course-content/${id}`, req.body);
        res.redirect('/course-content');
    } catch (error) {
        console.error('Error updating course content:', error);
        res.status(500).send('Internal Server Error');
    }
};

CoursesController.deleteCourseContent = async (req, res) => {
    try {
        const { id } = req.params;
        await axios.delete(`${process.env.API_URL}/api/course-content/${id}`);
        res.redirect('/course-content');
    } catch (error) {
        console.error('Error deleting course content:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = CoursesController
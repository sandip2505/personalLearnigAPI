const CourseContent = require('../model/CourseContent');
const Course = require('../model/Course');
const { mediaApi } = require('../../utils/storeMedia');

const CourseContentController = {};

// Get all course content for a specific course
CourseContentController.list = async (req, res) => {
    try {
        const { courseId } = req.params;
        const courseContent = await CourseContent.find({ courseId })
            .populate('courseId', 'title')
            .sort({ orderIndex: 1 });

        res.json({
            success: true,
            data: courseContent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching course content',
            error: error.message
        });
    }
};

// Get all course content (admin view)
CourseContentController.getAll = async (req, res) => {
    try {
        const courseContent = await CourseContent.find()
            .populate('courseId', 'title')
            .sort({ courseId: 1, orderIndex: 1 });

        res.json({
            success: true,
            data: courseContent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching course content',
            error: error.message
        });
    }
};

// Get single course content item
CourseContentController.get = async (req, res) => {
    try {
        const { id } = req.params;
        const courseContent = await CourseContent.findById(id)
            .populate('courseId', 'title');

        if (!courseContent) {
            return res.status(404).json({
                success: false,
                message: 'Course content not found'
            });
        }

        res.json({
            success: true,
            data: courseContent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching course content',
            error: error.message
        });
    }
};

// Create new course content
CourseContentController.create = async (req, res) => {
    try {
        const { courseId, type, title, description, orderIndex, duration, contentFile } = req.body;

        // Verify course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        let contentUrl = req.body.contentUrl;

        // Handle file upload if contentFile is provided
        if (contentFile) {
            const uploadedFile = await mediaApi.uploadSingle(contentFile, {
                fileName: `${title}_${Date.now()}`
            });
            contentUrl = uploadedFile.data.path;
        }

        const courseContent = await CourseContent.create({
            courseId,
            type,
            title,
            description,
            contentUrl,
            orderIndex: orderIndex || 0,
            duration
        });

        res.status(201).json({
            success: true,
            data: courseContent,
            message: 'Course content created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating course content',
            error: error.message
        });
    }
};

// Update course content
CourseContentController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, title, description, orderIndex, duration, contentFile } = req.body;

        const courseContent = await CourseContent.findById(id);
        if (!courseContent) {
            return res.status(404).json({
                success: false,
                message: 'Course content not found'
            });
        }

        let contentUrl = courseContent.contentUrl;

        // Handle file upload if contentFile is provided
        if (contentFile) {
            const uploadedFile = await mediaApi.uploadSingle(contentFile, {
                fileName: `${title}_${Date.now()}`
            });
            contentUrl = uploadedFile.data.path;
        }

        const updatedContent = await CourseContent.findByIdAndUpdate(
            id,
            {
                type,
                title,
                description,
                contentUrl,
                orderIndex: orderIndex || courseContent.orderIndex,
                duration
            },
            { new: true }
        ).populate('courseId', 'title');

        res.json({
            success: true,
            data: updatedContent,
            message: 'Course content updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating course content',
            error: error.message
        });
    }
};

// Delete course content
CourseContentController.remove = async (req, res) => {
    try {
        const { id } = req.params;

        const courseContent = await CourseContent.findByIdAndDelete(id);
        if (!courseContent) {
            return res.status(404).json({
                success: false,
                message: 'Course content not found'
            });
        }

        res.json({
            success: true,
            message: 'Course content deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting course content',
            error: error.message
        });
    }
};

// Reorder course content
CourseContentController.reorder = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { contentOrder } = req.body; // Array of { id, orderIndex }

        const updatePromises = contentOrder.map(item =>
            CourseContent.findByIdAndUpdate(item.id, { orderIndex: item.orderIndex })
        );

        await Promise.all(updatePromises);

        res.json({
            success: true,
            message: 'Course content reordered successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error reordering course content',
            error: error.message
        });
    }
};

module.exports = CourseContentController;

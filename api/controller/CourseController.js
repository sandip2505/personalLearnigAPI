const Course = require('../model/Course');
const { mediaApi } = require('../../utils/storeMedia');

const CourseController = {};

async function maybeUpload(bufferOrBase64, fileNameHint) {
    if (!bufferOrBase64) return null;
    let buf = null;
    if (Buffer.isBuffer(bufferOrBase64)) buf = bufferOrBase64;
    else if (typeof bufferOrBase64 === 'string' && bufferOrBase64.startsWith('data:')) {
        const base64 = bufferOrBase64.split(',')[1];
        buf = Buffer.from(base64, 'base64');
    }
    if (!buf) return null;
    const uploaded = await mediaApi.uploadSingle(buf, { fileName: fileNameHint || `file_${Date.now()}` });
    return uploaded?.data?.path || uploaded?.path || uploaded?.url || null;
}

CourseController.create = async (req, res) => {
    try {
        const { title, description, categoryId, price, level, instructorId, language, status, thumbnailUrl, thumbnailFile } = req.body;

        let finalThumbnailUrl = thumbnailUrl || null;
        if (!finalThumbnailUrl && thumbnailFile) {
            finalThumbnailUrl = await maybeUpload(thumbnailFile, 'thumbnail');
        }

        const course = await Course.create({
            title,
            description,
            categoryId,
            price: price || 0,
            level,
            instructorId,
            language: language || 'English',
            status: status || 'draft',
            thumbnailUrl: finalThumbnailUrl
        });

        res.status(201).json({
            success: true,
            data: course,
            message: 'Course created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating course',
            error: error.message
        });
    }
};

CourseController.list = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('categoryId', 'name')
            .populate('instructorId', 'name email');

        res.json({
            success: true,
            data: courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching courses',
            error: error.message
        });
    }
};

CourseController.get = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('categoryId', 'name')
            .populate('instructorId', 'name email');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching course',
            error: error.message
        });
    }
};

CourseController.update = async (req, res) => {
    try {
        const { title, description, categoryId, price, level, instructorId, language, status, thumbnailUrl, thumbnailFile } = req.body;

        const updates = {};
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (categoryId !== undefined) updates.categoryId = categoryId;
        if (price !== undefined) updates.price = price;
        if (level !== undefined) updates.level = level;
        if (instructorId !== undefined) updates.instructorId = instructorId;
        if (language !== undefined) updates.language = language;
        if (status !== undefined) updates.status = status;

        if (thumbnailFile) {
            updates.thumbnailUrl = await maybeUpload(thumbnailFile, 'thumbnail');
        } else if (thumbnailUrl !== undefined) {
            updates.thumbnailUrl = thumbnailUrl;
        }

        const course = await Course.findByIdAndUpdate(req.params.id, updates, { new: true })
            .populate('categoryId', 'name')
            .populate('instructorId', 'name email');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.json({
            success: true,
            data: course,
            message: 'Course updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating course',
            error: error.message
        });
    }
};

CourseController.remove = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting course',
            error: error.message
        });
    }
};

module.exports = CourseController;



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
        const { title, description, category, price, level, instructor, thumbnail, thumbnailFile } = req.body;
        let thumbnailUrl = thumbnail || null;
        if (!thumbnailUrl && thumbnailFile) {
            thumbnailUrl = await maybeUpload(thumbnailFile, 'thumbnail');
        }
        const course = await Course.create({ title, description, category, price, level, instructor, thumbnail: thumbnailUrl });
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

CourseController.list = async (req, res) => {
    try {
        const courses = await Course.find().populate('category', 'name').populate('instructor', 'name email');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

CourseController.get = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('category', 'name').populate('instructor', 'name email');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

CourseController.update = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.body.thumbnailFile && !updates.thumbnail) {
            updates.thumbnail = await maybeUpload(req.body.thumbnailFile, 'thumbnail');
        }
        const course = await Course.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

CourseController.remove = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.status(200).json({ message: 'Course deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = CourseController;



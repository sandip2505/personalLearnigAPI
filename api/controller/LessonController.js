const Lesson = require('../model/Lesson');
const { mediaApi } = require('../../utils/storeMedia');

const LessonController = {};

async function uploadIfNeeded(contentFile, name) {
    if (!contentFile) return null;
    let buf = null;
    if (Buffer.isBuffer(contentFile)) buf = contentFile;
    else if (typeof contentFile === 'string' && contentFile.startsWith('data:')) {
        buf = Buffer.from(contentFile.split(',')[1], 'base64');
    }
    if (!buf) return null;
    const up = await mediaApi.uploadSingle(buf, { fileName: name || `lesson_${Date.now()}` });
    return up?.data?.path || up?.path || up?.url || null;
}

LessonController.create = async (req, res) => {
    try {
        const { course, title, contentType, contentUrl, contentFile, orderIndex, duration } = req.body;
        let storedUrl = contentUrl || null;
        if (!storedUrl && contentFile) storedUrl = await uploadIfNeeded(contentFile, title);
        const lesson = await Lesson.create({ course, title, contentType, contentUrl: storedUrl, orderIndex, duration });
        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

LessonController.listByCourse = async (req, res) => {
    try {
        const lessons = await Lesson.find({ course: req.params.courseId }).sort({ orderIndex: 1 });
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

LessonController.update = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.body.contentFile && !updates.contentUrl) {
            updates.contentUrl = await uploadIfNeeded(req.body.contentFile, updates.title);
        }
        const lesson = await Lesson.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

LessonController.remove = async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndDelete(req.params.id);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        res.status(200).json({ message: 'Lesson deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = LessonController;



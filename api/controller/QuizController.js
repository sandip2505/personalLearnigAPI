const Quiz = require('../model/Quiz');

const QuizController = {};

QuizController.create = async (req, res) => {
    try {
        const quiz = await Quiz.create(req.body);
        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

QuizController.list = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('course', 'title');
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

QuizController.get = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('course', 'title');
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

QuizController.update = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

QuizController.remove = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.status(200).json({ message: 'Quiz deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = QuizController;



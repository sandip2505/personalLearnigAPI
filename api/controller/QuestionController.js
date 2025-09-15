const Question = require('../model/Question');

const QuestionController = {};

QuestionController.create = async (req, res) => {
    try {
        const question = await Question.create(req.body);
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

QuestionController.listByQuiz = async (req, res) => {
    try {
        const questions = await Question.find({ quiz: req.params.quizId });
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

QuestionController.update = async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!question) return res.status(404).json({ message: 'Question not found' });
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

QuestionController.remove = async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });
        res.status(200).json({ message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = QuestionController;



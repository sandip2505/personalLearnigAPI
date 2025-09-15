const QuizResult = require('../model/QuizResult');

const QuizResultController = {};

QuizResultController.submit = async (req, res) => {
    try {
        const payload = { ...req.body, user: req.user?.id || req.body.user };
        const result = await QuizResult.create(payload);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

QuizResultController.listByQuiz = async (req, res) => {
    try {
        const results = await QuizResult.find({ quiz: req.params.quizId }).populate('user', 'name email');
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = QuizResultController;



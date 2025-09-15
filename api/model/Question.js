const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        enum: ["single", "multiple", "boolean", "text"],
        default: "single"
    },
    options: {
        type: [String],
        default: []
    },
    correctAnswer: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Question", questionSchema);



const mongoose = require('mongoose');

const courseContentSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    type: {
        type: String,
        enum: ["video", "document", "text", "audio", "image"],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    contentUrl: {
        type: String,
        required: true
    },
    orderIndex: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number // in minutes
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

// Add index for better query performance
courseContentSchema.index({ courseId: 1, orderIndex: 1 });

module.exports = mongoose.model("CourseContent", courseContentSchema);

const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Course", 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    contentType: { 
        type: String, 
        enum: ["video", "pdf", "quiz", "assignment"], 
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
        type: Number 
    } // minutes
}, { 
    timestamps: true 
});

module.exports = mongoose.model("Lesson", lessonSchema);

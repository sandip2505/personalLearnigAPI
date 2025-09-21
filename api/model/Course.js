const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    thumbnailUrl: {
        type: String
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: true
    },
    price: {
        type: Number,
        default: 0
    }, // 0 = free course
    language: {
        type: String,
        default: "English"
    },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Course", courseSchema);

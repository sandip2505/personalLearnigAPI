const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    instructor: { 
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
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Category" 
    },
    price: { 
        type: Number, 
        default: 0 
    }, // 0 = free course
    level: { 
        type: String, 
        enum: ["beginner", "intermediate", "advanced"] 
    },
    thumbnail: { 
        type: String 
    },
    isPublished: { 
        type: Boolean, 
        default: false 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model("Course", courseSchema);

const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Course", 
        required: true 
    },
    progress: { 
        type: Number, 
        default: 0.0 
    }, // percentage
    enrolledAt: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);

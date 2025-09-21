const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    fileType: {
        type: String,
        enum: ['image', 'video', 'audio', 'document', 'other'],
        required: true
    },
    category: {
        type: String,
        default: 'general'
    },
    altText: {
        type: String
    },
    description: {
        type: String
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String
    }],
    dimensions: {
        width: Number,
        height: Number
    },
    duration: {
        type: Number // in seconds for videos/audio
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
mediaSchema.index({ fileType: 1, category: 1 });
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ tags: 1 });
mediaSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Media", mediaSchema);

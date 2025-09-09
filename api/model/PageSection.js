const mongoose = require('mongoose');

const pageSectionSchema = new mongoose.Schema({
    pageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page',
        required: true
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['published', 'draft', 'archived'],
        default: 'draft'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PageSection', pageSectionSchema);
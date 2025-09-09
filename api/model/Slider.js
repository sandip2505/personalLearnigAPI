const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    info: {
        type: String,
        required: true
    },
    titleCategory: {
        type: String,
        required: true
    },
    sliderBtn: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
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

module.exports = mongoose.model('Slider', sliderSchema);
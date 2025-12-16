const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        required: [true, 'Please add an image URL'],
    },
    category: {
        type: String,
        enum: ['boreholes', 'babies', 'education', 'community', 'other'],
        default: 'other',
    },
    order: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Gallery', gallerySchema);

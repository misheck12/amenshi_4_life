const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a service title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    icon: {
        type: String,
        required: [true, 'Please add an icon name'],
        default: 'FaHandHoldingHeart',
    },
    image: {
        type: String,
    },
    details: [{
        type: String,
    }],
    order: {
        type: Number,
        default: 0,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Service', serviceSchema);

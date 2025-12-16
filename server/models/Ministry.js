const mongoose = require('mongoose');

const ministrySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a ministry title'],
        trim: true,
    },
    subtitle: {
        type: String,
        required: [true, 'Please add a subtitle'],
    },
    content: [{
        type: String,
        required: true,
    }],
    image: {
        type: String,
        required: [true, 'Please add an image URL'],
    },
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

module.exports = mongoose.model('Ministry', ministrySchema);

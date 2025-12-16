const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a video title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    youtubeUrl: {
        type: String,
        required: [true, 'Please add a YouTube URL'],
        validate: {
            validator: function(v) {
                // Validates YouTube URLs
                return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(v);
            },
            message: 'Please provide a valid YouTube URL'
        }
    },
    videoId: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String, // Auto-generated from YouTube
    },
    category: {
        type: String,
        enum: ['boreholes', 'babies', 'education', 'community', 'testimonials', 'other'],
        default: 'other',
    },
    order: {
        type: Number,
        default: 0,
    },
    active: {
        type: Boolean,
        default: true,
    },
    views: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Extract video ID from YouTube URL before saving
videoSchema.pre('save', function(next) {
    if (this.youtubeUrl) {
        const videoId = extractYouTubeID(this.youtubeUrl);
        if (videoId) {
            this.videoId = videoId;
            this.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
    }
    next();
});

// Function to extract YouTube video ID
function extractYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

module.exports = mongoose.model('Video', videoSchema);

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
   required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'completed'],
    default: 'planned'
  },
  images: [{
    type: String
  }],
 beneficiaries: {
    type: Number,
    default: 0
  },
  cost: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['borehole-donation', 'borehole-repair', 'education', 'babies', 'other'],
    required: [true, 'Please specify a category']
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  completedDate: {
    type: Date
  },
  featured: {
    type: Boolean,
    default: false
  },
  youtubeUrl: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(v);
      },
      message: 'Please provide a valid YouTube URL'
    }
  },
  videoId: {
    type: String
  }
}, {
  timestamps: true
});

// Create index for searching
projectSchema.index({ title: 'text', description: 'text', location: 'text' });

// Extract video ID from YouTube URL before saving
projectSchema.pre('save', function(next) {
  if (this.youtubeUrl && this.isModified('youtubeUrl')) {
    const videoId = extractYouTubeID(this.youtubeUrl);
    if (videoId) {
      this.videoId = videoId;
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

module.exports = mongoose.model('Project', projectSchema);

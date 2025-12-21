const mongoose = require('mongoose');
const slugify = require('slugify');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  summary: {
    type: String,
    required: [true, 'Please add a short summary'],
    maxlength: [200, 'Summary cannot be more than 200 characters']
  },
  imageUrl: {
    type: String,
    default: 'no-photo.jpg'
  },
  author: {
    type: String,
    required: [true, 'Please add an author name']
  },
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Create slug from title
storySchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model('Story', storySchema);

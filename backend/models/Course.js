const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, default: 'link' }, // 'pdf', 'zip', 'link', 'code'
});

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, default: '15 mins' },
  type: {
    type: String,
    enum: ['video', 'article', 'lab', 'quiz'],
    default: 'video',
  },
  videoUrl: { type: String, default: '' },
  content: { type: String, default: '' },
  resources: [resourceSchema],
  isPreview: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 250,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    instructor: {
      name: { type: String, required: true, default: 'LearnHub Expert' },
      email: { type: String, default: 'instructor@learnhub.dev' },
      avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
      bio: { type: String, default: 'Senior Software Architect and Tech Educator' },
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    },
    price: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: String,
      default: '6 hours',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 120,
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'published',
    },
    tags: [{ type: String }],
    learningOutcomes: [{ type: String }],
    prerequisites: [{ type: String }],
    lessons: [lessonSchema],
    enrolledCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);


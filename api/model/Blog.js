const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      trim: true,
      default: '',
    },
    featuredImage: {
      type: String, // URL to the image
      default: '',
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],

    // SEO Metadata
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    metaKeywords: {
      type: [String], // Array of keywords
    },

    // Status and visibility
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishDate: {
      type: Date,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('Blog', blogSchema);

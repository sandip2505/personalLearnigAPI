const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  metadata: {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    keywords: {
      type: [String],
    },
    author: {
      type: String,
    }
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

module.exports = mongoose.model('Page', pageSchema);
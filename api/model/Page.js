const mongoose = require('mongoose');

// Dynamic field schema for flexibility
const dynamicFieldSchema = new mongoose.Schema({
  fieldName: {
    type: String,
    required: true
  },
  fieldType: {
    type: String,
    enum: ['text', 'textarea', 'image', 'url', 'number', 'boolean', 'rich_text'],
    required: true
  },
  fieldValue: {
    type: mongoose.Schema.Types.Mixed, // Can store any type of data
    required: false
  },
  isRequired: {
    type: Boolean,
    default: false
  }
}, { _id: false });

// Section schema
const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  sectionTitle: {
    type: String,
    required: true
  },
  fields: [dynamicFieldSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true,
  _id: true 
});

// Main Page schema
const pageSchema = new mongoose.Schema({
  pageName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  pageTitle: {
    type: String,
    required: true
  },
  sections: [sectionSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    description: String,
    keywords: [String],
    author: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
pageSchema.index({ pageName: 1 });
pageSchema.index({ 'sections.sectionName': 1 });
pageSchema.index({ pageName: 1, 'sections.sectionName': 1 });

// Methods
pageSchema.methods.getSection = function(sectionName) {
  return this.sections.find(section => 
    section.sectionName === sectionName.toLowerCase() && section.isActive
  );
};

pageSchema.methods.addSection = function(sectionData) {
  this.sections.push({
    ...sectionData,
    sectionName: sectionData.sectionName.toLowerCase()
  });
  return this.save();
};

pageSchema.methods.updateSection = function(sectionName, updateData) {
  const section = this.getSection(sectionName);
  if (!section) return null;
  
  Object.assign(section, updateData);
  return this.save();
};

pageSchema.methods.deleteSection = function(sectionName) {
  this.sections = this.sections.filter(section => 
    section.sectionName !== sectionName.toLowerCase()
  );
  return this.save();
};

// Static methods
pageSchema.statics.findByPageName = function(pageName) {
  return this.findOne({ 
    pageName: pageName.toLowerCase(), 
    isActive: true 
  });
};

pageSchema.statics.findSectionByPageAndSection = function(pageName, sectionName) {
  return this.aggregate([
    { 
      $match: { 
        pageName: pageName.toLowerCase(), 
        isActive: true 
      } 
    },
    { $unwind: '$sections' },
    { 
      $match: { 
        'sections.sectionName': sectionName.toLowerCase(),
        'sections.isActive': true 
      } 
    },
    {
      $project: {
        _id: 0,
        pageName: 1,
        pageTitle: 1,
        section: '$sections'
      }
    }
  ]);
};

module.exports = mongoose.model('Page', pageSchema);
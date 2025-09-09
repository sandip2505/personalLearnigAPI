const mongoose = require('mongoose');

// Base component schema for reusable elements
const ComponentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['hero', 'features', 'courses', 'teachers', 'testimonials', 'cta', 'stats', 'gallery', 'faq', 'contact', 'custom']
  },
  title: String,
  subtitle: String,
  description: String,
  order: {
    type: Number,
    default: 0
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  // Dynamic content based on component type
  content: {
    // Hero Section
    hero: {
      backgroundImage: String,
      backgroundVideo: String,
      mainHeading: String,
      subHeading: String,
      buttonText: String,
      buttonLink: String,
      secondaryButtonText: String,
      secondaryButtonLink: String,
      overlay: {
        enabled: Boolean,
        color: String,
        opacity: Number
      }
    },
    
    // Features Section
    features: [{
      icon: String,
      title: String,
      description: String,
      link: String,
      color: String
    }],
    
    // Courses Section
    courses: [{
      id: String,
      title: String,
      description: String,
      instructor: {
        name: String,
        avatar: String,
        title: String
      },
      thumbnail: String,
      price: {
        current: Number,
        original: Number,
        currency: String
      },
      duration: String,
      level: String,
      rating: Number,
      studentsCount: Number,
      lessons: Number,
      category: String,
      tags: [String],
      link: String
    }],
    
    // Teachers Section
    teachers: [{
      id: String,
      name: String,
      title: String,
      bio: String,
      avatar: String,
      specialization: [String],
      experience: String,
      rating: Number,
      studentsCount: Number,
      coursesCount: Number,
      social: {
        linkedin: String,
        twitter: String,
        facebook: String,
        instagram: String
      }
    }],
    
    // Testimonials Section
    testimonials: [{
      id: String,
      name: String,
      title: String,
      company: String,
      avatar: String,
      rating: Number,
      comment: String,
      course: String,
      date: Date
    }],
    
    // Call to Action Section
    cta: {
      backgroundImage: String,
      backgroundColor: String,
      heading: String,
      description: String,
      buttonText: String,
      buttonLink: String,
      buttonStyle: String,
      textColor: String
    },
    
    // Stats Section
    stats: [{
      label: String,
      value: String,
      icon: String,
      suffix: String,
      description: String
    }],
    
    // Gallery Section
    gallery: [{
      image: String,
      title: String,
      description: String,
      category: String
    }],
    
    // FAQ Section
    faq: [{
      question: String,
      answer: String,
      category: String
    }],
    
    // Contact Section
    contact: {
      heading: String,
      description: String,
      email: String,
      phone: String,
      address: String,
      mapUrl: String,
      socialLinks: [{
        platform: String,
        url: String,
        icon: String
      }]
    },
    
    // Custom HTML/Content
    custom: {
      html: String,
      css: String,
      javascript: String
    }
  },
  
  // Styling options
  styling: {
    backgroundColor: String,
    textColor: String,
    padding: {
      top: String,
      bottom: String,
      left: String,
      right: String
    },
    margin: {
      top: String,
      bottom: String
    },
    customCSS: String,
    containerClass: String,
    sectionClass: String
  },
  
  // SEO and Meta
  seo: {
    title: String,
    description: String,
    keywords: [String],
    ogImage: String
  }
}, {
  timestamps: true
});

// Main Page Schema
const PageSchema = new mongoose.Schema({
  // Page identification
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  
  // Page status
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  
  // Page type
  pageType: {
    type: String,
    enum: ['homepage', 'about', 'courses', 'contact', 'blog', 'custom'],
    default: 'homepage'
  },
  
  // Header configuration
  header: {
    logo: String,
    navigation: [{
      label: String,
      url: String,
      order: Number,
      isExternal: Boolean,
      children: [{
        label: String,
        url: String,
        description: String
      }]
    }],
    ctaButton: {
      text: String,
      url: String,
      style: String
    },
    sticky: Boolean,
    transparent: Boolean
  },
  
  // Dynamic sections
  sections: [ComponentSchema],
  
  // Footer configuration
  footer: {
    logo: String,
    description: String,
    columns: [{
      title: String,
      links: [{
        label: String,
        url: String,
        isExternal: Boolean
      }]
    }],
    socialLinks: [{
      platform: String,
      url: String,
      icon: String
    }],
    copyright: String,
    bottomLinks: [{
      label: String,
      url: String
    }]
  },
  
  // Global SEO settings
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String,
    ogTitle: String,
    ogDescription: String,
    twitterCard: String,
    canonicalUrl: String,
    robots: String,
    schema: mongoose.Schema.Types.Mixed // For structured data
  },
  
  // Global styling
  globalStyling: {
    primaryColor: String,
    secondaryColor: String,
    fontFamily: String,
    customCSS: String,
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    }
  },
  
  // Analytics and tracking
  analytics: {
    googleAnalytics: String,
    facebookPixel: String,
    customScripts: [{
      name: String,
      code: String,
      position: {
        type: String,
        enum: ['head', 'body_start', 'body_end']
      }
    }]
  },
  
  // Version control
  version: {
    type: Number,
    default: 1
  },
  publishedAt: Date,
  
  // User management
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better performance
PageSchema.index({ slug: 1 });
PageSchema.index({ status: 1 });
PageSchema.index({ pageType: 1 });
PageSchema.index({ 'sections.type': 1 });
PageSchema.index({ 'sections.order': 1 });

module.exports = mongoose.model('NewPage', PageSchema);


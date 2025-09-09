const mongoose = require("mongoose");

const FooterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  about: {
    logoUrl: String,
    description: String,
    visible: { type: Boolean, default: true },
    socialLinks: [
      {
        platform: String,
        link: String,
        iconClass: String,
        visible: { type: Boolean, default: true },
      },
    ],
  },
  companyName: { type: String, default: '' },
  companyLinks: [
    {
      name: String,
      link: String,
      visible: { type: Boolean, default: true },
    },
  ],
  platformName: { type: String, default: '' },
  platformLinks: [
    {
      name: String,
      link: String,
      visible: { type: Boolean, default: true },
    },
  ],
  formName: { type: String, default: '' },
  subscription: {
    placeholder: String,
    infoText: String,
    visible: { type: Boolean, default: true },
  },
  copyright: {
    text: String,
    visible: { type: Boolean, default: true },
  },
  visible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Footer", FooterSchema);

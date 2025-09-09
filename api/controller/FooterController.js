const { name } = require('browser-sync');
const Footer = require('../model/Footer');
const path = require('path');
const fs = require('fs');
const FooterController = {};

FooterController.getFooter = async (req, res) => {
  try {
    const footers = await Footer.find()
    res.status(200).json(footers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching footer', error });
  }
};

FooterController.activeFooter = async (req, res) => {
  try {
    const footers = await Footer.findOne({ visible: true });
    res.status(200).json(footers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching footer', error });
  }
};


FooterController.createFooter = async (req, res) => {
  console.log(req.body, "Create API call");
  try {

    const body = req.body;
    const footerData = {
      visible: body.visible === 'on',
      name: body.name || '',
      platformName: body.platformName || '',
      companyName: body.companyName || '',
      formName: body.formName || '',
      about: {
        logoUrl: body.logoUrl || null,
        description: body['about[description]'] || '',
        visible: body['about[visible]'] === 'on',
        socialLinks: [],
      },

      companyLinks: [],
      platformLinks: [],

      subscription: {
        placeholder: body['subscription[placeholder]'] || '',
        infoText: body['subscription[infoText]'] || '',
        visible: body['subscription[visible]'] === 'on',
      },

      copyright: {
        text: body['copyright[text]'] || '',
        visible: body['copyright[visible]'] === 'on',
      }
    };

    // Manually loop socialLinks[0], [1], etc.
    let index = 0;
    while (body[`about[socialLinks][${index}][platform]`]) {
      footerData.about.socialLinks.push({
        platform: body[`about[socialLinks][${index}][platform]`] || '',
        link: body[`about[socialLinks][${index}][link]`] || '',
        iconClass: body[`about[socialLinks][${index}][iconClass]`] || '',
        visible: body[`about[socialLinks][${index}][visible]`] === 'on',
      });
      index++;
    }

    // companyLinks
    index = 0;
    while (body[`companyLinks[${index}][name]`]) {
      footerData.companyLinks.push({
        name: body[`companyLinks[${index}][name]`] || '',
        link: body[`companyLinks[${index}][link]`] || '',
        visible: body[`companyLinks[${index}][visible]`] === 'on',
      });
      index++;
    }

    // platformLinks
    index = 0;
    while (body[`platformLinks[${index}][name]`]) {
      footerData.platformLinks.push({
        name: body[`platformLinks[${index}][name]`] || '',
        link: body[`platformLinks[${index}][link]`] || '',
        visible: body[`platformLinks[${index}][visible]`] === 'on',
      });
      index++;
    }

    const newFooter = new Footer(footerData);
    await newFooter.save();

    res.status(201).json({ message: 'Footer created successfully', footer: newFooter });
  } catch (error) {
    console.error("Footer create error:", error);
    res.status(500).json({ message: "Error creating footer", error });
  }
};


FooterController.editFooter = async (req, res) => {
  try {
    const footer = await Footer.findById(req.params.id);
    if (!footer) {
      return res.status(404).json({ message: 'Footer not found' });
    }
    res.status(200).json(footer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching footer', error });
  }
}

FooterController.updateFooter = async (req, res) => {
  console.log(req.body, "Update API call");
  try {

    const body = req.body;
    const footerData = {
      visible: body.visible === 'on',
      name: body.name || '',
      platformName: body.platformName || '',
      companyName: body.companyName || '',
      formName: body.formName || '',
      about: {
        logoUrl: body.logoUrl || null,
        description: body['about[description]'] || '',
        visible: body['about[visible]'] === 'on',
        socialLinks: [],
      },

      companyLinks: [],
      platformLinks: [],

      subscription: {
        placeholder: body['subscription[placeholder]'] || '',
        infoText: body['subscription[infoText]'] || '',
        visible: body['subscription[visible]'] === 'on',
      },

      copyright: {
        text: body['copyright[text]'] || '',
        visible: body['copyright[visible]'] === 'on',
      }
    };

    // Parse socialLinks
    let index = 0;
    while (body[`about[socialLinks][${index}][platform]`]) {
      footerData.about.socialLinks.push({
        platform: body[`about[socialLinks][${index}][platform]`] || '',
        link: body[`about[socialLinks][${index}][link]`] || '',
        iconClass: body[`about[socialLinks][${index}][iconClass]`] || '',
        visible: body[`about[socialLinks][${index}][visible]`] === 'on',
      });
      index++;
    }

    // Parse companyLinks
    index = 0;
    while (body[`companyLinks[${index}][name]`]) {
      footerData.companyLinks.push({
        name: body[`companyLinks[${index}][name]`] || '',
        link: body[`companyLinks[${index}][link]`] || '',
        visible: body[`companyLinks[${index}][visible]`] === 'on',
      });
      index++;
    }

    // Parse platformLinks
    index = 0;
    while (body[`platformLinks[${index}][name]`]) {
      footerData.platformLinks.push({
        name: body[`platformLinks[${index}][name]`] || '',
        link: body[`platformLinks[${index}][link]`] || '',
        visible: body[`platformLinks[${index}][visible]`] === 'on',
      });
      index++;
    }

    const updatedFooter = await Footer.findByIdAndUpdate(
      req.params.id,
      footerData,
      { new: true }
    );

    if (!updatedFooter) {
      return res.status(404).json({ message: 'Footer not found' });
    }

    res.status(200).json({ message: 'Footer updated successfully', footer: updatedFooter });
  } catch (error) {
    console.error("Footer update error:", error);
    res.status(500).json({ message: "Error updating footer", error });
  }
};

FooterController.deleteFooter = async (req, res) => {
  try {
    const footer = await Footer.findByIdAndDelete(req.params.id);
    if (!footer) {
      return res.status(404).json({ message: 'Footer not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting footer', error });
  }
}

FooterController.getMedia = async (req, res, next) => {
try {
  const uploadsDir = path.join(__dirname, "../../uploads");
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read directory" });
    }

    // Filter only image files
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    const imageUrls = imageFiles.map(file => `/${file}`);
    res.json(imageUrls);
  });
} catch (error) {
    console.error('Error fetching media:', error);
    next(error);
}
}

module.exports = FooterController;

const section = require('../model/Section');

const sectionController = {};

sectionController.getSections = async (req, res) => {
  try {
    const sections = await section.find();
    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
sectionController.createSection = async (req, res) => {
  try {
    console.log(req.body,"req.body|req.body")
    const { name, content, otherData } = req.body;
    const newSection = new section({ name, content, otherData });
    await newSection.save();
    res.status(201).json({ success: true, data: newSection });
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
sectionController.editSection = async (req, res) => {
  try {
    const id = req.params.id;
    const editSection = await section.findById(id);
    if (!editSection) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    res.status(200).json({ success: true, data: editSection });
  } catch (error) {
    console.error('Error editing section:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
sectionController.updateSection = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, content, otherData } = req.body;
    const updatedSection = await section.findByIdAndUpdate(id, { name, content, otherData }, { new: true });
    if (!updatedSection) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    res.status(200).json({ success: true, data: updatedSection });
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
sectionController.deleteSection = async (req, res) => {
  console.log("delete section");
  try {
    const id = req.params.id;
    const deletedSection = await section.findByIdAndDelete(id);
    if (!deletedSection) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    res.status(200).json({ success: true, data: deletedSection });
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}   
module.exports = sectionController;
const pageSection = require('../model/PageSection');
const mongoose = require('mongoose');

const sectionController = {};

sectionController.getPageSections = async (req, res) => {
  try {
    const pageId = req.params.pageId;
    const objectId = new mongoose.Types.ObjectId(pageId);
    const sections = await pageSection.aggregate([
      { $match: { pageId: objectId } },
      {
        $lookup: {
          from: 'sections',
          localField: 'sectionId',
          foreignField: '_id',
          as: 'sectionData'
        }
      },
      { $unwind: '$sectionData' },
      {
        $project: {
          _id: 1,
          pageId: 1,
          sectionId: 1,
          order: 1,
          status: 1,
          sectionName: '$sectionData.name'
        }
      },
      {
        $group: {
          _id: "$pageId",
          sections: {
            $push: {
              _id: "$_id",
              sectionId: "$sectionId",
              order: "$order",
              status: "$status",
              sectionName: "$sectionName"
            }
          }
        }
      },
      { $project: { _id: 1, pageId: "$_id", sections: 1 } }
    ]);
    res.status(200).json({ success: !!sections.length, data: sections && sections.find(() => true) });
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
sectionController.createPageSection = async (req, res) => {
  try {
    const data = req.body.data
    const pageId = req.body.pageId;

    const hasData = await pageSection.countDocuments({ pageId: pageId });
    if (hasData) {
      await pageSection.deleteMany({ pageId: pageId });
    }
    if ((data || Array.isArray(data)) && data.length) {
      await pageSection.insertMany(data);
    }
    res.status(201).json({ success: true, message: 'Page section createed successfully' });
  } catch (error) {
    console.error('Error creating page section:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
sectionController.editPageSection = async (req, res) => {
  try {
    const id = req.params.id;
    const editPageSection = await pageSection.findById(id);
    if (!editPageSection) {
      return res.status(404).json({ success: false, message: 'Page Section not found' });
    }
    res.status(200).json({ success: true, data: editPageSection });
  } catch (error) {
    console.error('Error editing page section:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
sectionController.updatePageSection = async (req, res) => {
  try {
    const id = req.params.id;
    const { pageId, sectionId, order, status } = req.body;
    const updatedPageSection = await pageSection.findByIdAndUpdate(id, { pageId, sectionId, order, status }, { new: true });
    if (!updatedPageSection) {
      return res.status(404).json({ success: false, message: 'Page Section not found' });
    }
    res.status(200).json({ success: true, data: updatedPageSection });
  } catch (error) {
    console.error('Error updating page section:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
sectionController.deletePageSection = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedPageSection = await pageSection.findByIdAndDelete(id);
    if (!deletedPageSection) {
      return res.status(404).json({ success: false, message: 'Page Section not found' });
    }
    res.status(200).json({ success: true, data: deletedPageSection });
  } catch (error) {
    console.error('Error deleting page section:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
module.exports = sectionController;
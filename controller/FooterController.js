const axios = require('axios');
const FooterController = {};

FooterController.getFooter = async (req, res, next) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/footers`);
        res.render('footers', { title: 'Footers', layout: 'partials/layout-vertical', footer: response.data });
    } catch (error) {
        // console.error('Error fetching footer:', error);
        next(error);
    }
}

FooterController.createFooter = async (req, res, next) => {
    console.log("create calling");
    try {
     
        const image = req.files?.['about[logoImage]'] || null;

        if (image) {
            const uploadPath = `uploads/${image.name}`;
            await image.mv(uploadPath); 
            console.log('File moved successfully');
        }
        req.body.logoUrl = image ? image.name : null;
        await axios.post(`${process.env.API_URL}/api/createFooter`, req.body);
        res.redirect('/footers');
    } catch (error) {
        next(error);
    }
}

FooterController.addFooter = async (req, res, next) => {
    try {
        res.render('add-footer', { title: 'Add Footer', layout: 'partials/layout-vertical' });
    } catch (error) {
        next(error);
    }
}

FooterController.editFooter = async (req, res, next) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/editFooter/${req.params.id}`);
        res.render('edit-footer', { title: 'Edit Footer', layout: 'partials/layout-vertical', footerData: response.data });
    } catch (error) {
        next(error);
    }
}

FooterController.updateFooter = async (req, res, next) => {
  console.log("update calling");
  try {
    let logoFilename = req.body['about[logoImage]'] || null;

    const image = req.files?.['about[logoImage]'] || null;

    if (image) {
      logoFilename = `${Date.now()}_${image.name}`; // unique filename
      const uploadPath = `uploads/${logoFilename}`;
      await image.mv(uploadPath);
      console.log('File moved successfully');
    }

    req.body.logoUrl = logoFilename;

    await axios.put(`${process.env.API_URL}/api/updateFooter/${req.params.id}`, req.body);
    res.redirect('/footers');
  } catch (error) {
    next(error);
  }
};


module.exports = FooterController;

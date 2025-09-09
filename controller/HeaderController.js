const axios = require('axios');
 const HeaderController = {};

HeaderController.getHeader = async (req, res, next) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/headers`);
        res.render('headers', { title: 'Headers', layout: 'partials/layout-vertical', header: response.data });
    } catch (error) {
        console.log(error, "Error fetching header");
        next(error);
    }
}

HeaderController.createHeader = async (req, res, next) => {
    console.log("create calling");
    try {
        const image = req.files?.['headerlogo'] || null;
        if (image) {
            const uploadPath = `uploads/${image.name}`;
            await image.mv(uploadPath); 
            console.log('File moved successfully');
        }
        req.body.headerlogo = image ? image.name : null;
        await axios.post(`${process.env.API_URL}/api/createHeader`, req.body);
        res.redirect('/headers');
    } catch (error) {
        next(error);
    }
}

HeaderController.addHeader = async (req, res, next) => {
    try {
        res.render('add-header', { title: 'Add Header', layout: 'partials/layout-vertical' });
    } catch (error) {
        next(error);
    }
}

HeaderController.editHeader = async (req, res, next) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/editHeader/${req.params.id}`);
        res.render('edit-header', { title: 'Edit Header', layout: 'partials/layout-vertical', headerData: response.data });
    } catch (error) {
        next(error);
    }
}
HeaderController.updateHeader = async (req, res, next) => {
    console.log("update calling", req.body);
  try {
    let logoFilename = req.body.currentLogo || null;
    const image = req.files?.['headerlogo'] || null;
        if (image) {
            const uploadPath = `uploads/${image.name}`;
            await image.mv(uploadPath); 
            console.log('File moved successfully');
        }
        req.body.headerlogo = image ? image.name : logoFilename;
        await axios.put(`${process.env.API_URL}/api/updateHeader/${req.params.id}`, req.body);
        res.redirect('/headers');
  } catch (error) {
    next(error);
  }
}

module.exports = HeaderController;

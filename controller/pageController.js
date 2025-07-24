const axios = require('axios');




const pageController = {}

pageController.getPage = async (req, res, next) => {
    const pages = await axios.get(`${process.env.API_URL}/api/pages`);
    console.log(pages.data);
    res.render('pages', { title: 'Pages', layout: 'partials/layout-vertical', pages: pages.data.data });
};
pageController.addPage = async (req, res, next) => {

    res.render('add-page', { title: 'Add Page', layout: 'partials/layout-vertical' });
};
pageController.addpageData = async (req, res, next) => {
    try {


        const pageData = await axios.post(`${process.env.API_URL}/api/pages`, req.body);
        console.log('Page data added successfully:', pageData.data);
        res.redirect('/pages');
    } catch (error) {
        console.error('Error adding page data:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }

};

module.exports = pageController;
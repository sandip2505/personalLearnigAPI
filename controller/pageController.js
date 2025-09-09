const axios = require('axios');
const pageController = {}

pageController.getPage = async (req, res, next) => {
    const pages = await axios.get(`${process.env.API_URL}/api/pages`);
    res.render('pages', { title: 'Pages', layout: 'partials/layout-vertical', pages: pages.data.data });
};
pageController.addPage = async (req, res, next) => {

    res.render('add-page', { title: 'Add Page', layout: 'partials/layout-vertical' });
};
pageController.setPageSection = async (req, res, next) => {
    try {
        res.render("select-page-section", { title: 'Select Page Section', layout: 'partials/layout-vertical' })
    } catch (error) {
        console.error('Error setting page section:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
pageController.addpageData = async (req, res, next) => {
    try {
        const { name, slug, metadata } = req.body;
        const pageData = await axios.post(`/api/createPage`, { name, slug, metadata });
        console.log('Page data added successfully:', JSON.stringify(pageData));
        res.redirect('/pages');
    } catch (error) {
        console.error('Error adding page data:', error.message);
        return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
};

pageController.addsection = async (req, res, next) => {
    const sections = await axios.get(`${process.env.API_URL}/api/sections`);
    res.render('sections', { title: 'Sections', layout: 'partials/layout-vertical', sections: sections.data.data });
};

pageController.section = async (req, res, next) => {
    const pages = await axios.get(`${process.env.API_URL}/api/pages`);
    res.render('section', { title: 'Section', layout: 'partials/layout-vertical', pages: pages.data.data });
};

pageController.addPagesection = async (req, res, next) => {
    try {
        const pages = await axios.get(`${process.env.API_URL}/api/pages`);
        res.render('add-section', { title: 'Add Page Section', layout: 'partials/layout-vertical', pages: pages.data.data });
    } catch (error) {
        console.error('Error adding page section:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });

    }
}
pageController.createPagesection = async (req, res, next) => {
    try {
        const { name, content } = req.body;
        const pageSectionData = await axios.post(`${process.env.API_URL}/api/createSection`, { name, content });
        console.log('Page section data added successfully:', JSON.stringify(pageSectionData.data));
        res.redirect('/sections');
    } catch (error) {
        console.error('Error adding page section data:', error.message);
        return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
}

pageController.editSection = async (req, res, next) => {
    try {
        const id = req.params.id;
        const sectionData = await axios.get(`${process.env.API_URL}/api/editSection/${id}`);
        if (!sectionData.data.success) {
            return res.status(404).json({ success: false, message: 'Section not found' });
        }
        res.render('edit-section', { title: 'Edit Section', layout: 'partials/layout-vertical', section: sectionData.data.data });
    } catch (error) {
        console.error('Error editing section:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

pageController.updateSection = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { name, content } = req.body;
        const updatedSection = await axios.put(`${process.env.API_URL}/api/updateSection/${id}`, { name, content });
        if (!updatedSection.data.success) {
            return res.status(404).json({ success: false, message: 'Section not found' });
        }
        res.redirect('/sections');
    } catch (error) {
        console.error('Error updating section:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

pageController.pageSection = async (req, res, next) => {
    try {
        const pageSections = await axios.get(`${process.env.API_URL}/api/pageSections`);
        const pages = await axios.get(`${process.env.API_URL}/api/pages`);
        const sections = await axios.get(`${process.env.API_URL}/api/sections`);
        res.render('page-section', { title: 'Page Sections', layout: 'partials/layout-vertical', pageSections: pageSections.data.data, pages: pages.data.data, sections: sections.data.data });
    } catch (error) {
        console.error('Error fetching page sections:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

pageController.getAddPageSection = async (req, res, next) => {
    try {
        const pageId = req.params.id;
        const pages = await axios.get(`${process.env.API_URL}/api/editPage/${pageId}`);
        const pageName = pages.data.data.name;
        const sections = await axios.get(`${process.env.API_URL}/api/sections`);
        let pageSections = await axios.get(`${process.env.API_URL}/api/pageSection/${pageId}`);

        if (pageSections.data.success) {
            pageSections = pageSections.data.data.sections.map(section => ({
                id: section.sectionId,
                name: section.sectionName,
                order: section.order,
                status: section.status,
            }))
        } else {
            pageSections = [];
        }

        res.render('add-page-section',
            {
                title: 'Add Page Section',
                layout: 'partials/layout-vertical',
                pageName,
                sections: sections.data.data,
                pageSections: pageSections || []
            });
    } catch (error) {
        console.error('Error fetching add page section:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

pageController.setAddPageSection = async (req, res, next) => {
    try {
        const pageId = req.body.pageId;
        const data = Array.isArray(req.body.sections) && req.body.sections.map(section => ({
            pageId: req.body.pageId,
            sectionId: section.id,
            order: section.order,
            status: section.status || 'active',
        }))
        await axios.post(`${process.env.API_URL}/api/createPageSection`, {
            data,
            pageId
        });
        res.redirect(`/add-page-section/${pageId}`);

    } catch (error) {
        console.error('Error setting add page section:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

pageController.newPageSection = async (req, res, next) => {
    try {
        res.render('add-new-page', { title: 'New Page Section', layout: 'partials/layout-vertical' });
    } catch (error) {
        console.error('Error rendering new page section:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
module.exports = pageController;
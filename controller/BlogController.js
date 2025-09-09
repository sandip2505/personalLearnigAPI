const axios = require('axios');
const fs = require('fs-extra');
const blogController = {}



blogController.getBlogs = async (req, res, next) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/blogs`);
        console.log(response.data);
        res.render('blogs', { title: 'Blogs', layout: 'partials/layout-vertical', blogs: response.data });
    } catch (error) {
        next(error);
    }
}

blogController.getBlogById = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const response = await axios.get(`${process.env.API_URL}/api/editBlog/${blogId}`);
        if (!response.data) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        console.log(response.data);
        res.render('blog-details', { title: 'Blog Details', layout: 'partials/layout-vertical', blog: response.data });
    } catch (error) {
        console.error('Error fetching blog by ID:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
blogController.addBlog = async (req, res, next) => {
    try {
        const categories = await axios.get(`${process.env.API_URL}/api/blogCategories`);
        res.render('add-blog', { title: 'Add Blog', layout: 'partials/layout-vertical', categories: categories.data });
    } catch (error) {
        next(error);
    }
}
blogController.createBlog = async (req, res, next) => {
    try {
        const image = req.files?.featuredImage || null;

        if (image) {
            const uploadPath = `uploads/${image.name}`;
            await image.mv(uploadPath);
            console.log('File moved successfully');
        }

        const {
            title,
            slug,
            isPublished,
            content,
            categories,
            metaTitle,
            metaDescription,
            metaKeywords,
            canonicalUrl,
        } = req.body;
        const response = await axios.post(`${process.env.API_URL}/api/createBlog`, {
            title,
            slug,
            isPublished,
            content,
            categories,
            metaTitle,
            metaDescription,
            metaKeywords,
            canonicalUrl,
            featuredImage: image ? image.name : null,
        });

        res.redirect('/blogs');
    } catch (error) {
        console.error('Error creating blog:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
};

blogController.editBlog = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const response = await axios.get(`${process.env.API_URL}/api/editBlog/${blogId}`);
        if (!response.data) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.render('edit-blog', { title: 'Edit Blog', layout: 'partials/layout-vertical', blog: response.data });
    } catch (error) {
        console.error('Error fetching blog for edit:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
blogController.updateBlog = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const { title, content, category, author } = req.body;
        const response = await axios.put(`${process.env.API_URL}/api/blogs/${blogId}`, { title, content, category, author });
        if (!response.data) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        console.log('Blog updated successfully:', response.data);
        res.redirect('/blogs');
    } catch (error) {
        console.error('Error updating blog:', error.message);
        return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
}


module.exports = blogController;
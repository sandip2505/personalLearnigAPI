const Blog = require('../model/Blog');
const Category = require('../model/Category');
const User = require('../model/User');

const BlogController = {}

// Get all blogs
BlogController.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blogs', error });
    }
}
// Create a new blog
BlogController.createBlog = async (req, res) => {
    try {
        const { title, slug, isPublished, content, categories, metaTitle, metaDescription, metaKeywords, canonicalUrl, featuredImage } = req.body;
        const newBlog = new Blog({
            title, slug, isPublished, content, categories, metaTitle, metaDescription, metaKeywords, canonicalUrl, featuredImage
        });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'Error creating blog', error });
    }
}

// Edit a blog
BlogController.editBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog', error });
    }
}
// Update a blog
BlogController.updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        let featuredImage = req.body.featuredImage;

        // Handle file upload if present
        if (req.files && req.files.featuredImage) {
            const image = req.files.featuredImage;
            const uploadPath = `uploads/${image.name}`;
            await image.mv(uploadPath);
            featuredImage = image.name;
            console.log('File moved successfully');
        }

        const { title, content, metaTitle, metaDescription, metaKeywords, slug, isPublished } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
            title,
            content,
            featuredImage,
            metaTitle,
            metaDescription,
            metaKeywords,
            slug,
            isPublished
            },
            { new: true }
        );
        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        console.log('Blog updated successfully:', updatedBlog);
        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: 'Error updating blog', error });
    }
}

// Delete a blog
BlogController.deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const deletedBlog = await Blog.findByIdAndDelete(blogId);
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog', error });
    }
}

module.exports = BlogController;

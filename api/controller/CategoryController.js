const category = require('../model/Category');

const CategoryController = {};

// Get all categories
CategoryController.getCategories = async (req, res) => {
    try {
        const categories = await category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
}
// Create a new category
CategoryController.createCategory = async (req, res) => {
    try {
        const { name, slug, description, metaTitle, metaDescription, metaKeywords } = req.body;
        const newCategory = new category({
            name,
            slug,
            description,
            metaTitle,
            metaDescription,
            metaKeywords,
        });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error });
    }
}
// Edit a category
CategoryController.editCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categoryData = await category.findById(categoryId);
        if (!categoryData) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(categoryData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error });
    }
}
// Update a category
CategoryController.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name, slug, description, metaTitle, metaDescription, metaKeywords, canonicalUrl, image } = req.body;
        const updatedCategory = await category.findByIdAndUpdate(categoryId, {
            name,
            slug,
            description,
            metaTitle,
            metaDescription,
            metaKeywords,
            canonicalUrl,
            image
        }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error });
    }
}
// Delete a category
CategoryController.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error });
    }
}   
module.exports = CategoryController;
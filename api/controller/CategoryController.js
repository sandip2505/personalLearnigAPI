const categoryModel = require('../model/Category');

const CategoryController = {};

// Create a new category
CategoryController.createCategory = async (req, res) => {
    try {
        const { name, parentId } = req.body;
        const newCategory = new categoryModel({ name, parentId });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all categories
CategoryController.getCategories = async (req, res) => {
    try {
        const categories = await categoryModel
            .find()
            .populate("parentId", "name"); 

        const formattedCategories = categories.map(cat => ({
            _id: cat._id,
            name: cat.name,
            parentId: cat.parentId?._id || null,
            parentCategoryName: cat.parentId?.name || null,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt
        }));

        res.status(200).json(formattedCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get a single category by ID
CategoryController.getCategoryById = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id).populate('parentId', 'name');
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a category
CategoryController.updateCategory = async (req, res) => {
    try {
        const { name, parentId } = req.body;
        const updatedCategory = await categoryModel.findByIdAndUpdate(
            req.params.id,
            { name, parentId },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a category
CategoryController.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await categoryModel.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = CategoryController;
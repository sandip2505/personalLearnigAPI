const axios = require('axios');

const CategoryController ={};

CategoryController.addCategory = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const response = await axios.get(`${process.env.API_URL}/api/categories`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        res.render('add-category', { title: 'Add Category', layout: 'partials/layout-vertical', categories: response.data });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Internal Server Error');
    }
};

CategoryController.createCategory = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        await axios.post(`${process.env.API_URL}/api/createCategory`, req.body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        res.redirect('/categories');
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).send('Internal Server Error');
    }
};

CategoryController.getCategories = async (req, res) => {
    const token = req.session.token || req.cookies.token;
    try {
        const response = await axios.get(`${process.env.API_URL}/api/categories`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response.data);
        res.render('categories', { title: 'Categories', layout: 'partials/layout-vertical', categories: response.data });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Internal Server Error');
    }
};

CategoryController.editCategory = async (req, res) => {
    try {
        const [allCategoriesResponse, categoryResponse] = await Promise.all([
            axios.get(`${process.env.API_URL}/api/categories`),
            axios.get(`${process.env.API_URL}/api/category/${req.params.id}`)
        ]);
        res.render('edit-category', { title: 'Edit Category', layout: 'partials/layout-vertical', categories: allCategoriesResponse.data, categoryData: categoryResponse.data });
    } catch (error) {
        console.error('Error fetching category data:', error);
        res.status(500).send('Internal Server Error');
    }
};

CategoryController.updateCategory = async (req, res) => {
    try {
        await axios.put(`${process.env.API_URL}/api/updateCategory/${req.params.id}`, req.body);
        res.redirect('/categories');
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).send('Internal Server Error');
    }
};

CategoryController.deleteCategory = async (req, res) => {
    try {
        await axios.delete(`${process.env.API_URL}/api/deleteCategory/${req.params.id}`);
        res.redirect('/categories');
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = CategoryController;
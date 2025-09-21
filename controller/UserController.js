const axios = require('axios');
const { mediaApi } = require('../utils/storeMedia');
const UserController = {};




UserController.login = (req, res) => {
    res.render('auth-login', { title: 'Login', layout: 'partials/layout-auth' });
};

UserController.verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const response = await axios.post(`${process.env.API_URL}/api/login`, { email, password });
        console.log(response.data.token, "Token from API");

        if (response.data && response.data.token) {
            // Store token in session (for server-side access)
            req.session.token = response.data.token;

            // ALSO store token in cookie (for auth middleware)
            res.cookie('token', response.data.token, {
                httpOnly: true,      // Secure - can't be accessed via JavaScript
                secure: process.env.NODE_ENV === 'production', // Only over HTTPS in production
                maxAge: 60 * 60 * 1000  // 1 hour (same as JWT expiry)
            });

            return res.redirect('/');
        } else {
            return res.status(401).render('auth-login', {
                title: 'Login',
                layout: 'partials/layout-auth',
                error: 'Invalid credentials'
            });
        }
    } catch (error) {
        console.error('Login error from api', error.message);
        return res.status(500).render('auth-login', {
            title: 'Login',
            layout: 'partials/layout-auth',
            error: 'An error occurred during login'
        });
    }
};

UserController.logout = (req, res) => {
    req.session.destroy();
    res.clearCookie('token');
    res.redirect('/login');
};

UserController.dashboard = (req, res) => {
    const token = req.session.token || req.cookies.token;

    console.log(token, "User info in session");
    res.render('index', { title: 'Dashboard', layout: 'partials/layout-vertical' });
}

UserController.getUsers = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/users`);
        res.render('users', { title: 'Users', layout: 'partials/layout-vertical', users: response.data });
    } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);

        return res.status(500).render('error', {
            title: "Error",
            message: "Error fetching users",
            error: error.response?.data || error.message
        });
    }
}

UserController.addUser = async (req, res) => {
    try {
        const roleResponse = await axios.get(`${process.env.API_URL}/api/roles`);
        res.render('add-user', { title: 'Add User', layout: 'partials/layout-vertical', roles: roleResponse.data });
    } catch (error) {
        console.error('Error rendering add user page:', error);
        res.status(500).send('Error rendering add user page');
    }
}

UserController.createUser = async (req, res) => {
    try {
        const { name, username, email, password, role } = req.body;
        const image = req.files?.profileImage || null;

        let profileImage = null;
        if (image) {
            console.log(image, "Image in create user");
            // Convert multer file object to Buffer for mediaApi
            const fileBuffer = image.buffer || image.data;
            const uploadedImage = await mediaApi.uploadSingle(fileBuffer, {
                fileName: image.originalname || `profile_${Date.now()}.jpg`
            });
            profileImage = uploadedImage.data.path;
        }

        const newUser = {
            name,
            username,
            email,
            password, // Ensure to hash the password before saving in production
            profileImage,
            role
        };

        await axios.post(`${process.env.API_URL}/api/createUser`, newUser);
        res.redirect('/users');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
}

UserController.editUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userResponse = await axios.get(`${process.env.API_URL}/api/editUser/${userId}`);
        const roleResponse = await axios.get(`${process.env.API_URL}/api/roles`);
        console.log(userResponse.data);
        res.render('edit-user', { title: 'Edit User', layout: 'partials/layout-vertical', user: userResponse.data, roles: roleResponse.data });
    } catch (error) {
        return res.status(500).render('error', {
            title: "Error",
            message: "Error fetching users",
            error: error.response?.data || error.message
        });
    }
}

UserController.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, username, email, existingImage, role } = req.body;
        const image = req.files?.profileImage || null;

        let profileImage;
        if (image) {
            console.log(image, "Image in update user");
            // Convert multer file object to Buffer for mediaApi
            const fileBuffer = image.buffer || image.data;
            const uploadedImage = await mediaApi.uploadSingle(fileBuffer, {
                fileName: image.originalname || `profile_${Date.now()}.jpg`
            });
            console.log(uploadedImage, "Uploaded image in update user");
            profileImage = uploadedImage.file.path;
        } else {
            profileImage = existingImage || null;
        }

        const updatedUser = {
            name,
            username,
            email,
            profileImage,
            role
        };

        await axios.put(`${process.env.API_URL}/api/updateUser/${userId}`, updatedUser);
        res.redirect('/users');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
}
UserController.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await axios.delete(`${process.env.API_URL}/api/deleteUser/${userId}`);
        res.redirect('/users');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
}

module.exports = UserController;
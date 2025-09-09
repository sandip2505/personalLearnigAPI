const user = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const UserController = {};

// Get all users
UserController.getUsers = async (req, res) => {
    try {
        const users = await user.find().select('-password').populate('role_id', 'name'); 
        console.log(users, "Fetched users");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
}
// Create a new user
UserController.createUser = async (req, res) => {
    try {
        const { name, username, email, password, profileImage, role } = req.body;

        const newUser = new user({
            name,
            username,
            email,
            password: password,
            profileImage,
            role
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
}

// Edit a user
UserController.editUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = await user.findById(userId).select('-password'); // Exclude password
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
}
// Update a user
UserController.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, username, email, profileImage, role } = req.body;
        const updatedUser = await user.findByIdAndUpdate(userId, {
            name,
            username,
            email,
            profileImage,
            role
        }, { new: true }).select('-password'); // Exclude password
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
}
// Delete a user
UserController.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await user.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
}
// User login
UserController.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const foundUser = await user.findOne({ email }).select('+password');

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        console.log(foundUser, "Found user details");
        const token = jwt.sign(
            { id: foundUser._id, email: foundUser.email, role_id: foundUser.role_id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" });

        res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
}


// User registration
UserController.register = async (req, res) => {

    try {
        const { name, username, email, password, role_id } = req.body;
        const existingUser = await user.findOne({ email });
        console.log(existingUser, "Existing user check");
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const newUser = new user({ name, username, email, password: password, role_id });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
}


module.exports = UserController;
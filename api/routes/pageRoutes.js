const express = require('express');
const UserController = require('../controller/UserController');
const RolePermissionController = require('../controller/RolePermissionController');
const CategoryController = require('../controller/CategoryController');
const { verifyToken, checkPermission } = require("../../middlewere/authMiddleware");



const router = express.Router();

// Define routes for user operations
router.get('/users', verifyToken, checkPermission(['view_users']), UserController.getUsers);
router.post('/createUser', verifyToken, checkPermission(['create_users']), UserController.createUser);
router.get('/editUser/:id', verifyToken, checkPermission(['update_users']), UserController.editUser);
router.put('/updateUser/:id', verifyToken, checkPermission(['update_users']), UserController.updateUser);
router.delete('/deleteUser/:id', verifyToken, checkPermission(['delete_users']), UserController.deleteUser);

// Define routes for authentication
router.post('/login', UserController.login);
router.post('/register', UserController.register);


// Role API routes
router.get('/roles', RolePermissionController.getRoles);
router.post('/createRole', RolePermissionController.createRole);
router.get('/editRole/:id', RolePermissionController.editRole);
router.put('/updateRole/:id', RolePermissionController.updateRole);
router.delete('/deleteRole/:id', RolePermissionController.deleteRole);
router.get('/rolePermissions/:id', RolePermissionController.getRolePermissionsByRoleId);

// Permissions API routes
router.get('/permissions', RolePermissionController.getPermissions);
router.post('/createPermission', RolePermissionController.createPermission);
router.get('/editPermission/:id', RolePermissionController.editPermission);
router.put('/updatePermission/:id', RolePermissionController.updatePermission);
router.delete('/deletePermission/:id', RolePermissionController.deletePermission);

// Role-Permission API routes
router.get('/rolePermissions', RolePermissionController.getRolePermissions);
router.post('/createRolePermission', RolePermissionController.createRolePermission);
router.get('/editRolePermission/:id', RolePermissionController.editRolePermission);
router.put('/updateRolePermission/:id', RolePermissionController.updateRolePermission);
router.delete('/deleteRolePermission/:id', RolePermissionController.deleteRolePermission);
router.get('/findbyrole/:id', RolePermissionController.findByRoleId);


// Role-Permission Category API
router.post('/createCategory', verifyToken, checkPermission(['create_categories']), CategoryController.createCategory);
router.get('/categories', verifyToken, checkPermission(['view_categories']), CategoryController.getCategories);
router.get('/category/:id', verifyToken, checkPermission(['view_categories']), CategoryController.getCategoryById);
router.put('/updateCategory/:id', verifyToken, checkPermission(['update_categories']), CategoryController.updateCategory);
router.delete('/deleteCategory/:id', verifyToken, checkPermission(['delete_categories']), CategoryController.deleteCategory);



// router.get('/insertmany', RolePermissionController.insertMany);

module.exports = router;
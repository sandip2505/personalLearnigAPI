const express = require('express');
const PageController = require('../controller/pageController');
const SectionController = require('../controller/SectionController');
const PageSectionController = require('../controller/PageSectionController');
const BlogController = require('../controller/BlogController');
const CategoryController = require('../controller/CategoryController');
const UserController = require('../controller/UserController');
const SliderController = require('../controller/SliderController');
const FooterController = require('../controller/FooterController');
const HeaderController = require('../controller/HeaderController');
const RolePermissionController = require('../controller/RolePermissionController');
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

// Define routes for page operations
router.get('/pages', PageController.getPages);
router.post('/createPage', PageController.createPage);
router.get('/editPage/:id', PageController.editPage);
router.put('/updatePage/:id', PageController.updatePage);
router.delete('/deletePage/:id', PageController.deletePage);

// define routes for sections
router.get('/sections', SectionController.getSections);
router.post('/createSection', SectionController.createSection);
router.get('/editSection/:id', SectionController.editSection);
router.put('/updateSection/:id', SectionController.updateSection);
router.delete('/deleteSection/:id', SectionController.deleteSection);

// define routes for page sections
router.get('/pageSection/:pageId', PageSectionController.getPageSections);
router.post('/createPageSection', PageSectionController.createPageSection);
router.get('/editPageSection/:id', PageSectionController.editPageSection);
router.put('/updatePageSection/:id', PageSectionController.updatePageSection);
router.delete('/deletePageSection/:id', PageSectionController.deletePageSection);

// define route for blog
router.get('/blogs', BlogController.getBlogs);
router.post('/createBlog', BlogController.createBlog);
router.get('/editBlog/:id', BlogController.editBlog);
router.put('/updateBlog/:id', BlogController.updateBlog);
router.delete('/deleteBlog/:id', BlogController.deleteBlog);

// define route for blog categories
router.get('/blogCategories', CategoryController.getCategories);
router.post('/createCategory', CategoryController.createCategory);
router.get('/editCategory/:id', CategoryController.editCategory);
router.put('/updateCategory/:id', CategoryController.updateCategory);
router.delete('/deleteCategory/:id', CategoryController.deleteCategory);

// Define routes for slider
router.get('/sliders', SliderController.getSliders);
router.post('/createSlider', SliderController.createSlider);
router.get('/editSlider/:id', SliderController.editSlider);
router.put('/updateSlider/:id', SliderController.updateSlider);
router.delete('/deleteSlider/:id', SliderController.deleteSlider);

// Define routes for footer
router.get('/footers', FooterController.getFooter);
router.get('/footer', FooterController.activeFooter);
router.post('/createFooter', FooterController.createFooter);
router.get('/editFooter/:id', FooterController.editFooter);
router.put('/updateFooter/:id', FooterController.updateFooter);
router.delete('/deleteFooter/:id', FooterController.deleteFooter);

// define route for media

router.get('/media', FooterController.getMedia);

// header API routes
router.get('/headers', HeaderController.getHeader);
router.get('/header', HeaderController.activeHeader);
router.post('/createHeader', HeaderController.createHeader);
router.get('/addHeader', HeaderController.addHeader);
router.get('/editHeader/:id', HeaderController.editHeader);
router.put('/updateHeader/:id', HeaderController.updateHeader);

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

// router.get('/insertmany', RolePermissionController.insertMany);

module.exports = router;
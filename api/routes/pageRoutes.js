const express = require('express');
const UserController = require('../controller/UserController');
const RolePermissionController = require('../controller/RolePermissionController');
const CategoryController = require('../controller/CategoryController');
const { verifyToken, checkPermission } = require("../../middlewere/authMiddleware");



const router = express.Router();

// Define routes for user operations
router.get('/users', verifyToken, checkPermission(['user_read']), UserController.getUsers);
router.post('/createUser', verifyToken, checkPermission(['user_create']), UserController.createUser);
router.get('/editUser/:id', verifyToken, checkPermission(['user_update']), UserController.editUser);
router.put('/updateUser/:id', verifyToken, checkPermission(['user_update']), UserController.updateUser);
router.delete('/deleteUser/:id', verifyToken, checkPermission(['user_delete']), UserController.deleteUser);

// Define routes for authentication
router.post('/login', UserController.login);
router.post('/register', UserController.register);


// Role API routes
router.get('/roles', verifyToken, checkPermission(['role_read']), RolePermissionController.getRoles);
router.post('/createRole', verifyToken, checkPermission(['role_create']), RolePermissionController.createRole);
router.get('/editRole/:id', verifyToken, checkPermission(['role_read']), RolePermissionController.editRole);
router.put('/updateRole/:id', verifyToken, checkPermission(['role_update']), RolePermissionController.updateRole);
router.delete('/deleteRole/:id', verifyToken, checkPermission(['role_delete']), RolePermissionController.deleteRole);
router.get('/rolePermissions/:id', verifyToken, checkPermission(['role_read']), RolePermissionController.getRolePermissionsByRoleId);

// Permissions API routes
router.get('/permissions', verifyToken, checkPermission(['permission_read']), RolePermissionController.getPermissions);
router.post('/createPermission', verifyToken, checkPermission(['permission_create']), RolePermissionController.createPermission);
router.get('/editPermission/:id', verifyToken, checkPermission(['permission_read']), RolePermissionController.editPermission);
router.put('/updatePermission/:id', verifyToken, checkPermission(['permission_update']), RolePermissionController.updatePermission);
router.delete('/deletePermission/:id', verifyToken, checkPermission(['permission_delete']), RolePermissionController.deletePermission);

// Role-Permission API routes
router.get('/rolePermissions', verifyToken, checkPermission(['permission_read']), RolePermissionController.getRolePermissions);
router.post('/createRolePermission',  RolePermissionController.createRolePermission);
router.get('/editRolePermission/:id', verifyToken, checkPermission(['permission_read']), RolePermissionController.editRolePermission);
router.put('/updateRolePermission/:id', verifyToken, checkPermission(['permission_update']), RolePermissionController.updateRolePermission);
router.delete('/deleteRolePermission/:id', verifyToken, checkPermission(['permission_delete']), RolePermissionController.deleteRolePermission);
router.get('/findbyrole/:id', verifyToken, checkPermission(['permission_read']), RolePermissionController.findByRoleId);


// Category treated as content for permissions
router.post('/createCategory', verifyToken, checkPermission(['content_create']), CategoryController.createCategory);
router.get('/categories', verifyToken, checkPermission(['content_read']), CategoryController.getCategories);
router.get('/category/:id', verifyToken, checkPermission(['content_read']), CategoryController.getCategoryById);
router.put('/updateCategory/:id', verifyToken, checkPermission(['content_update']), CategoryController.updateCategory);
router.delete('/deleteCategory/:id', verifyToken, checkPermission(['content_delete']), CategoryController.deleteCategory);

// Quiz, Question, Results, Notification routes
const QuizController = require('../controller/QuizController');
const QuestionController = require('../controller/QuestionController');
const QuizResultController = require('../controller/QuizResultController');
const NotificationController = require('../controller/NotificationController');
const CourseController = require('../controller/CourseController');
const LessonController = require('../controller/LessonController');
const EnrollmentController = require('../controller/EnrollmentController');
const PaymentController = require('../controller/PaymentController');
const ReviewController = require('../controller/ReviewController');

// Quizzes
router.post('/quizzes', verifyToken, checkPermission(['content_create']), QuizController.create);
router.get('/quizzes', verifyToken, checkPermission(['content_read']), QuizController.list);
router.get('/quizzes/:id', verifyToken, checkPermission(['content_read']), QuizController.get);
router.put('/quizzes/:id', verifyToken, checkPermission(['content_update']), QuizController.update);
router.delete('/quizzes/:id', verifyToken, checkPermission(['content_delete']), QuizController.remove);

// Questions
router.post('/quizzes/:quizId/questions', verifyToken, checkPermission(['content_create']), QuestionController.create);
router.get('/quizzes/:quizId/questions', verifyToken, checkPermission(['content_read']), QuestionController.listByQuiz);
router.put('/questions/:id', verifyToken, checkPermission(['content_update']), QuestionController.update);
router.delete('/questions/:id', verifyToken, checkPermission(['content_delete']), QuestionController.remove);

// Quiz Results
router.post('/quizzes/:quizId/submit', verifyToken, checkPermission(['content_read']), QuizResultController.submit);
router.get('/quizzes/:quizId/results', verifyToken, checkPermission(['reports_read']), QuizResultController.listByQuiz);

// Notifications
router.post('/notifications', verifyToken, checkPermission(['content_create']), NotificationController.create);
router.get('/users/:userId/notifications', verifyToken, checkPermission(['content_read']), NotificationController.listForUser);
router.put('/notifications/:id/read', verifyToken, checkPermission(['content_update']), NotificationController.markRead);

// Courses
router.post('/courses', verifyToken, checkPermission(['content_create']), CourseController.create);
router.get('/courses', verifyToken, checkPermission(['content_read']), CourseController.list);
router.get('/courses/:id', verifyToken, checkPermission(['content_read']), CourseController.get);
router.put('/courses/:id', verifyToken, checkPermission(['content_update']), CourseController.update);
router.delete('/courses/:id', verifyToken, checkPermission(['content_delete']), CourseController.remove);

// Lessons (Course Content)
router.post('/courses/:courseId/lessons', verifyToken, checkPermission(['content_create']), LessonController.create);
router.get('/courses/:courseId/lessons', verifyToken, checkPermission(['content_read']), LessonController.listByCourse);
router.put('/lessons/:id', verifyToken, checkPermission(['content_update']), LessonController.update);
router.delete('/lessons/:id', verifyToken, checkPermission(['content_delete']), LessonController.remove);

// Enrollments
router.post('/enrollments', verifyToken, checkPermission(['content_read']), EnrollmentController.enroll);
router.get('/courses/:courseId/enrollments', verifyToken, checkPermission(['reports_read']), EnrollmentController.listByCourse);
router.get('/users/:userId/enrollments', verifyToken, checkPermission(['content_read']), EnrollmentController.listByUser);

// Payments
router.post('/payments', verifyToken, checkPermission(['content_read']), PaymentController.create);
router.get('/courses/:courseId/payments', verifyToken, checkPermission(['reports_read']), PaymentController.listByCourse);
router.get('/users/:userId/payments', verifyToken, checkPermission(['reports_read']), PaymentController.listByUser);

// Reviews
router.post('/courses/:courseId/reviews', verifyToken, checkPermission(['content_create']), ReviewController.create);
router.get('/courses/:courseId/reviews', verifyToken, checkPermission(['content_read']), ReviewController.listByCourse);
router.delete('/reviews/:id', verifyToken, checkPermission(['content_delete']), ReviewController.remove);



// router.get('/insertmany', RolePermissionController.insertMany);

module.exports = router;
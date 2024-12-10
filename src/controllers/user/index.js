'user strict';

const router = require('express').Router();
const UserController = require('./user.controller');
const AuthManager = require('../auth/auth.service')


router.get('/get-one', AuthManager.isAuthenticated, AuthManager.isAdmin, UserController.getAdmin)
router.post('/update', AuthManager.isAuthenticated, AuthManager.isAdmin, UserController.updateProfile);
router.post('/user-update', AuthManager.isAuthenticated, UserController.userUpdateProfile);

router.post('/create-user', UserController.createUserProfile);

router.get('/get-user-detail', AuthManager.isAuthenticated, UserController.getUserProfile);

router.get('/get-all-users', AuthManager.isAuthenticated, AuthManager.isAdmin, UserController.getAllUsers);

router.post('/update-user-details', UserController.userUpdateDetails);


router.post('/update-notification', AuthManager.isAuthenticated, UserController.readNotification);

router.get('/get-user', UserController.getUsers);


// ********************User API*******************************

router.post('/create-new-user', AuthManager.isAuthenticated, AuthManager.isAdmin, UserController.createNewUser);

router.get('/get-proflie', AuthManager.isAuthenticated, AuthManager.isAdmin, UserController.getAdminProfile);





module.exports = router;

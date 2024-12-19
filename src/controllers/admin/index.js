'user strict';

const router = require('express').Router();
const AdminController = require('./admin.controller');
const AuthManager = require('../auth/auth.service')



router.post('/create-new-user', AuthManager.isAuthenticated, AuthManager.isAdmin, AdminController.createNewUser);

router.get('/get-dashboard-data',AdminController.getDashboardData);

router.get('/get-proflie', AuthManager.isAuthenticated, AuthManager.isAdmin, AdminController.getAdminProfile);

router.post('/udpate-user-proflie', AuthManager.isAuthenticated, AuthManager.isAdmin, AdminController.updateUserProfile);

// goverment management api for admin
router.post('/create-goverment', AuthManager.isAuthenticated, AuthManager.isAdmin, AdminController.createGovermentAccount);

router.get('/government-accounts', AuthManager.isAuthenticated, AuthManager.isAdmin, AdminController.getAllGovernmentAccounts);

router.put('/government/:governmentId', AuthManager.isAuthenticated, AuthManager.isAdmin, AdminController.updateGovernmentDetails);






module.exports = router;

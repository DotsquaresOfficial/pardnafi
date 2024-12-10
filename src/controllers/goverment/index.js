'user strict';

const router = require('express').Router();
const GovernmentController = require('./government.controller');
const AuthManager = require('../auth/auth.service')


router.get('/government-profile', AuthManager.isAuthenticated, AuthManager.isGoverment, GovernmentController.getGovernmentProfile);

router.put('/profile-update', AuthManager.isAuthenticated, AuthManager.isGoverment, GovernmentController.updateProfile);





module.exports = router;

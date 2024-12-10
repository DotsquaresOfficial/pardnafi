'use strict';

const router = require('express').Router();
const AuthManager = require('./auth.service');
const AuthController = require('./auth.controller');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');


router.post('/register', validate(authValidation.register), AuthController.register);
router.post('/login', validate(authValidation.login), AuthController.login);
router.post('/logout', AuthManager.isAuthenticated, AuthController.logout);
router.post('/forgot-password', validate(authValidation.forgotPassword), AuthController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), AuthController.resetPassword);
router.post('/change-password', validate(authValidation.changePassword), AuthManager.isAuthenticated, AuthController.changePassword);

module.exports = router;
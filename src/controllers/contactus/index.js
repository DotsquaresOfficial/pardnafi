'use strict';

const router = require('express').Router();
const ContactUsController = require('./ContactUs.controller');
const AuthManager = require("../auth/auth.service");

router.post('/contact-us', ContactUsController.ContactUs);
router.get('/get-all-tickets', AuthManager.isAuthenticated, AuthManager.isAdmin, ContactUsController.getAllTickets);
router.get('/get-email', AuthManager.isAuthenticated, AuthManager.isAdmin, ContactUsController.getOne);
router.post('/update-email', AuthManager.isAuthenticated, AuthManager.isAdmin, ContactUsController.updateEmail);
router.get('/remove-email', AuthManager.isAuthenticated, AuthManager.isAdmin, ContactUsController.removeEmail);




module.exports = router;



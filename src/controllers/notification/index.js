'use strict';

const router = require('express').Router();
const NotificationController = require('./notification.controller');
const AuthManager = require('../auth/auth.service');

router.post('/create-notification', AuthManager.isAuthenticated, AuthManager.isAdmin, NotificationController.createNotification);

router.get('/get-all-notification', NotificationController.fetchNotification);

// router.get('/remove-notification', NotificationController.removeOldNotification);

router.post('/update-one', AuthManager.isAuthenticated, AuthManager.isAdmin, NotificationController.upateNotification);

router.post('/remove-one', AuthManager.isAuthenticated, AuthManager.isAdmin, NotificationController.removeNotification);

router.get('/get-one', AuthManager.isAuthenticated, AuthManager.isAdmin, NotificationController.getOne);

router.get('/get-user-notification', NotificationController.getNotifictionForUser);



router.post('/push-notification-to-user', AuthManager.isAuthenticated, AuthManager.isAdmin, NotificationController.postNotificationToAllUsers);

module.exports = router;


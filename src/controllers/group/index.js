'use strict';
const router = require('express').Router();
const groupController = require('./Group.controller');
const AuthManager = require('../../controllers/auth/auth.service');

const validate = require('../../middlewares/validate');
const pageValidation = require('../../validations/page.validation');

router.post('/create-group', AuthManager.isAuthenticated, AuthManager.isAdmin,  groupController.createGroup);
router.get('/get-all-groups', AuthManager.isAuthenticated, AuthManager.isAdmin, groupController.getAllGroups);
router.get('/get-group-by-id', AuthManager.isAuthenticated, AuthManager.isAdmin, groupController.getOne);
router.get('/query-group', AuthManager.isAuthenticated, AuthManager.isAdmin, groupController.getGroupByQuery);
router.post('/update-group', AuthManager.isAuthenticated, AuthManager.isAdmin, groupController.getGroupByQuery);

module.exports = router;



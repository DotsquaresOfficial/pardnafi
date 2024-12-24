'use strict';
const router = require('express').Router();
const FaqsController = require('./Faqs.controller');
const AuthManager = require('../../controllers/auth/auth.service');

const validate = require('../../middlewares/validate');
const pageValidation = require('../../validations/page.validation');

router.post('/create-faqs', AuthManager.isAuthenticated, AuthManager.isAdmin, validate(pageValidation.FaqsContent), FaqsController.CreateFaqs);
router.get('/get-faqs',FaqsController.getAllFaqs);
router.post('/update-faqs', AuthManager.isAuthenticated, AuthManager.isAdmin, FaqsController.updatefaqs);
router.post('/remove-faqs', AuthManager.isAuthenticated, AuthManager.isAdmin, validate(pageValidation.RemoveFaqs), FaqsController.removefaqs);
router.get('/get-one', AuthManager.isAuthenticated, AuthManager.isAdmin, FaqsController.getOne);
router.get('/query-faqs', AuthManager.isAuthenticated, AuthManager.isAdmin, FaqsController.getFaqsByQuery);

/*--------------user api Routes---------------------------*/
router.get('/get-faqs-user', FaqsController.getAllFaqsUser);



module.exports = router;



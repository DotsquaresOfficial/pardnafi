const router = require('express').Router();
const PagesController = require('./Contentpage.controller');
const validate = require('../../middlewares/validate');
const pageValidation = require('../../validations/page.validation');
const AuthManger = require('../../controllers/auth/auth.service')

router.post('/create-page', AuthManger.isAuthenticated, AuthManger.isAdmin, validate(pageValidation.createPageContent), PagesController.createPageContent);

router.get('/get-conent', AuthManger.isAuthenticated, AuthManger.isAdmin, PagesController.fetchContnet);

router.get('/get-all-pages', AuthManger.isAuthenticated, AuthManger.isAdmin, PagesController.getAllPages);

router.post('/update-content', AuthManger.isAuthenticated, AuthManger.isAdmin, PagesController.updateContent);

router.post('/remove-page', AuthManger.isAuthenticated, AuthManger.isAdmin, PagesController.removePage);

router.get('/about-us', PagesController.aboutUs);

router.get('/privacy-policy', PagesController.privacyPolicy);

router.get('/term-condition', PagesController.termAndCondition);






module.exports = router;
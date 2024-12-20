const express = require('express');
const authRoute = require('../../controllers/auth');
const uploadRoutes = require('../../controllers/uploadfile');
const notificationRoute = require('../../controllers/notification');
const faqsRoutes = require('../../controllers/faqs');
const contactUSRoutes = require('../../controllers/contactus');
const contentRoutes = require('../../controllers/pages');
const userRoutes = require('../../controllers/user');
const adminRoutes = require('../../controllers/admin');
const nftRoutes = require('../../controllers/nft');
const governmentRoutes = require('../../controllers/goverment')
const groupRoutes = require('../../controllers/group')
const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/upload',
    route: uploadRoutes,
  },
  {
    path: '/notification',
    route: notificationRoute,
  },
  {
    path: '/faqs',
    route: faqsRoutes,
  },
  {
    path: '/contact',
    route: contactUSRoutes,
  },
  {
    path: '/page',
    route: contentRoutes,
  },
  {
    path: '/group',
    route: groupRoutes,
  },
  {
    path: '/user',
    route: userRoutes
  },
  {
    path: '/admin',
    route: adminRoutes
  },
  {
    path: '/nft',
    route: nftRoutes
  },
  {
    path: '/government',
    route: governmentRoutes
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;

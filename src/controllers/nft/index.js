'user strict';

const router = require('express').Router();
const AuthManager = require('../auth/auth.service')
const NftController = require('../nft/nft-controller')





router.post('/create-nft', NftController.CreateNft);



//admin
router.post('/update-status/:id', AuthManager.isAuthenticated, AuthManager.isAdmin, NftController.apporoveNftStatusForGoverment);

router.get('/approved-nfts', AuthManager.isAuthenticated, AuthManager.isAdmin, NftController.fetchApprovedNfts);

router.get('/unapproved-nfts', AuthManager.isAuthenticated, AuthManager.isAdmin, NftController.unApprovedNfts);


// goverment 

router.post('/goverment-update-status/:id', AuthManager.isAuthenticated, AuthManager.isGoverment, NftController.apporoveNftStatusForFinalProcess);

router.get('/goverment-approved-nfts', AuthManager.isAuthenticated, AuthManager.isGoverment, NftController.fetchApprovedNftsForGoverment);

router.get('/goverment-unapproved-nfts', AuthManager.isAuthenticated, AuthManager.isGoverment, NftController.unApprovedNftsGoverment);






module.exports = router;

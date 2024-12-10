'use strict';

const router = require('express').Router();
const UploadFileController = require("./uploadfile.controller");

router.post("/upload", UploadFileController.doupload);


module.exports = router;
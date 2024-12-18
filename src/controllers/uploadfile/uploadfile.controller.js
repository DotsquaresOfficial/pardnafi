'use strict';

const crypto = require("crypto");
const path = require('path');
const fs = require("fs");
const FormData = require("form-data");
const ApiError = require('../../utils/ApiError')
const httpStatus = require('http-status');

const mimetypes = {
  'image/jpeg': '.jpg',
  'image/x-citrix-jpeg': '.jpg',
  'image/pjpeg': '.pjpeg',
  'image/png': '.png',
  'image/x-citrix-png': '.png',
  'image/x-png': '.png',
  'image/gif': '.gif',

};
/*multer will be used for handling multipart/form-data*/


const multer = require('multer');
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, path.normalize(__dirname + '../../../uploads/images'))
  },
  // ../../../../uploads/images
  filename: function (req, file, cb) {
    cb(null, crypto.randomBytes(16).toString("hex") + '.' + Date.now() + mimetypes[file.mimetype])
  }

});

let upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {

    if (!(file.mimetype in mimetypes)) {
      req.fileValidationError = true;
      return cb(null, false, new Error('Invalid file type'));
    }
    cb(null, true);
  }
});
class UploadFileController {

  static doupload(req, res, next) {
    upload.single('fileInput')(req, res, function (err) {

      if (req.fileValidationError) {//file validation error
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid file type");
      }
      if (err) {
       return    res.json({ "error": err });
      }
      let uploadedFile = req.file;
      delete uploadedFile.destination;
      delete uploadedFile.encoding;
      delete uploadedFile.fieldname;
      delete uploadedFile.path;
      
      uploadedFile["url"] = 'https://pardnafi.24livehost.com' + "/images/" + uploadedFile.filename;
      return res.json({ file: uploadedFile });
    });

  }
}

exports = module.exports = UploadFileController;
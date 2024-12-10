'use strict';

const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { ROLES, UserModel } = require('../../models');
const AuthManager = require('./auth.service');
const crypto = require('crypto');
const Mailer = require('../../services/mail.service');
const async = require('async');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const logger = require('../../config/logger');


const generateRandomNumber = (n = 6) => {
  return Math.floor(Math.random() * (9 * Math.pow(10, n - 1))) + Math.pow(10, n - 1);
}


class AuthController {

  static register = catchAsync(async (req, res, next) => {
    if (!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.password) {
      return res.send({ message: "All feilds are required", success: false, status: 400 })
    }
    const user = await UserModel.findOne({ email: new RegExp(["^", req.body.email, "$"].join(""), "i") });
    if (user) {
      return res.send({ message: "The email address you provided is already associated with an existing account.", success: false, status: 409 })
    }

    let reqbody = req.body;
    await UserModel.create({
      firstName: reqbody.firstName,
      lastName: reqbody.lastName,
      email: reqbody.email,
      password: reqbody.password,
      role: ROLES.ADMIN

    });
    return res.send({ message: "Account Created succssfully", status: 201, success: true })
  });

  static login(req, res, next) {
    return catchAsync(AuthManager.login(req, res, next));
  }


  static logout = catchAsync(async (req, res, next) => {
    return AuthManager.logout(req, res, next);
  })

  static makePassword() {
    var text = "";
    var possible = process.env.PASSWORD_GENERATE_HASH;

    for (var i = 0; i < 7; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  static forgotPassword = catchAsync(async (req, res, next) => {
    async.waterfall([
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          const token = generateRandomNumber()
          done(err, token);
        });
      },
      function (token, done) {
        UserModel.findOne({ email: new RegExp(["^", req.body.email, "$"].join(""), "i") }, function (err, user) {
          if (!user) {
            logger.error(`This email is not registered`);
            return res.send({
              message: 'This email is not registered',
              status: 404,
              data: {}
            });
          }
          user.resetPasswordOtp = parseInt(token);
          user.resetPasswordExpires = Date.now() + 3600000;     // 10 min

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },

      function (token, user, done) {
        let url = process.env.FRONTEND_URL + 'auth/reset-password/' + token;
        let name = user.firstName
        let userName = name[0].toUpperCase() + name.slice(1);
        let html = `<!DOCTYPE html>
        <html>
        <head>
        </head>

        <body style="font-family: Arial; font-size: 12px;">
        <div>
        <p> Hi `+ userName + " " + user.lastName + ` </p>
            <p>
            We have received a request to reset your password. Your reset password link will expire in 10 minutes: <a href="`+ url + `">` + url + ` </a>
          </p>
          <p>  
              If you did not initiate this password request, please ignore this Email and take appropriate measures to secure your account. <br><br>
          </p>
            <p>Best Wishes, <br/>Digital Platfrom</p>
        </div>
        </body>
        </html>`;
        Mailer.sendMail(user.email, 'Reset your password on Digital Platfrom', html, function (err, info) {
          done(err, 'done');
        });
        return res.send({
          message: 'An Email has been sent to  your email ' + user.email + ' with further instructions.',
          success: true,
          status: 201,
          data: ""
        });
      }
    ], function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Message sent');
      }
    });

  })

  static async resetPassword(req, res, next) {
    try {
      const user = await UserModel.findOne({ resetPasswordOtp: req.body.resetPasswordOtp, resetPasswordExpires: { $gt: Date.now() } });

      if (!user) { return res.send({ message: "Password reset token is invalid or has expired.", status: 401, success: false }) }

      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();
      return res.send({ message: "Your password has been changed.", status: 200, success: true });

    } catch (error) {
      console.log(error, "error");
    }
  }


  static changePassword = catchAsync(async (req, res, next) => {
    const user = await UserModel.findOne({ _id: mongoose.Types.ObjectId(req.user._id), isDeleted: false });
    if (user) {
      if (user.checkPassword(req.body.current_password)) {
        user.password = req.body.new_password;
        await user.save();
        return res.status(200).send({ message: "Password changed successfully", success: true, status: 200, });
      } else {
        return res.send({ message: "Please enter the correct Old Password", staus: 401, success: false });

      }
    } else {
      return res.status(404).send({ message: "An error was encountered", staus: 400, success: false });
    }

  })


}
exports = module.exports = AuthController;
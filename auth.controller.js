'use strict';

const mongoose = require('mongoose');
const UserModel = require('../../models/User').UserModel
const AuthManager = require('./auth.service');
const crypto = require('crypto');
const Mailer = require('../../services/mail.service')
const async = require('async');

const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const logger = require('../../config/logger');
const ROLES = require('../../models/User').ROLES;



const publicKey = () => {
  let random_string = '';
  const string = 'ABCDEFGHIJKLMNOPQURSTUVWXYZ123456789abcdefghijklmnopqurstuvwxyz';
  for (var i, i = 0; i < 11; i++) {
    random_string += string.charAt(Math.floor(Math.random() * string.length))
  }


  const timestamp = new Date().getTime()
  const first = timestamp.toString().slice(0, 6)
  const last = timestamp.toString().slice(6, timestamp.toString().length)


  const rd_string = first.concat(random_string)
  const publicKey1 = rd_string.concat(last)
  return publicKey1

}

const generateRandomNumber = (n = 5) => {
  return Math.floor(Math.random() * (9 * Math.pow(10, n - 1))) + Math.pow(10, n - 1);
}

class AuthController {

  static regester = catchAsync(async (req, res, next) => {
    try {
      if (!req.body.password || !req.body.email || !req.body.firstName, !req.body.lastName) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Empty fiedls are not supported');
      }
      const newUser = new UserModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: ROLES.ADMIN,
        image: req.body.image
      });
      const user = await newUser.save();
      if (user) {
        return res.send({ message: "Registerd successfully", success: true, status: 200, data: { user } })
      } else {
        return res.send({ message: "Admin not registered", status: 200, data: { user } })
      }

    } catch (error) {
      console.log(error, "error");
      return res.send({
        message: 'An error encountred',
        status: 404,
        success: false
      });
    }
  })

  static login(req, res, next) {
    return catchAsync(AuthManager.login(req, res, next));
  }

  static guestLogin = catchAsync(async (req, res, next) => {
    return AuthManager.guestLogin(req, res, next);
  })

  static logout = catchAsync(async (req, res, next) => {
    return AuthManager.logout(req, res, next);
  })

  static makePassword() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 7; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  static forgotPassword = catchAsync(async (req, res, next) => {
    console.log(req.body.email)

    async.waterfall([
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          // var token = buf.toString('hex');
          const otp = generateRandomNumber()
          console.log(otp)
          done(err, otp);
        });
      },
      function (otp, done) {
        UserModel.findOne({ email: new RegExp(["^", req.body.email, "$"].join(""), "i") }, function (err, user) {

          if (!user) {
            logger.error(`This email is not registered`);
            return res.send({
              message: 'This email is not registered',
              status: 404,
              data: ""
            });
          }

          user.resetPasswordToken = otp;
          user.resetPasswordExpires = Date.now() + 3600000; // 10 

          user.save(function (err) {
            done(err, otp, user);
          });
        });
      },

      function (otp, user, done) {
        let html = `<!DOCTYPE html>
                              <html>
                              <head>
                              </head>

                              <body style="font-family: Arial; font-size: 12px;">
                              <div>
                                  <p>
                                      You have requested a password reset, please use the OTP below to reset your password.
                                  </p>
                                <p>
                                      OTP for Varifaction <h3>`+ otp + `</h3>
                                  </p>
                                 
                                  <br>
                                    <p>
                                      Please ignore this email if you did not request a password change.
                                  </p>
                                  <br>
                                  <p>Best Wishes, <br/>Team My YakDot</p>
                              </div>
                              </body>
                              </html>`;
        Mailer.sendMail(user.email, 'Reset your password on  Yakdot', html, function (err, info) {
          done(err, 'done');
        });
        return res.send({
          message: 'An e-mail has been sent to ' + user.email + ' with further instructions.',
          success: true,
          status: 200,
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

  static resetPassword = catchAsync((req, res, next) => {
    async.waterfall([
      function (done) {
        UserModel.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
          if (!user) {
            logger.error(`Password reset token is invalid or has expired`);
            return res.send({
              message: 'Password reset token is invalid or has expired',
              status: 498,
              data: ""
            });
          }

          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function (err) {
            done(err);
          });
        });
      }
    ], function (err) {
      if (err) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'An error was encountered.');
      } else {
        return res.json({
          success: true,
          message: 'Your password has been changed.'
        });
      }
    });

  })

  static verifyEmail = catchAsync(async (req, res, next) => {
    let obj = new Date(Date.now()); console.log(obj.toISOString()); console.log(Date.now());

    UserModel.findOne({ emailVerificationToken: req.params.token }, function (err, user) {
      if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'verify_email.html');
      }
      else {
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
        user.status = 1;
        user.save(function (err) {
          return res.render('verify_email.html', { success: true });
        });
      }

    });

  })

  static changePassword = catchAsync(async (req, res, next) => {
    const user = await UserModel.findOne({ _id: req.body._id });
    if (user) {
      if (user.checkPassword(req.body.current_password)) {
        user.password = req.body.new_password;
        await user.save();
        res.send({ message: "success", status: "200", user: user });
      } else {

        throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
      }
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'An error was encountered');
    }

  })

  static getUserDetails = catchAsync(async (req, res, next) => {
    try {
      if (!req.query.id) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Empty fiedls are not supported');
      }

      const userDetils = await UserModel.findOne({ _id: mongoose.Types.ObjectId(req.query.id) },
        {
          "firstName": 1, "lastName": 1,
          "email": 1, "walletAddress": 1
        });

      if (!userDetils) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User Details not found plz check id');
      } else {
        res.send(userDetils)
      }
    } catch (error) {
      console.log(error);
      throw new ApiError(httpStatus.BAD_REQUEST, 'User Details not found plz check id');
    }

  })

}
exports = module.exports = AuthController;
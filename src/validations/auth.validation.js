const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email().required(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const guestLogin = {
  body: Joi.object().keys({
    applicationId: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    // _id: Joi.string().required(),
    current_password: Joi.string().required().custom(password),
    new_password: Joi.string().required().custom(password),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    resetPasswordOtp: Joi.number().required(),
  }),
};

const verifyEmailRegisterOtp = {
  body: Joi.object().keys({
    token: Joi.number().required(),
    email: Joi.string().email().required(),
  }),
};

const verifyEmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};
const verifyOtp = {
  body: Joi.object().keys({
    otp: Joi.number().required(),
    email: Joi.string().email().required(),
  }),
};

const sendOTP = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    applicationId: Joi.string().required(),
  }),
};

const verifyEmailOTP = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    applicationId: Joi.string().required(),
    otp: Joi.number().required()
  }),
};

module.exports = {
  register,
  login,
  guestLogin,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmailRegisterOtp,
  changePassword,
  sendOTP,
  verifyOtp,
  verifyEmailOTP,
  verifyEmail
};

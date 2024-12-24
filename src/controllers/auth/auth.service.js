'use strict';
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const CredentialsAuthStrategy = require('./passport-local');
const JwtAuth = require('./passport-jwt');
const { ROLES, UserModel, CHANNEL_STATUS, ChannelModel } = require('../../models');


let _this;
class AuthManager {

    constructor() {
        _this = this;
        _this._passport = require('passport');
        _this._passport.use(CredentialsAuthStrategy);
        _this._passport.use(JwtAuth);
    }

    login(req, res, next) {
          _this._passport.authenticate('local-auth', function (err, user, info) {
            const error = err || info;
            if (error) {
                console.log(error, "error");
                return res.status(401).json({success:false,status:401, message: "invalid credentials" })
            }
            if (!user) {
                return res.status(401).json({ message: "invalid credentials", status: 401, success: false })
            }
            if (user.blocked === true) {
                return ResponseManager.respondWithError({ data: { res }, status: 400, message: "Your account is blocked." });
            }
            if(req.body.role==='user' && user.role!=='user'){
                return res.status(401).json({ message: "Please sign in with user`s account.", status: 401, success: false })
            }
            const token = _this.signToken({ _id: user._id, email: user.email, role: user.role });
            return res.json({
                message: "Successfully Loggedin",
                success: true,
                status: 200,
                data: {
                    access_token: token
                }
            });


        })(req, res, next)
    }

    logout(req, res, next) {
        let user = req.user;
        user.fcmToken = "";
        user.deviceId = "";

        user.save(function (err) {
            console.log(err);
            if (err) {
                return ResponseManager.respondWithError(res, 404, "Something went wrong.");
            }
            return ResponseManager.respondWithSuccess(res, 404, "Successfully logged out");
        });
    }

    isAuthenticated(req, res, next) {
        _this._passport.authenticate('jwt-auth', { session: false })(req, res, next)
    }

    setHeaderReq(req, res, next) {
        req.headers['authorization'] = 'Bearer ' + req.params.token;
        return next();
    }

    isAdmin(req, res, next) {
        if (req.user.role === ROLES.ADMIN) {
            return next();
        }
        return res.status(401).send({ message: "Unauthorized", success: false, status: 401 })
    }

    isUser(req, res, next) {
        if (req.user.role === ROLES.USER) {
            return next();
        }
        return res.status(401).send({ message: "Unauthorized", success: false, status: 401 })
    }

    isSuperAdmin(req, res, next) {
        if (req.user.role === ROLES.SUPER_ADMIN) {
            return next();
        }
        return res.status(401).send({ message: "Unauthorized", success: false, status: 401 })
    }
    isGoverment(req, res, next) {
        if (req.user.role === ROLES.GOVERMENT) {
            return next();
        }
        return res.status(401).send({ message: "Unauthorized", success: false, status: 401 })
    }

    signToken(obj) {
        return jwt.sign(obj, process.env.JWT_SECRET, { expiresIn: `${process.env.TOKEN_EXPIRY_TIME}`, issuer: `${process.env.APP_NAME}` });
    }


    async generateVisitorNumber(n) {
        const random = Math.floor(Math.random() * (9 * Math.pow(10, n - 1))) + Math.pow(10, n - 1);
        const exists = await UserModel.findOne({ visitorId: `V${random}` });
        if (!exists) {
            return random;
        } else {
            return await AuthManager.generateRandomNumber(n);
        }
    }

    async createUserChannel(user, company) {
        const admin = await UserModel.findOne({ companyId: company._id, role: ROLES.ADMIN });
        const channel = new ChannelModel({
            name: user.visitorId,
            status: CHANNEL_STATUS.ACTIVE,
            createdBy: mongoose.Types.ObjectId(user._id),
            channelAvtar: ''
        });
        channel.members.push({
            userId: mongoose.Types.ObjectId(user._id),
            isAdmin: false,
        });

        channel.members.push({
            userId: mongoose.Types.ObjectId(admin._id),
            isAdmin: true,
        });
        await channel.save();
        user.channels.push({
            channelId: (mongoose.Types.ObjectId(channel._id))
        });
        await user.save();
        admin.channels.push({
            channelId: (mongoose.Types.ObjectId(channel._id))
        });
        await admin.save();
        company.channels.push({ channelId: (mongoose.Types.ObjectId(channel._id)) });
        await company.save();

        return channel;
    }


}

exports = module.exports = new AuthManager();
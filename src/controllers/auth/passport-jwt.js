'use strict';
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const UserModel = require('../../models/User').UserModel;
class JwtAuthStrategy extends JwtStrategy {
    constructor() {
        super(JwtAuthStrategy.jwtOptions(), JwtAuthStrategy.handleJwtAuth);
    }

    get name() {
        return 'jwt-auth';
    }

    static handleJwtAuth(jwt_payload, done) {

        UserModel.findOne({ _id: jwt_payload._id, isDeleted:false }, function (err, user) {
            if (err) return done(err);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        });
    }

    static jwtOptions() {
        return {
            session: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: `${process.env.JWT_SECRET}`,
        };
    }

}
exports = module.exports = new JwtAuthStrategy();
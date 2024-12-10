'use strict';
const { ROLES, UserModel } = require('../../models/User');
const LocalAuthStrategy = require('passport-local').Strategy;


class CredentialsAuthStrategy extends LocalAuthStrategy {
    constructor() {
        super(CredentialsAuthStrategy.provideOptions(), CredentialsAuthStrategy.handleUserAuth);
    }

    get name() {
        return 'local-auth';
    }

    static async handleUserAuth(email, password, done) {
        UserModel.findOne({ email: new RegExp(["^", email, "$"].join(""), "i"), role: { $in: [ROLES.ADMIN,ROLES.USER,ROLES.GOVERMENT] }, isDeleted: false }, function (err, user) {

            if (err) {
                console.log(err)
                return done(err);
            }
            if (!user) {
                return done(null, false, 'Invalid credentials');
            }
            if (!user.checkPassword(password)) {
                return done(null, false, '');
            }
            return done(null, user);
        });
    }

    static provideOptions() {
        return {
            usernameField: 'email',
            passReqToCallback: false,
            passwordField: 'password',
            session: false
        };
    }
}
exports = module.exports = new CredentialsAuthStrategy();
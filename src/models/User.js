'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const { toJSON, paginate } = require('./plugins');


let UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
    },
    walletAddress: { type: String, default: "" },
    role: { type: String, default: "" },
    salt: {
        type: String,
        required: false
    },
    hashedPassword: {
        type: String,
        required: false,
    },
    blocked: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    avatar: { type: String, default: "" },
    resetPasswordOtp: { type: Number, default: 0 },
    resetPasswordExpires: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    address: { type: String, default: "" },
    phoneNumber: { type: Number, default: null },
    designation: { type: String, default: "" },
    departmentName: { type: String, default: "" },
    Notification: [
        {
            isRead: { type: Boolean, default: false },
            notificationId: { type: Schema.Types.ObjectId, ref: "Notification" },
            _id: false
        }
    ],
    nfts: [
        {
            nftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nft' },
        },
    ],
}, { timestamps: true });

UserSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.hashedPassword;
    delete obj.__v;
    delete obj.salt;
    return obj
};

UserSchema.virtual('id')
    .get(function () {
        return this._id;
    });
UserSchema.virtual('password')
    .set(function (password) {
        this.salt = crypto.randomBytes(32).toString('base64');
        this.hashedPassword = this.encryptPassword(password, this.salt);
    })
    .get(function () {
        return this.hashedPassword;
    });

UserSchema.methods.encryptPassword = function (password, salt) {
    return crypto.createHmac('sha1', salt).update(password.toString()).digest('hex');
};
UserSchema.methods.checkPassword = function (password) {
    return this.encryptPassword(password, this.salt) === this.hashedPassword;
};

UserSchema.pre('save', function (next) {
    if (this.isNew) {
        //do stuff
    }
    next();
}
);
UserSchema.plugin(toJSON);
UserSchema.plugin(paginate);


module.exports.UserModel = mongoose.model('User', UserSchema);

module.exports.ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    GOVERMENT: 'goverment'

};


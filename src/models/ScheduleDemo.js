'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DemoSchema = new Schema({
    name: { type: String, default: "" },
    company: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
    contactNumber: { type: Number, default: null },
    email: { type: String, default: "" },
    message: { type: String, default: "" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
})



module.exports.UserModel = mongoose.model('Demo', DemoSchema);
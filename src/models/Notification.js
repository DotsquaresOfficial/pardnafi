const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const NotifactionSchema = new Schema({
    name: { type: String, default: "" },
    description: { type: String, default: "" }

}, { timestamps: true },);

module.exports.NotifactionModel = mongoose.model('Notification', NotifactionSchema);


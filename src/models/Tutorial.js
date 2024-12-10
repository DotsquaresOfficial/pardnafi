const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TutorialSchema = new Schema({

    tutorialName: { type: String, default: "" }

}, { timestamps: true },);

module.exports.TutorialModel = mongoose.model('Tutorial', TutorialSchema);
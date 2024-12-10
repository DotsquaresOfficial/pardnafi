const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FaqsSchema = new Schema({

    question: { type: String, default: "" },
    answer: { type: String, default: "" }

}, { timestamps: true },);


module.exports.FaqsModel = mongoose.model('Faqs', FaqsSchema);
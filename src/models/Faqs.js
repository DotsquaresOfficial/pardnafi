const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FaqsSchema = new Schema({

    question: { type: String, default: "" },
    answer: { type: String, default: "" }

}, { timestamps: true },);


FaqsSchema.pre('find', function () {
    this.sort({ createdAt: -1 });  
});



module.exports.FaqsModel = mongoose.model('Faqs', FaqsSchema);
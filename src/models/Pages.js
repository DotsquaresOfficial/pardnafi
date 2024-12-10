const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PagesSchema = new Schema({
    slug: { type: String },
    title: { type: String },
    subTitle: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    created: { type: Date, default: Date.now }
}, { timestamps: true },);

module.exports.PagesModel = mongoose.model("Page", PagesSchema);

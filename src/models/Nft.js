const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const shortid = require("shortid");


const NftSchema = new Schema({
    token: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    images: { type: String, default: "" },
    tokenId: { type: String, default: "" },
    createdBy: { type: String, default: "" }
    
}, { timestamps: true },);

module.exports.NftModal = mongoose.model('Nft', NftSchema);


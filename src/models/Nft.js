const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const shortid = require("shortid");


const NftSchema = new Schema({
    token: { type: String, default: "" },
    isAdminApproved: { type: Boolean, default: false },
    isGovermentApproved: { type: Boolean, default: false },
    vehicleImage: { type: String, default: "" },
    vehicleName: { type: String, default: "" },
    vehicleDescription: { type: String, default: "" },
    vehicleRequiredDocuments: [
        {
            imageName: String,
            imageUrl: String,
            dateCreated: { type: Date, default: Date.now }
        }
    ],
    ownerName: { type: String, default: "" },
    ownerImage: { type: String, default: "" },
    ownerAddress: { type: String, default: "" },
    walletAddress: { type: String, default: "" },
    ownerRequiredDocuments: [
        {
            imageName: String,
            imageUrl: String,
            dateCreated: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true },);

module.exports.NftModal = mongoose.model('Nft', NftSchema);


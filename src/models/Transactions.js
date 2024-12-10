const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TransactionSchema = new Schema({
    tokenAddress: { type: String, required: true },
    tokenBalance: { type: String, default: null },
    dataCreated: { type: Date, default: Date.now },
    timestamps: { type: String, required: true }
});

module.exports.TransactionModal = mongoose.model('Transaction', TransactionSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const ContactUsSchema = new Schema({
    Name: { type: String, default: "" },
    Company: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
    contactNumber: { type: Number, default: null },
    email: { type: String, default: "" },
    message: { type: String, default: "" },
    isReplied: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true },);


ContactUsSchema.pre('find', function () {
    this.sort({ createdAt: -1 });  
});


module.exports.ContactUsModel = mongoose.model('ContactUs', ContactUsSchema);
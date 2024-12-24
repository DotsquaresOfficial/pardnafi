const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    groupImage: { type: String, required: false }, // Name of the group
        groupName: { type: String, required: true }, // Name of the group
        description: { type: String, default: "" }, // Description of the group
        createdBy: { type: String,required: true }, // User ID of the group creator
    members: [
        {
            memberId: { type: String, required: true }, // User ID of the member
            joinedAt: { type: Date, default: Date.now } // Date the member joined
        }
    ],
    isDeleted: { type: Boolean, default: false }, // Soft delete flag
}, { timestamps: true });


GroupSchema.pre('find', function () {
    this.sort({ createdAt: -1 });  
});

module.exports.GroupModel = mongoose.model('Group', GroupSchema);

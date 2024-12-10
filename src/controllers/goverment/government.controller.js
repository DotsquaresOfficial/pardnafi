const mongoose = require('mongoose');
const UserModal = require('../../models/User').UserModel;
const { ROLES } = require('../../models');
const Mailer = require('../../services/mail.service');


class GovernmentController {


    static async updateProfile(req, res) {
        try {
            const governmentId = req.user.id;
            const updateData = req.body;

            if (!updateData || Object.keys(updateData).length === 0) {
                return res.status(400).send({
                    message: "No data provided for update.",
                    success: false,
                });
            }

            const fieldsToUpdate = {};
            if (updateData.firstName) fieldsToUpdate.firstName = updateData.firstName;
            if (updateData.lastName) fieldsToUpdate.lastName = updateData.lastName;
            if (updateData.phoneNumber) fieldsToUpdate.phoneNumber = updateData.phoneNumber;
            if (updateData.departmentName) fieldsToUpdate.departmentName = updateData.departmentName;
            if (updateData.email) fieldsToUpdate.email = updateData.email;
            if (updateData.address) fieldsToUpdate.address = updateData.address;


            const updatedGovernment = await UserModal.findOneAndUpdate(
                { _id: governmentId, role: ROLES.GOVERMENT },
                { $set: fieldsToUpdate },
                { new: true }
            ).select('firstName lastName phoneNumber departmentName email address updatedAt').lean();

            if (!updatedGovernment) {
                return res.status(404).send({
                    message: "Government account not found.",
                    success: false,
                });
            }

            return res.status(200).send({
                message: "Profile updated successfully.",
                success: true,
                updatedDetails: updatedGovernment,
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            return res.status(500).send({
                message: "An unexpected error occurred while updating the profile.",
                success: false,
                error: error.message,
            });
        }
    }


    static async getGovernmentProfile(req, res) {
        try {
            console.log("SAdfasdfsdaf")
            const governmentId = req.user.id;

            const governmentProfile = await UserModal.findOne(
                { _id: governmentId, role: ROLES.GOVERMENT }
            ).select('firstName lastName phoneNumber departmentName email address createdAt updatedAt').lean();

            if (!governmentProfile) {
                return res.status(404).send({
                    message: "Government profile not found.",
                    success: false,
                });
            }

            return res.status(200).send({
                message: "Government profile fetched successfully.",
                success: true,
                profileDetails: governmentProfile,
            });
        } catch (error) {
            console.error("Error fetching government profile:", error);
            return res.status(500).send({
                message: "An unexpected error occurred while fetching the profile details.",
                success: false,
                error: error.message,
            });
        }
    }

}


exports = module.exports = GovernmentController;

const mongoose = require('mongoose');
const UserModal = require('../../models/User').UserModel;
const catchAsync = require('../../utils/catchAsync');
const { ROLES, FaqsModel, ContactUsModel } = require('../../models');
const Mailer = require('../../services/mail.service');


class AdminController {


    static createNewUser = catchAsync(async (req, res, next) => {
        if (!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.password) {
            return res.send({ message: "All feilds are required", success: false, status: 400 })
        }
        const user = await UserModal.findOne({ email: new RegExp(["^", req.body.email, "$"].join(""), "i") });
        if (user) {
            return res.send({
                message: "The email address you provided is already associated with an existing account.",
                success: false,
                status: 409,
                existingUserDetails: user
            })
        }

        let reqbody = req.body;
        const newuser = await UserModal.create({
            firstName: reqbody.firstName,
            lastName: reqbody.lastName,
            email: reqbody.email,
            password: reqbody.password,
            role: "user"
        });

        console.log(newuser, 'newuser')
        let html = `<!DOCTYPE html>
                        <html>
                            <head>
                            </head>
                            <body style="font-family: Arial; font-size: 12px;">
                                <div>
                                    <p> Hi ` + newuser.firstName + ` ` + newuser.lastName + `,</p>
                                    <p>
                                    We are excited to inform you that your account has been created on the Digitial Platform website! You can log in to your account using the details below:
                                    </p>
                                    <p>
                                    <strong>Email:</strong> ` + newuser.email + `<br/>
                                    <strong>Password:</strong> ` + reqbody.password + `
                                    </p>
                                    <p>
                                    For security reasons, please reset your password immediately after logging in to protect your account.
                                    </p>
                                    <p>
                                    If you did not request this account, please contact our support team.
                                    </p>
                                    <p>Best Wishes, <br/>Carnft Team</p>
                                </div>
                            </body>
                        </html>`;

        Mailer.sendMail(newuser.email, 'Your New Digitial Platform Account', html, function (err, info) {
            console.log(err, 'err')
            console.log(info, 'info')
            done(err, 'done');
        });


        return res.send({ message: "User account has been Created succssfully", status: 201, success: true })
    });

    static getDashboardData = catchAsync(async (req, res, next) => {
        // if (!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.password) {
        //     return res.send({ message: "All feilds are required", success: false, status: 400 })
        // }
        const totalusers = await UserModal.find({role:ROLES.USER});
        const activeusers = await UserModal.find({role:ROLES.USER,isActive:true});
        const deactiveusers = await UserModal.find({role:ROLES.USER,isActive:false});
        const faq = await FaqsModel.count();
        const contarctUs = await ContactUsModel.count();
        return res.send({
            success: true,
            status: 200,
            data: {totalUsers:totalusers.length,deActiveUsers:deactiveusers.length,activeUsers:activeusers.length,totalFAQs:faq,totalContactUs:contarctUs}
        });

    });

    static async getAdminProfile(req, res) {
        try {
            if (!req.user._id) {
                return res.send({ messsage: "user not found", status: 401, success: false });
            }


            const user = await UserModal.findOne({
                _id: mongoose.Types.ObjectId(req.user._id)
            }, {
                "walletAddress": 1,
                "uplineAddress": 1,
                "isJoined": 1,
                "firstName": 1,
                "lastName": 1,
                "avatar": 1,
                "isProfileUpdated": 1,
                "isActive": 1,
                "userId": 1
            });


            // const notificationCount = await Use
            if (!user) {
                return res.send({ message: "User not found", success: false, status: 401 });
            }
            return res.send({ message: "User details are fetched successfully", success: true, status: 201, user })
        } catch (error) {
            console.log(error, "error");
            return res.send({ message: "An error encountred", success: false, status: 501 });
        }
    }

    static async updateUserProfile(req, res) {
        try {

            const user = await UserModal.findOne({ _id: req.body.id });
            if (!user) return res.send({ message: 'User profile not found', status: 401, success: false });

            user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
            user.lastName = req.body.lastName ? req.body.lastName : user.lastName;
            user.isActive = req.body.active ? req.body.active : user.active;

            await user.save();

            if (!user) return res.send({ message: "User Profile udpated been updated successfully", status: 409, success: false });

            return res.send({ message: "Details has been updated successfully ", status: 201, success: true, user });
        } catch (error) {
            console.log(error, "error");
            return res.send({ message: "An error encountred", status: 500, success: false })
        }
    }

    //Goverment Managment apis 
    static async createGovermentAccount(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).send({
                    message: "All fields are required",
                    success: false
                });
            }

            const user = await UserModal.findOne({ email: new RegExp(`^${email}$`, "i") });
            if (user) {
                return res.status(409).send({
                    message: "The email address you provided is already associated with an existing account.",
                    success: false,
                    existingUserDetails: user
                });
            }

            const newUser = await UserModal.create({
                email,
                password,
                role: ROLES.GOVERMENT
            });

            return res.status(201).send({
                message: "Government account has been created successfully.",
                success: true,
                user: { id: newUser._id, email: newUser.email, role: newUser.role }
            });
        } catch (error) {
            console.error("Error creating government account:", error);
            return res.status(500).send({
                message: "An unexpected error occurred while creating the account.",
                success: false,
                error: error.message
            });
        }
    }

    static async getAllGovernmentAccounts(req, res, next) {
        try {
            const governmentAccounts = await UserModal.find({ role: ROLES.GOVERMENT, isDeleted: false })
                .select('email role firstName lastName phoneNumber departmentName address createdAt') // Adjust fields as needed
                .lean();

            if (governmentAccounts.length === 0) {
                return res.status(404).send({
                    message: "No government accounts found.",
                    success: false,
                    accounts: []
                });
            }

            return res.status(200).send({
                message: "Government accounts fetched successfully.",
                success: true,
                accounts: governmentAccounts
            });
        } catch (error) {
            console.error("Error fetching government accounts:", error);
            return res.status(500).send({
                message: "An unexpected error occurred while fetching government accounts.",
                success: false,
                error: error.message
            });
        }
    }

    static async updateGovernmentDetails(req, res, next) {
        try {
            const { governmentId } = req.params;
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
            if (updateData.address) fieldsToUpdate.address = updateData.address;

            const updatedGovernment = await UserModal.findOneAndUpdate(
                { _id: governmentId, role: ROLES.GOVERMENT, isDeleted: false },
                { $set: fieldsToUpdate },
                { new: true }
            ).select('email role firstName lastName phoneNumber departmentName address updatedAt').lean();

            if (!updatedGovernment) {
                return res.status(404).send({
                    message: "Government account not found.",
                    success: false,
                });
            }

            return res.status(200).send({
                message: "Government details updated successfully.",
                success: true,
                updatedDetails: updatedGovernment,
            });
        } catch (error) {
            console.error("Error updating government details:", error);
            return res.status(500).send({
                message: "An unexpected error occurred while updating government details.",
                success: false,
                error: error.message,
            });
        }
    }
}

exports = module.exports = AdminController;


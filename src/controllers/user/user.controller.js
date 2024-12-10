const mongoose = require('mongoose');
const UserModal = require('../../models/User').UserModel;
const catchAsync = require('../../utils/catchAsync');
const { UserModel, ROLES } = require('../../models');
const Mailer = require('../../services/mail.service');


class UserController {


    static async getAdmin(req, res) {
        try {
            if (!req.user || !req.user._id) {
                return res.send({ message: "Unauthorize", success: false, status: 401 });
            }

            const admin = await UserModel.findOne({ _id: req.user._id }, { "walletAddress": 1, "uplineAddress": 1, "firstName": 1, "lastName": 1, "email": 1, "avatar": 1 });

            if (!admin) return res.send({ message: "Profile not found", status: 404, success: false });

            return res.send({ message: "Details are fetched", status: 200, success: true, admin })

        } catch (error) {
            console.log(error, "error");
            return res.send({ message: "An error encountred", status: 500, success: false });
        }
    }

    static async updateProfile(req, res) {
        try {
            if (!req.user || !req.user._id) {
                return res.send({ message: "Unauthorize", success: false, status: 401 });
            }
            console.log(req.user._id)
            const user = await UserModal.findOne({ _id: req.user._id });
            if (!user) return res.send({ message: 'Profile not found', status: 401, success: false });

            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName
            user.avatar = req.body.avatar;

            await user.save();

            if (!user) return res.send({ message: "Profile details has been updated successfully", status: 409, success: false });

            return res.send({ message: "Details has been updated successfully ", status: 201, success: true, user });
        } catch (error) {
            console.log(error, "error");
            return res.send({ message: "An error encountred", status: 500, success: false })
        }
    }

    static async userUpdateProfile(req, res) {
        try {
            if (!req.user || !req.user._id) {
                return res.send({ message: "Unauthorize", success: false, status: 409 });
            }
            const userUpdate = await UserModal.findOne({ _id: req.user._id });
            if (!userUpdate) {
                return res.send({ message: "User not found", status: 490, success: false })
            }
            userUpdate.firstName = req.body.firstName;
            userUpdate.lastName = req.body.lastName
            userUpdate.avatar = req.body.avatar;

            await userUpdate.save();
            if (!user) return res.send({ message: "User profile details not updated", status: 409, success: false });

            return res.send({ message: "User profile details has been updated successfully", status: 201, success: true, user });
        } catch (error) {
            console.log(error, "error");
            return res.send({ message: "An error encountred", status: 500, success: false });
        }
    }

    static async createUserProfile(req, res) {
        try {
            const userCheck = await UserModal.findOne({ walletAddress: req.body.walletAddress });
            if (userCheck) {
                return res.send({ message: "This wallet address is already in use please try with another", status: 401, success: false });
            }

            const userId = await UserModal.findOne({ userId: req.body.userId });
            if (userId) {
                return res.send({ message: "This user id is already in use please try with another", status: 401, success: false });
            }

            if (
                !req.body.fname ||
                !req.body.avatar ||
                !req.body.walletAddress ||
                !req.body.uplineAddress ||
                !req.body.joiningDate ||
                !req.body.isJoined ||
                !req.body.userId
            ) {
                return res.send({ message: 'All fields are required', status: 200, success: false });
            }

            if (req.body.userId.length > 7 || req.body.userId.length < 7) {
                return res.send({ message: 'UserId can only accepted with 7 digit', status: 422, success: false });
            }

            const user = await UserModal.create({
                firstName: req.body.fname,
                lastName: req.body.lname,
                avatar: req.body.avatar,
                walletAddress: req.body.walletAddress,
                uplineAddress: req.body.uplineAddress,
                dataOfjoining: req.body.joiningDate,
                isJoined: req.body.isJoined,
                role: "customer",
                isActive: true,
                userId: req.body.userId,
                uplineId: req.body.uplineId ? req.body.uplineId : "",
                isProfileUpdated: true

            });

            if (!user) {
                return res.send({ message: "Details are not saved", status: 401, success: false });
            }
            return res.send({ message: "Details has been saved successfully", status: 201, success: true, user });
        } catch (error) {
            console.log(error, "error");
        }
    }

    static async getUserProfile(req, res) {
        try {
            if (!req.user._id) {
                return res.send({ message: "User not found", status: 401, success: false });
            }
            const user = await UserModal.findOne({
                _id: req.user._id
            }, {
                "walletAddress": 1,
                "uplineAddress": 1,
                "isJoined": 1,
                "firstName": 1,
                "lastName": 1,
                "avatar": 1,
                "dataOfjoining": 1,
                "isProfileUpdated": 1,
                "isActive": 1,
                "uplineId": 1,
                "userId": 1,
                "Notification": 1,
                "nfts": 1
            }).populate({
                path: 'Notification',
                populate: { path: 'notificationId', select: ['name', 'description'] },
            })
                .populate({
                    path: 'nfts.nftId', // Path to the nested field in `nfts` array
                    select: ['vehicleName', 'vehicleDescription', 'vehicleImage', 'isAdminApproved', 'ownerName', 'ownerImage', 'ownerAddress', 'vehicleRequiredDocuments', 'ownerRequiredDocuments'], // Fields to include
                })


            // const notificationCount = await Use
            if (!user) {
                return res.send({ message: "User not found", success: false, status: 401 });
            }
            console.log
            let unReadNotification = user.Notification.filter(item => item.isRead == false);
            console.log(unReadNotification, "unReadNotification");
            let data = {
                notificationCount: unReadNotification && unReadNotification.length,
                user: user
            }
            return res.send({ message: "User details are fetched successfully", success: true, status: 201, data })
        } catch (error) {
            console.log(error, "error");
            return res.send({ message: "An error encountred", success: false, status: 501 });
        }
    }

    static async getAllUsers(req, res) {
        try {
            if (!req.user || !req.user._id) {
                return res.send({ message: "Unauthorize", success: false, status: 401 });
            }
            const users = await UserModal.find({ role: ROLES.USER }, {
                "email": 1,
                "userId": 1,
                "avatar": 1,
                "uplineId": 1,
                "firstName": 1,
                "lastName": 1,
                "isActive": 1,
                "isJoined": 1,
                "isDeleted": 1,
                "dataOfjoining": 1,
            });

            if (!users) {
                return res.send({ message: "Users are not found", status: 401, success: false, });
            }

            return res.send({ message: "Users are fetched successfully", status: 201, success: true, users });

        } catch (error) {
            console.log(error, "error");
            return res.send({ message: "An error encountred", status: 500, success: false });
        }
    }

    static async userUpdateDetails(req, res) {
        try {
            const userDetails = await UserModal.findOne({ walletAddress: req.body.walletAddress });
            if (!userDetails) {
                return res.send({ message: "User not found", status: 404, success: false });
            }

            userDetails.firstName = req.body.fname ? req.body.fname : userDetails.firstName;
            userDetails.lastName = req.body.fname ? req.body.fname : userDetails.lastName;
            userDetails.address = req.body.address ? req.body.address : userDetails.address;
            userDetails.phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : userDetails.phoneNumber;
            userDetails.avatar = req.body.avatar ? req.body.avatar : userDetails.avatar;

            await userDetails.save();
            if (!userDetails) {
                return res.send({ message: "Profile details has not been updated", status: 401, success: false });
            }
            return res.status(200).json({ message: "Profile details has been updated successfully", status: 201, success: true, userDetails });
        } catch (error) {
            console.log(error, "error   ");
        }
    }


    static async readNotification(req, res, next) {
        try {

            if (!req.user._id) {
                return res.send({ message: "User not found", status: 401, success: false });
            }
            console.log(req.user._id, 'req.user._id')
            const updateNotificationStatus = await UserModal.updateOne(
                { _id: req.user._id, 'Notification.isRead': false },
                [
                    {
                        $set: {
                            Notification: {
                                $map: {
                                    input: '$Notification',
                                    as: 'notification',
                                    in: {
                                        $cond: {
                                            if: { $eq: ['$$notification.isRead', false] },
                                            then: { $mergeObjects: ["$$notification", { isRead: true }] },
                                            else: "$$notification"
                                        }
                                    }
                                }
                            }
                        }
                    }
                ],
            );
            if (updateNotificationStatus.nModified == 1) {

                return res.send({ message: 'The notification status has been updated.', success: true, status: 200 });
            } else {
                return res.send({ message: 'Status could not be updated.', success: false, status: 404 });
            }
        } catch (error) {
            console.log(error, "error");
            return res.send({ message: "An error has occurred.", status: 501, success: false });
        }
    }

    static async getUsers(req, res, next) {
        try {
            const users = await UserModal.find({ role: "customer" },
                {
                    "email": 1,
                    "userId": 1,
                    "avatar": 1,
                    "uplineId": 1,
                    "firstName": 1,
                    'address': 1,
                    "phoneNumber": 1,
                    "lastName": 1,
                    "isJoined": 1,
                    "walletAddress": 1,
                    "uplineAddress": 1,
                    "dataOfjoining": 1,
                }
            );
            if (!users) {
                return res.send({ message: "Users are not found", status: 401, success: false });
            }

            return res.send({ message: "Users details are fetched", status: 200, success: true, users });
        } catch (error) {
            console.log(error, "error");
            return res.send({ message: "An error encountred", status: 501, success: false });
        }
    }

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

}

exports = module.exports = UserController;


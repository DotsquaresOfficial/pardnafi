const mongoose = require('mongoose');
const NotifactionModel = require('../../models/Notification').NotifactionModel;
const UserModal = require('../../models/User').UserModel;



class NotificationController {

    static async createNotification(req, res, next) {
        try {
            const notificationData = req.body;
            const notification = await NotifactionModel.create({
                name: notificationData.name,
                description: notificationData.description,
            });
            console.log(notification, "notification");
            if (!notification) return res.send({ message: "Somthing went wrong Notification is not createds" });

            // removing old notification 
            // NotificationController.removeOldNotification(req, res);
            return res.status(201).send({ message: "Notification sended successfully", success: true });
        } catch (error) {
            console.log(error, "error");
        }
    }

    static async removeOldNotification(req, res) {
        // this function fetch 10 new notification and remove old notification

        const notification = await NotifactionModel.find({}, { "_id": 1 }).sort({ "createdAt": -1 }).limit(10);

        let idToMatch = notification.map(i => mongoose.Types.ObjectId(i._id));

        const udpateNotification = await NotifactionModel.deleteMany({ _id: { $nin: idToMatch } });

        console.log(notification.length, "length -");


    }

    static async fetchNotification(req, res, next) {
        try {
            const notifications = await NotifactionModel.find({}, { "name": 1, "description": 1, "createdAt": 1 }).sort({ "createdAt": -1 });
            let obj = {
                notifications: notifications,
                cont: notifications.length
            }
            return res.status(201).send({ message: "Notification fetch successfully", success: true, obj })
        } catch (error) {
            console.log(error, "error");

        }

    }

    static async upateNotification(req, res) {
        let update = req.body;
        if (!update.id || !update.name || !update.description) {
            return res.send({ message: "All fields are required to update the notification.", status: 200, success: false });
        }

        const users = await UserModal.find({ role: "customer" }, { "walletAddress": 1 });
        if (users) {
            Promise.all(users.map(async (item) => {
                await UserModal.updateOne(
                    { walletAddress: item.walletAddress, "Notification.notificationId": mongoose.Types.ObjectId(update.id) },
                    { $set: { "Notification.$.isRead": false } }
                );
            }))
        }

        const notification = await NotifactionModel.findOne({ _id: mongoose.Types.ObjectId(update.id) });
        if (!notification) return res.send({ message: "No matching notification found.", success: false, status: 404 });

        notification.name = update.name;
        notification.description = update.description;

        await notification.save();

        return res.send({ message: "Notification has been successfully updated ", status: 200, success: true, notification: notification });
    }

    static async removeNotification(req, res) {
        try {
            await NotifactionModel.findOneAndDelete({ _id: req.body.id });

            const users = await UserModal.find({ role: "customer" }, { "walletAddress": 1 });
            if (users) {
                Promise.all(users.map(async (item) => {
                    // await UserModal.updateOne(
                    //     { walletAddress: item.walletAddress, "Notification.notificationId": update.id },
                    //     { $set: { "Notification.$.isRead": false, "Notification.$.name": update.name, "Notification.$.description": update.description } }
                    // );
                    await UserModal.updateOne(
                        { walletAddress: item.walletAddress },
                        { $pull: { Notification: { notificationId: mongoose.Types.ObjectId(req.body.id) } } }
                    );
                }))
            }
            return res.send({ message: "Notification has been deleted successfully", success: true, status: 200 });
        } catch (error) {
            console.log(error, "error");
        }
    }

    static async getOne(req, res, next) {

        try {
            if (!req.query.id) {
                return res.send({ message: "To get the notifiction id is required", status: 401, success: false })
            }
            const notification = await NotifactionModel.findOne({ _id: req.query.id }, { "name": 1, "description": 1 });

            if (!notification) { return res.send({ message: "Notification not found", status: 401, success: false }) }

            return res.send({ message: "Notifiaction fetch successfully", status: 201, success: true, notification });

        } catch (error) {
            console.log(error, "error");
            return res.send({ message: "An error was encountred", status: 501, success: false })
        }
    }


    /*-----------------user apis----------------------*/
    static async getNotifictionForUser(req, res, next) {
        try {
            const notification = await NotifactionModel.find({}, { "name": 1, "description": 1 });
            if (!notification) { return res.send({ message: "No notification are not found ", success: false }) }
            return res.send({ message: "Notification are fetche successfully", success: 201, notification: notification.reverse() });

        } catch (error) {
            console.log(error, "error");
            return res.send({ message: "An error encountred", status: 501, succes: false });
        }
    }


    static async postNotificationToAllUsers(req, res, next) {
        try {
            if (!req.body.name || req.body.name == "" || req.body.name == null) {
                return res.send({ message: 'Name is required', status: 401, success: false });
            }

            if (!req.body.description || req.body.description == "" || req.body.description == null) {
                return res.send({ message: 'Description is required', status: 401, success: false });
            }

            const notificationData = req.body;

            const notification = await NotifactionModel.create({
                name: notificationData.name,
                description: notificationData.description,
            });
            if (notification) {
                const allUsers = await UserModal.find({ role: 'user' }, { "Notification": 1 });
                if (!allUsers) {
                    return res.send({ message: 'Users not found for sending notification', status: 401, success: false });
                }
                Promise.all(allUsers.map(async (item, key) => {
                    const newData = {
                        isRead: false,
                        notificationId: mongoose.Types.ObjectId(notification._id)
                    }
                    const user = await UserModal.findOne({ _id: item._id });
                    user.Notification.push(newData);
                    await user.save();
                }));

                return res.status(200).json({ message: "Notification sent to all users Successfully!", status: true });
            } else {
                return res.send({ message: "Notification is not created ", succes: false, status: 401 });
            }

        } catch (error) {
            console.log(error, "error");
            return res.send({ message: "An error encountred", status: 501, success: false });
        }
    }

}


exports = module.exports = NotificationController;
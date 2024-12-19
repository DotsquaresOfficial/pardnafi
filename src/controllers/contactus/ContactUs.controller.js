const mongoose = require('mongoose');
const ContactUsModel = require('../../models/ContactUs').ContactUsModel;
const Mailer = require('../../services/mail.service');
const { UserModel, ROLES } = require('../../models');

class ContactUsController {
    static async ContactUs(req, res, next) {
        try {
            if (
                req.body.name == "" ||
                req.body.email == "" ||
                req.body.contactNumber == "" ||
                req.body.message == ""
            ) { return res.send({ message: "All fields are required", success: false }) }
            // const admin = await UserModel.findOne({ role: ROLES.ADMIN }, { "firstName": 1, "lastName": 1, "email": 1 });
            // if (!admin) {
            //     return res.send({ message: "Admin details not found for email", status: 200, success: false });
            // }
            const ticket = await ContactUsModel.create({
                Name: req.body.name,
                Company: req.body.companyName,
                email: req.body.email,
                message: req.body.message,
                jobTitle: req.body.jobTitle,
                contactNumber: req.body.contactNumber
            });

            if (!ticket) return res.send({ message: "Somthing went wrong contact form not submitted", sucess: false })
            // ContactUsController.emailToAdmin(admin, ticket);
            // ContactUsController.emailToCustomer(admin, ticket);
            return res.send({ status: 200, success: true ,message: "Form submited successfully" });
        } catch (error) {
            console.log(error, "error");
        }
    }
    static dateTimeFormat() {
        const currentTimestamp = Date.now();

        // Create a new date object from the timestamp
        const date = new Date(currentTimestamp);

        // Set the time zone to UTC
        const options = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true, // Use 12-hour format
            timeZone: 'UTC'
        };

        // Format the date
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

        return formattedDate;
    }

    static emailToAdmin(admin, ticket) {

        let dateAndtime = ContactUsController.dateTimeFormat();


        // let html = `<!DOCTYPE html>
        // <html>
        // <head>
        // </head>
        // <body style="font-family: Arial; font-size: 12px;">
        // <div>
        // `+ dateAndtiem + `
        // <p> Hi `+ admin.firstName + " " + admin.lastName + `  ! </p>
        //     <p>I am writing to you today because `+ ticket.message + `.</p>
        //     <p>
        //     Thank you for your time and consideration. I look forward to hearing from you soon..
        //     </p>
        // <p>Sincerely, <br/>`+ ticket.firstName + " " + ticket.lastName + `</p>
        // </div>
        // </body>
        // </html>`;
        let html = `<!DOCTYPE html>
        <html>
            <head>
            </head>
                <body style="font-family: Arial; font-size: 12px;">
                    <div>
                        ${dateAndtime}
                        <p>Hi ${admin.firstName} ${admin.lastName}!</p>
                        <p>I am writing to you today because ${ticket.message}.</p>
                        <p>
                        Thank you for your time and consideration. I look forward to hearing from you soon.
                        </p>
                        <p>Sincerely, <br/>${ticket.firstName} ${ticket.lastName}</p>
                    </div>
                </body>
        </html>`;
        Mailer.sendMail(admin.email, ticket.message, html, function (err, info) {
            if (err) {
                console.log("Error in sending mail", err);
            }
            return console.log("Mail sent");
        });
    }

    static emailToCustomer(admin, ticket) {

        // let html = `<!DOCTYPE html>
        // <html>
        // <head>
        // </head>
        // <body style="font-family: Arial; font-size: 12px;">
        // <div>
        // <p> Dear `+ ticket.firstName + " " + ticket.lastName + `, ! </p>

        //     <p>We have received your email and are currently reviewing it.</p>.
        //     <p>
        //     An Our team will reply to you as soon as possible with an appropriate solution.
        //     </p>

        //     <p>Thank you for your patience.</p>
        // <p>Sincerely, <br/>Nakamoto Team</p>
        // </div>
        // </body>
        // </html>`;


        let html = `<!DOCTYPE html>
                    <html>
                    <head>
                    </head>
                    <body style="font-family: Arial; font-size: 12px;">
                    <div>
                    <p>Dear ${ticket.firstName} ${ticket.lastName}, !</p>

                    <p>We have received your email and are currently reviewing it.</p>
                    <p>
                    Our team will reply to you as soon as possible with an appropriate solution.
                    </p>

                    <p>Thank you for your patience.</p>
                    <p>Sincerely, <br/>Nakamoto Team</p>
                    </div>
                    </body>
                    </html>`;
        Mailer.sendMail(ticket.email, 'Confirmation of inquery Email', html, function (err, info) {
            if (err) {
                console.log('error in sending mail');
            }
            return console.log("Mail sent");
        });
    }


    static async getAllTickets(req, res, next) {
        try {
            const tickets = await ContactUsModel.find({ isReplied: false, isDeleted: false });
            if (!tickets && tickets.lenght < 0) {
                return res.send({ message: "No such record", status: 404, success: false });
            }
            if (tickets.lenght === 0) {
                return res.send({ message: "All Tickets resolved ", status: 200, success: true, tickets });
            }
            return res.send({ message: "Tickets fetched successfully", status: 200, success: true, tickets });

        } catch (error) {
            console.log(error, "error");
        }
    }

    static async getOne(req, res, next) {
        try {
            const id = req.query.id;
            console.log(id, "id");

            const ticket = await ContactUsModel.findOne({ _id: id }, { "firstName": 1, "lastName": 1, "email": 1, "message": 1 });
            if (!ticket) {
                return res.send({ message: "Ticket not found", status: 200, success: false });
            }
            return res.send({ message: "Ticket fetched successfully", status: 200, success: true, ticket });

        } catch (error) {
            console.log(error);
        }
    }

    static async updateEmail(req, res, next) {
        try {

            const ticket = await ContactUsModel.findOne({ _id: req.body.id });

            if (!ticket) { return res.send({ message: "Emails not found", status: 200, success: false }) }

            ticket.isReplied = true;

            await ticket.save();
            return res.send({ message: "Email updated successfully", status: 200, success: true, ticket });

        } catch (error) {
            console.log(error);
        }
    }
    // wait for email template
    static EmailToCustomer(admin, ticket) {
        let html = `<!DOCTYPE html>
        <html>
        <head>
        </head>
        <body style="font-family: Arial; font-size: 12px;">
        <div>
        <p> Dear `+ ticket.firstName + " " + ticket.lastName + `, ! </p>

            <p>We have received your email and are currently reviewing it.</p>.
            <p>
            An Our team will reply to you as soon as possible with an appropriate solution.
            </p>

            <p>Thank you for your patience.</p>
        <p>Sincerely, <br/>Nakamoto Team</p>
        </div>
        </body>
        </html>`;
        Mailer.sendMail(ticket.email, 'Confirmation of inquery Email', html, function (err, info) {
            if (err) {
                console.log('error in sending mail');
            }
        })
    }

    static async removeEmail(req, res, next) {
        try {
            const email = await ContactUsModel.findOneAndDelete({ _id: req.query.id });
            return res.send({ message: "Record deleted successfully", status: 403, success: false })
        } catch (error) {
            console.log(error, "error");
        }
    }
}

exports = module.exports = ContactUsController;
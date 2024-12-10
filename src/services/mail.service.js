'use strict';

const nodemailer = require('nodemailer');

const mailconfig = {
    transport: {
        smtp: {
            host: `${process.env.SMTP_HOST}`,
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: `${process.env.SMTP_USER}`,
                pass: `${process.env.SMTP_PASSWORD}`
            },
            tls: {
                rejectUnauthorized: false
            }
        }
    },
    adminEmail: `${process.env.SMTP_ADMIN_EMAIL}`,
    mailOptions: {
        from: `"Digital Platform" <${process.env.SMTP_ADMIN_EMAIL}>`, // sender address
        sender: `${process.env.SMTP_SENDER}`,
        replyTo: `${process.env.SMTP_REPLYTO}`
    }
};
let _this;

class Mailer {
    constructor() {
        _this = this;
        _this.transporter = nodemailer.createTransport(
            mailconfig.transport.smtp);
        _this.mailOptions = mailconfig.mailOptions;
    }

    sendMail(to, subject, body, done) {
        _this.mailOptions["to"] = to;
        _this.mailOptions["subject"] = subject;
        _this.mailOptions["html"] = body;
        // send mail with defined transport object
        _this.transporter.sendMail(_this.mailOptions, (error, info) => {
            return done(error, info);
        });
    }
}
exports = module.exports = new Mailer();


/* //example code for testing 
'use strict';

const nodemailer = require('nodemailer');

const mailconfig = {
    transport: {
        smtp: {
            host: 'mail.24livehost.com', //smtp.gmail.com
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'ds24@24livehost.com',
                pass: 'DECg3dLITlWA'
            },
            tls: {
                rejectUnauthorized: false
            }
        }
    },
    adminEmail: `ds24@24livehost.com`,
    mailOptions: {
        from: `"Yakdot" <ds24@24livehost.com>`, // sender address
        sender: `ds24@24livehost.com`,
        replyTo: `ds24@24livehost.com`
    }
};
let _this;

class Mailer {
    constructor() {
        _this = this;
        _this.transporter = nodemailer.createTransport(
            mailconfig.transport.smtp);
        _this.mailOptions = mailconfig.mailOptions;
    }

    sendMail(to, subject, body, done) {
        _this.mailOptions["to"] = to;
        _this.mailOptions["subject"] = subject;
        _this.mailOptions["html"] = body;
        // send mail with defined transport object
        _this.transporter.sendMail(_this.mailOptions, (error, info) => {
            return done(error, info);
        });
    }
}
exports = module.exports = new Mailer();
*/
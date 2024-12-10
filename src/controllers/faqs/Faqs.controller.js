const mongoose = require('mongoose');
const FaqsModel = require('../../models/Faqs').FaqsModel;



class FaqsController {

    static async CreateFaqs(req, res, next) {
        try {
            if (!req.body.answer || !req.body.answer) {
                return res.send({ message: "All perameter are required", status: 401, success: false })
            }

            const Faqs = await FaqsModel.create({
                question: req.body.question,
                answer: req.body.answer
            });
            if (!Faqs) { return res.send({ message: "FAQ not created!", status: 401, success: false }) }

            return res.send({ message: "FAQ created successfully", status: 201, success: true });

        } catch (error) {
            console.log(error, "error");
        }
    }

    static async getAllFaqs(req, res, next) {
        try {
            const Faqs = await FaqsModel.find({}, { "question": 1, "answer": 1 });
            if (!Faqs) { return res.send({ message: "FAQs not found", status: 401, success: false }) }
            return res.send({ message: "FAQs fetch successfully", status: 201, success: true, Faqs });
        } catch (error) {
            console.log(error, "error");
        }
    }

    static async updatefaqs(req, res, next) {
        try {
            if (!req.body.id) { return res.send({ message: "id is not found", status: 401, success: false }) }

            const update = await FaqsModel.findOne({ _id: req.body.id });

            if (!update) { return res.send({ message: "FAQ details not found" }) }

            update.question = req.body.question ? req.body.question : update.question;
            update.answer = req.body.answer ? req.body.answer : update.answer;
            await update.save()

            return res.send({ message: "FAQ updated successfully", status: 200, success: true, update });
        } catch (error) {
            console.log(error, "error");
        }
    }


    static async removefaqs(req, res, next) {
        try {
            FaqsModel.findOne({ _id: req.body.id }, ((err, faqs) => {
                if (!faqs) {
                    return res.send({ message: "FAQ not found", success: false, status: 401 });
                }
                if (err) {
                    return res.send({ message: "An error was encounterd", status: 500, success: false })
                }
                faqs.remove((err, remove) => {
                    if (err) {
                        return res.send({ message: "An error was envountred", status: 401, success: false });
                    } else {
                        return res.send({ message: "FAQ deleted successfully", status: 200, success: true, remove });
                    }

                })
            }))
        } catch (error) {
            console.log(error, "error")
            return res.send({ message: "An error encountred", status: 500, success: false })
        }
    }

    static async getOne(req, res, next) {
        try {
            if (!req.query.id) { return res.send({ message: "FAQ id is required", status: 401, success: false }) }

            const faqs = await FaqsModel.findOne({ _id: req.query.id }, { "question": 1, "answer": 1 });
            if (!faqs) { return res.send({ message: "FAQ not found", status: 401, success: false }) }

            return res.send({ message: "FAQ found succssfully", status: 201, success: true, faqs })

        } catch (error) {
            console.log(error, "error");
            return res.sen({
                message: "An error encountred", status: 500, success: false
            });
        }
    }

    /* ---------------------------------User Api---------------------------- */
    static async getAllFaqsUser(req, res, next) {
        try {
            const Faqs = await FaqsModel.find({}, { "question": 1, "answer": 1 });
            if (!Faqs) { return res.send({ message: "FAQs are not found", status: 401, success: false }) }
            return res.send({ message: "FAQs are fetched successfully", status: 200, success: true, Faqs });
        } catch (error) {
            console.log(error, "error");
            return res.send({ message: 'An error encountred', status: 500, success: false })
        }
    }
}

exports = module.exports = FaqsController;
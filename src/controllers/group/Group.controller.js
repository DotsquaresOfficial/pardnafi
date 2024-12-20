const mongoose = require('mongoose');
const { GroupModel } = require('../../models/Group');
const FaqsModel = require('../../models/Faqs').FaqsModel;



class GroupController {

    static async createGroup(req, res, next) {
        try {
            // if (!req.body.groupImage || !req.body.groupName || !req.body.description) {
            //     return res.send({ message: "All perameter are required", status: 401, success: false })
            // }

            const group = await GroupModel.create({
                groupImage: req.body.groupImage,
                groupName: req.body.groupName,
                description:req.body.description,
                createdBy:"admin"
            });
            if (!group) { return res.send({ message: "Group not created!", status: 401, success: false }) }

            return res.send({ message: "Group created successfully", status: 201, success: true });

        } catch (error) {
            console.log(error, "error");
        }
    }

    static async getAllGroups(req, res, next) {
        try {
            const Faqs = await GroupModel.find({});
            if (!Faqs) { return res.send({ message: "Group not found", status: 401, success: false }) }
            return res.send({ message: "Group fetch successfully", status: 201, success: true,data: Faqs });
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
                        return res.send({ message: "FAQ deleted successfully", status: 200, success: true,data: remove });
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
            
            if (!req.query.id) { return res.send({ message: "Group id is required", status: 401, success: false }) }

            const faqs = await GroupModel.findOne({ _id: req.query.id },);
            if (!faqs) { return res.send({ message: "Group not found", status: 401, success: false }) }

            return res.send({ message: "Group found succssfully", status: 201, success: true,data: faqs })

        } catch (error) {
            console.log(error, "error");
            return res.sen({
                message: "An error encountred", status: 500, success: false
            });
        }
    }


    static async getFaqsByQuery(req, res, next) {
        try {
            // Check if the 'query' parameter is provided in the request
            if (!req.query.query) {
                return res.status(400).send({ 
                    message: "Query is required", 
                    status: 400, 
                    success: false 
                });
            }
    
            const searchQuery = req.query.query;
    
            // Perform case-insensitive search using $regex
            const faqs = await FaqsModel.find({
                $or: [
                    { question: { $regex: searchQuery, $options: "i" } },
                    { answer: { $regex: searchQuery, $options: "i" } },
                ]
            });
    
            // Check if any FAQs are found
            if (!faqs || faqs.length === 0) {
                return res.status(404).send({ 
                    message: "No FAQs found matching the query", 
                    status: 404, 
                    success: false 
                });
            }
    
            // Return the found FAQs
            return res.status(200).send({ 
                message: "FAQs found successfully", 
                status: 200, 
                success: true, 
                data: faqs 
            });
    
        } catch (error) {
            console.error(error, "error");
            return res.status(500).send({
                message: "An error occurred", 
                status: 500, 
                success: false
            });
        }
    }
    

    /* ---------------------------------User Api---------------------------- */
    static async getAllFaqsUser(req, res, next) {
        try {
            const Faqs = await FaqsModel.find({}, { "question": 1, "answer": 1 });
            if (!Faqs) { return res.send({ message: "FAQs are not found", status: 401, success: false }) }
            return res.send({ message: "FAQs are fetched successfully", status: 200, success: true,data: Faqs });
        } catch (error) {
            console.log(error, "error");
            return res.send({ message: 'An error encountred', status: 500, success: false })
        }
    }
}

exports = module.exports = GroupController;
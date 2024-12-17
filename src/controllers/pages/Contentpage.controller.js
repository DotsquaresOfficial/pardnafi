const mongoose = require('mongoose');
const PageModel = require('../../models/Pages').PagesModel;
const HeDecode = require('he');
class PagesController {
    static async createPageContent(req, res, next) {
        // try {
        //     let reqBody = req.body;

        //     const page = await PageModel.create({
        //         slug: reqBody.slug,
        //         title: reqBody.title,
        //         subTitle: reqBody.subTitle,
        //         description: reqBody.description,
        //     });

        //     if (!page) { return res.send({ message: "Somthing went wrong Page is not created", status: 200, success: false }) };
        //     return res.send({ message: "Page is created successfully", status: 200, success: true })

        // } catch (error) {
        //     console.log(error, "error");
        // }

        return res.send({});

    }

    static async getAllPages(req, res, next) {
        try {
            const pages = await PageModel.find({ isActive: true, isDeleted: false }, { "slug": 1, "title": 1, "subTitle": 1, "description": 1 });
            if (!pages) { return res.send({ message: "Pages are not found", status: 401, success: false }) };
            let updatedPages = pages && pages.length > 0 && pages.map((item) => {
                let obj = {
                    _id: item.id,
                    slug: item.slug,
                    title: HeDecode.decode(item.title),
                    subTitle: HeDecode.decode(item.subTitle),
                    description: HeDecode.decode(item.description)
                }
                return obj
            });
            return res.send({ message: "Pages are fetch successfully", status: 201, success: true, updatedPages })
        } catch (error) {
            console.log(error, "error");
        }
    }

    static async updateContent(req, res, next) {
        try {
            let reqbody = req.body;
            const update = await PageModel.findOne({ slug: reqbody.slug, isDeleted: false, isActive: true });
            if (!update) { return res.send({ message: "Page is not found for updation", success: false, status: 404 }) }
            update.slug = reqbody.slug ? reqbody.slug : update.slug;
            update.title = reqbody.title ? reqbody.title : update.title;
            update.subTitle = reqbody.subTitle ? reqbody.subTitle : update.subTitle;
            update.description = reqbody.description ? reqbody.description : update.description;
            await update.save();
            return res.send({ message: "Page content updated successfully", success: true, status: 200 })


        } catch (error) {
            console.log(error, "error");

            return res.status(400).send({ message: "An error has been encountered", status: 400, success: false })
        }
    }

    static async removePage(req, res, next) {
        try {
            if (!req.body.id) { return res.status(400).json({ message: "Page id is not found", success: false }); }
            const remove = await PageModel.findOne({ _id: req.body.id });
            if (remove.isDeleted) {
                return res.send({ message: "This page is no longer available", status: 401, success: false });
            }
            remove.isDeleted = remove.isDeleted ? false : true;
            await remove.save()
            return res.send({ message: "The page has been successfully deleted.", status: 200, success: true })
        } catch (error) {
            console.log(error, "error");

            return res.send({ message: "An error has been encountered", status: 200, success: false })
        }
    }

    static async fetchContnet(req, res, next) {
        try {

            if (!req.query.id) { return res.send({ message: "Page id is required", status: 401, success: false }) }

            const pageEnocoded = await PageModel.findOne({ _id: req.query.id, isActive: true });

            if (!pageEnocoded) { return res.send({ message: "Page is not found", status: 401, success: false }) }
            let page = {
                _id: pageEnocoded.id,
                isActive: pageEnocoded.isActive,
                isDeleted: pageEnocoded.isActive,
                slug: pageEnocoded.slug ? HeDecode.decode(pageEnocoded.slug) : pageEnocoded.slug,
                title: HeDecode.decode(pageEnocoded.title),
                subTitle: HeDecode.decode(pageEnocoded.subTitle),
                description: HeDecode.decode(pageEnocoded.description)
            }


            return res.send({ message: "Page found sucessfully", success: true, status: 201, page });
        } catch (error) {
            console.log(error, "error")
        }
    }

    static async aboutUs(req, res, next) {
        try {
            const about = await PageModel.findOne({ slug: "about_us", isDeleted: false, isActive: true }, { "slug": 1, "title": 1, "subTitle": 1, "description": 1, "isActive": 1 });
            if (!about) { return res.send({ message: "Page not found", status: 401, success: false }) }

            about.title = about ? HeDecode.decode(about.title) : "";
            about.subTitle = about ? HeDecode.decode(about.subTitle) : "";
            about.description = about ? HeDecode.decode(about.description) : "";

            return res.send({ message: "About us page fetched successfully", status: 201, success: true, about });
        } catch (error) {
            console.log(error, "error");
            return res.send({ message: "An error encountred", success: false, status: 500 });
        }
    }

    static async privacyPolicy(req, res, next) {
        try {
            const privacy = await PageModel.findOne({ slug: "privacy_policy", isDeleted: false, isActive: true }, { "slug": 1, "title": 1, "subTitle": 1, "description": 1, "isActive": 1 })

            if (!privacy) { return res.send({ message: "Privacy Policy page not found", status: 401, success: false }) }

            privacy.title = privacy ? HeDecode.decode(privacy.title) : "";
            privacy.subTitle = privacy ? HeDecode.decode(privacy.subTitle) : "";
            privacy.description = privacy ? HeDecode.decode(privacy.description) : "";

            return res.send({ message: "Privacy policy fetched successfully", status: 200, success: true, privacy });

        } catch (error) {
            console.log(error, "error");
            return res.send({ message: "An error encountred", status: 500, success: false });
        }
    }

    static async termAndCondition(req, res, next) {
        try {
            const termCondition = await PageModel.findOne({ slug: "term_&_condition", isDeleted: false, isActive: true }, { "slug": 1, "title": 1, "subTitle": 1, "description": 1, "isActive": 1 })

            if (!termCondition) { return res.send({ message: "Term and condition page not found", status: 401, success: false }) }

            termCondition.title = termCondition ? HeDecode.decode(termCondition.title) : "";
            termCondition.subTitle = termCondition ? HeDecode.decode(termCondition.subTitle) : "";
            termCondition.description = termCondition ? HeDecode.decode(termCondition.description) : "";

            return res.send({ message: "Term and condition fetched successfully", status: 200, success: true,data: termCondition });

        } catch (error) {
            console.log(error, "error");
            return res.send({ message: "An error encountred", status: 500, success: false });
        }
    }


}

exports = module.exports = PagesController;

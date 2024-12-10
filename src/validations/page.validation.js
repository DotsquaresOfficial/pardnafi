const Joi = require('joi');


const createPageContent = {
    body: Joi.object().keys({
        slug: Joi.string().required(),
        title: Joi.string().required(),
        subTitle: Joi.string().required(),
        description: Joi.string().required(),
    }),
};


const FaqsContent = {
    body: Joi.object().keys({
        question: Joi.string().required(),
        answer: Joi.string().required()
    })
};

const RemoveFaqs = {
    body: Joi.object().keys({
        id: Joi.string().required()
    })
}

module.exports = {
    createPageContent,
    FaqsContent,
    RemoveFaqs
};
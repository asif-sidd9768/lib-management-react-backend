const BaseJoi = require("joi").extend(require('@joi/date'))
const sanitizeHTML = require('sanitize-html')


const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        'string.escapeHTML': "{{#label}} must not include a HTML tag"
    },
    rules: {
        escapeHTML: {
            validate(value, helpers){
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if(clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean
            }
        }
    }
})

const Joi = BaseJoi.extend(extension)


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().escapeHTML(),
    }).required()
})

const date = new Date()

module.exports.goalSchema = Joi.object({
        title: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        priority: Joi.number().min(0).max(5).required(),
        deadline: Joi.date().format("YYYY-MM-DD").greater('now').required()
})

module.exports.booksBorrowedSchema = Joi.object({
    bookBorrowed: Joi.object({
        bookId: Joi.string().required(),
        bookName: Joi.string().required(),
        borrowedUserId: Joi.string().required(),
        borrowedUsername: Joi.string().required(),
        borrowedDate: Joi.date().required()
    }).required()
})
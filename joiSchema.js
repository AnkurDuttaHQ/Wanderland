const Joi = require('joi');
const reviews = require('./models/reviews');

module.exports.ListingSchema = Joi.object({
    listing: Joi.object({
     title: Joi.string().required().min(5),
     description: Joi.string().required().min(10),
     location : Joi.string().required(),
     country: Joi.string().required(),
     price: Joi.number().required().min(0),
    }).required()
});


module.exports.reviewSchema = Joi.object({
    reviews:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required(),
});
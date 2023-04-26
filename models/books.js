const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const bookSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    page: {
        type: Number,
        required: true,
    },
    cover: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        required: true,
    },
    readBy: [
        {
            type:Schema.Types.ObjectId,
            ref: 'ReadBy'
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    notes: [
        {
            type: {
                type: String,
                required: true,
            }
        }
    ]
})

module.exports = mongoose.model('Book', bookSchema);
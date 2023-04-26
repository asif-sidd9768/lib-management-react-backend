const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user')

const reviewSchema = new Schema({
    body: {
        type: String,
        
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Review', reviewSchema);
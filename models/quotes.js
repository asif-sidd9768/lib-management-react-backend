const mongoose = require('mongoose')
const Schema = mongoose.Schema

const quoteSchema = new Schema({
    text: {
        type: String,
        
    },
    author: {
        type: String,
        
    }
})

module.exports = mongoose.model('Quote', quoteSchema)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookBorrowedSchema = new Schema({
    bookId: {
        type: String,
        
    },
    bookName: {
        type: String,
        
    },
    borrowedUserId: {
        type: String,
        
    },
    borrowedUsername: {
        type: String,
        
    },
    borrowedDate: {
        type: Date,
        
    },
})

module.exports = mongoose.model('BookBorrowed', bookBorrowedSchema);
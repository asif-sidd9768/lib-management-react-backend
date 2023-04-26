const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Goal = require('./goal');
const BookBorrowed = require('./bookBorrowed');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    booksRead: [
        {
            bookId: String,
            bookName: String,
            doneReading: Boolean,
        }
    ],
    goals: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Goal',
        }
    ],
    booksBorrowed: [
        {
            type: Schema.Types.ObjectId,
            ref: 'BookBorrowed'
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);
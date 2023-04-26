const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoalSchema = new Schema({
    title: {
        type: String,
        
    },
    description: {
        type: String,
        
    },
    priority: {
        type: Number,
        
    },
    deadline: {
        type: Date,

    },
})

module.exports = mongoose.model('Goal', GoalSchema);
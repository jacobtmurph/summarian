const mongoose = require('mongoose');

const BoardSchema = {
    title: {
        type: String,
        required: true,
        unique: true
    },
    parents: {
        type: [String],
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book'
    }]
    
}

const Board = mongoose.model('Board', BoardSchema);
module.exports = Board;
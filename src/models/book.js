// Load modules
const mongoose = require('mongoose');

// Define the schema
const BookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    publicationInfo: {
        publisher: {
            type: String,
            required: true
        },
        publishedOn: {
            type: Date,
        }
    },
    summaries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Summary'
    }]
});

const Book = mongoose.model('Book', BookSchema);
module.exports = Book;
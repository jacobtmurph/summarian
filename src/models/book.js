// Load modules
const mongoose = require('mongoose');

// Define the schema
const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    OpenLibraryId: String,
    summaries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Summary'
    }]
});

const Book = mongoose.model('Book', BookSchema);
module.exports = Book;
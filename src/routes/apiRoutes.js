const express = require('express');
const Book = require('../models/book');
const Summary = require('../models/summary');

const router = express.Router();

// Redirect ot the book list route
router.get('/', (req, res) => res.redirect('/api/books'));

// Create a new user & add them to the database.
router.post('/user', (req, res, next) => {
    if (req.body.username &&
        req.body.emailAddress &&
        req.body.password) {
            
        }
})

// Get a list of all books in the databse.
router.get('/books', (req, res, next) => {
    return Book.find({}, {_id: false, title: true, author: true}, 
                    (err, results) => {
                        if(err) return next(err);
                        res.json(results);
                    });
});

// Create a new book & add it to the database.
router.post('/books', (req, res, next) => {
    // If a title for the book & author are provided.
    if (req.body.title && req.body.author) {
        // Set the appropriate, required data from the request for the Book Schema.
        const bookData = {
            title: req.body.title,
            author: req.body.author,
        };

        // If optional data is provided.
        if (req.body.publicationInfo) {
            // Add it to the data object.
            bookData.publicationInfo = {
                publisher: req.body.publicationInfo.publisher
            }
        };

        // Create the new book from the bookData object, and add it to the database.
        Book.create(bookData, (error, book) => {
            if (error) {
                error.status = 400;
                return next(error);
            } else {
                // Set the response location header & status, and end the response.
                res.location('/');
                res.status(201);
                return res.end();
            }
        })
    }
});

// Get the info for a specific book by providing it's _id.
router.get('/books/:bookId', (req, res, next) => {
    return Book.findById(req.params.bookId)
                        // Populate the summaries field with necessary data.
                        .populate({path: 'summaries', populate: [{path: 'postedBy', select: 'profileName'}]})
                        .exec((err, book, summaries, postedBy) => {
                            if(err) return next(err);
                            res.json(book);
                        });
});

module.exports = router;
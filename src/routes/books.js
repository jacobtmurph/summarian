// Load imports.
const express = require('express');
const Book = require('../models/book');
const Summary = require('../models/summary');
const ValidationError = require('mongoose').Error.ValidationError;

// Create an express router.
const bookRouter = express.Router();

// Get a list of all books in the database.
bookRouter.get('/', (req, res, next) => {
    // Find the books, and make only necessary information available.
    return Book.find({}, {title: true, author: true, summaries: true, OpenLibraryId: true}, 
        (err, results) => {
            if(err) return next(err);
            // Render the Booklist page, with the books we retrieved.
            res.render('booklist', {title: 'Book List', books: results})
        });
});

// Post a new book to the database.
bookRouter.post('/', (req, res, next) => {
    // Set the appropriate, required data from the request for the Book Schema.
    const bookData = {
        title: req.body.title,
        author: req.body.author,
        OpenLibraryId: req.body.OpenLibraryId ? req.body.OpenLibraryId : "",
    };

    // Create the new book from the bookData object, and add it to the database.
    Book.create(bookData, (error, book) => {
        if (error) {
            if (error instanceof ValidationError) {
                res.redirect('/booklist');
            } else {
                error.status = 400;
                return next(error);
            }
        } else {
            // Set the response location header & status, and end the response.
            res.redirect(`/booklist/${book._id}`);
        }
    });
});

// Get the info for a specific book.
bookRouter.get('/:bookId', (req, res, next) => {
    // Find the book by the provided Id.
    return Book.findById(req.params.bookId)
                        // Fill the summaries with necessary data.
                        .populate({path: 'summaries', populate: [{path: 'postedBy', select: ['username', 'profileName']}]})
                        .exec((err, book) => {
                            if(err) return next(err);
                            
                            // Render the book's page with the data from the database 
                             res.render('book-info', { title: book.title, book: book});
                        });
});

// Create a new summary for a book
bookRouter.post('/:bookId/summaries', (req, res, next) => {
    // Set the summary data for the create() method.
    const summaryData = {
        postedBy: res.locals.currentUser,
        bookRating: req.body.bookRating,
        summaryContent: req.body.summaryContent
    }
    
    // Create the summary
    Summary.create(summaryData, (error, summary) => {
        if (error) {
            // Reload the page, with no change if the necessary fields are not provided
            if (error instanceof ValidationError) {
                return res.redirect(`/booklist/${req.params.bookId}`);
            } else {
                error.status = 400;
                return next(error);
            }
        } else {
            // Add the Summary to the related book
            return Book.findByIdAndUpdate(req.params.bookId, {$push: {summaries: summary._id}}, (err, results) => { 
                if (err) {
                    err.status = 400;
                    return next(err);
                } else {
                    // Reload the page with the added summary
                    return res.redirect(`/booklist/${req.params.bookId}`);
                }
            })
        }
    })
});

// Export the router.
module.exports = bookRouter;
const express = require('express');
const Book = require('../models/book');
const Summary = require('../models/summary');
const ValidationError = require('mongoose').Error.ValidationError;


const bookRouter = express.Router();

bookRouter.get('/', (req, res, next) => {
    return Book.find({}, {title: true, author: true, summaries: true}, 
        (err, results) => {
            if(err) return next(err);
            res.render('booklist', {title: 'Book List', books: results})
        });
});

bookRouter.get('/:bookId', (req, res, next) => {
    return Book.findById(req.params.bookId)
                        .populate({path: 'summaries', populate: [{path: 'postedBy', select: ['username', 'profileName']}]})
                        .exec((err, book) => {
                            if(err) return next(err);
                         res.render('book-info', { title: book.title, book: book});
                        });
});

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


bookRouter.post('/:bookId/summaries', (req, res, next) => {
    const summaryData = {
        postedBy: res.locals.currentUser,
        bookRating: req.body.bookRating,
        summaryContent: req.body.summaryContent
    }
    
    
    Summary.create(summaryData, (error, summary) => {
        if (error) {
            if (error instanceof ValidationError) {
                return res.redirect(`/booklist/${req.params.bookId}`);
            } else {
                error.status = 400;
                return next(error);
            }
        } else {
            return Book.findByIdAndUpdate(req.params.bookId, {$push: {summaries: summary._id}}, (err, results) => { 
                if (err) {
                    err.status = 400;
                    return next(err);
                } else {
                    return res.redirect(`/booklist/${req.params.bookId}`);
                }
            })
        }
    })
});

module.exports = bookRouter;
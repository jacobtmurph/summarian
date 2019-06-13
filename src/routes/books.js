const express = require('express');
const Book = require('../models/book');
const Summary = require('../models/summary');
const ValidationError = require('mongoose').Error.ValidationError


const bookRouter = express.Router();

bookRouter.get('/', (req, res, next) => {
    return Book.find({}, {title: true, author: true}, 
        (err, results) => {
            if(err) return next(err);
            res.render('booklist', {title: 'Book List', books: results})
        });
});

bookRouter.get('/:bookId', (req, res, next) => {
    return Book.findById(req.params.bookId)
                        .populate({path: 'summaries', populate: [{path: 'postedBy', select: 'username'}]})
                        .exec((err, book) => {
                            if(err) return next(err);
                         res.render('book-info', { title: book.title, book: book});
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
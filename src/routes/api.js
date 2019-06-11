// Module imports.
const express = require('express');
const Book = require('../models/book');
const Summary = require('../models/summary');
const User = require('../models/user');
const checkLoggedIn = require('../middleware/checkLoggedIn');

// Create the router.
const router = express.Router();

// Redirect ot the book list route.
router.get('/', (req, res) => res.redirect('/api/books'));

// Get the currently logged in user & return non-sensitive information.
router.get('/users', checkLoggedIn, (req, res, next) => {
    User.findById(res.locals.user._id, {_id: false, password: false}, (err, user) => {
        if(err) return next(err);
        res.json(user);
    });
});

// Update the logged in user's information.
router.put('/users', checkLoggedIn, (req, res, next) => {
    User.findByIdAndUpdate(res.locals.user._id, req.body, (err, results) => {
        if (err) {
            err.status = 400;
            return next(err);
        } else {
            res.status(204);
            return res.end();
        }
    });
})

// Create a new user & add them to the database.
router.post('/users', (req, res, next) => {
    // If all the required fields are provided.
    if (req.body.username &&
        req.body.emailAddress &&
        req.body.password) {
            // Add the required information to a data object.
            const userData = {
                username: req.body.username,
                emailAddress: req.body.emailAddress,
                password: req.body.password,
                profileName: {
                    firstName: req.body.firstName ? req.body.firstName : undefined,
                    lastName: req.body.lastName ? req.body.lastName : undefined,
                },
            };

            // Add the user to the database & end the response.
            User.create(userData, (error, user) => {
                if (error) {
                    error.status = 400;
                    return next(error);
                } else {
                    res.location('/');
                    res.status(201);
                    return res.end('/');
                }
            })
        // If required fields are missing, return an error.
        } else {
            const err = new Error("Username, email, & password fields are required");
            err.status = 400;
            return next(err)
        }
});

// Get a list of all books in the databse.
router.get('/books', (req, res, next) => {
    return Book.find({}, {title: true, author: true}, 
                    (err, results) => {
                        if(err) return next(err);
                        res.json(results);
                    });
});

// Create a new book & add it to the database.
router.post('/books', checkLoggedIn, (req, res, next) => {
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
        });
    // If title & author fields are missing, return an error.
    } else {
        const err = new Error("Book title & author fields are required");
        err.status = 400;
        return next(err)
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

// Get all the summaries for a specific book.
router.get('/books/:bookId/summaries', (req, res, next) => {
    return Book.findById(req.params.bookId)
                        .populate({path: 'summaries', populate: [{path: 'postedBy', select: ['profileName', 'username']}]})
                        .exec((err, book) => {
                            if(err) return next(err);
                            res.json(book.summaries);
                        });
});

// Create a new summary for a book.
router.post('/books/:bookId/summaries', checkLoggedIn, (req, res, next) => {
    // if a rating and summary content are provided.
    if (req.body.bookRating && req.body.summaryContent) {
        // Add them to the data model, along with the current user's _id.
        const summaryData = {
            postedBy: res.locals.user._id,
            bookRating: req.body.bookRating,
            summaryContent: req.body.summaryContent
        };

        // Create the summary & add it to the database.
        Summary.create(summaryData, (error, summary) => {
            if (error) {
                error.status = 400;
                return next(error);
            } else {
                // Then add it to the related book model.
                return Book.findByIdAndUpdate(req.params.bookId, {$push: {summaries: summary._id}}, (err, results) => {
                    if (err) {
                        err.status = 400;
                        return next(err);
                    } else {
                        // Set the response location & status, then end the response.
                        res.location(`/books/${req.params.bookId}`);
                        res.status(201);
                        return res.end();
                    }
                });
            }
        });
    }
});

// Update an existing summary when provided with an Id.
router.put('/books/:bookId/summaries/summaryId', checkLoggedIn, (req, res, next) => {
    Summary.findByIdAndUpdate(summaryId, req.body, (err, results) => {
        if (err) {
            err.status = 400;
            return next(err);
        } else {
            res.status(204);
            return res.end();
        }
    });
});

module.exports = router;
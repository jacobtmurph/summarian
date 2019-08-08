// Load imports
const express = require('express');
const titleCase = require('title-case');
const Book = require('../models/book');

// Create the router
const searchRouter = express.Router();

searchRouter.get('/:query', (req, res, next) => {
    Book.find({"title": {$regex: `${titleCase(req.params.query)}`}}, {title: true, author: true, summaries: true, OpenLibraryId: true}, 
              (err, results) => {
                  if(err) return next(err);
                  res.render('booklist', {title: "Search Reults", books: results});
              });
});


module.exports = searchRouter;
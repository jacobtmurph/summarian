// Load Imports.
const express = require('express');
const User = require('../models/user');
const ValidationError = require('mongoose').Error.ValidationError;

// Create an express router.
const signupRouter = express.Router();

// Get the signup page.
signupRouter.get('/', (req, res) => res.render('signup', {title: "Create an Account"}));

// Post a new user to the database.
signupRouter.post('/', (req, res, next) => {
    // If both password fields don't match.
    if (req.body.password != req.body.confirmPassword) {
        // Create a new validation error.
        const err = new Error("Password fields do not match");
        err.status = 400;
        
        // Reload the page with the error. 
        return res.render('signup', {title: 'Error Creating Account', error: true, message: err.message});
    } else {
        // Set the user data
        const userData = {
            username: req.body.username,
            emailAddress: req.body.emailAddress,
            password: req.body.password,
            // If the Profile Name fields are provided, set them.
            profileName: {
                firstName: req.body.firstName ? req.body.firstName : undefined,
                lastName: req.body.lastName ? req.body.lastName : undefined,
            },
        };

        // Add the user to the database & end the response.
        User.create(userData, (error, user) => {
            if (error) {
                if (error instanceof ValidationError) {
                    // Reload the page with an error if required fields aren't filled.
                    return res.render('signup', {title: 'Error Creating Account', error: true});
                } else {
                    error.status = 400;
                    return next(error);
                }
            } else {
                // Redirect the user to the Booklist page.
                req.session.userId = user._id;
                res.redirect('/booklist');
            }
        })
    }
});

module.exports = signupRouter;
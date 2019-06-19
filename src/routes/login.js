const express = require('express');
const User = require('../models/user');

const loginRouter = express.Router();

// Get the login forum.
loginRouter.get('/', (req, res) => res.render('login', {title: "Log in"} ));

// Attempt to log in the user
loginRouter.post('/', (req, res, next) => {
    // If login credentials are provided 
    if (req.body.emailAddress && req.body.password) {
        // Use the User model's authenticate method to check if they match a given user.
        User.authenticate(req.body.emailAddress, req.body.password, function(error, user) {
            // Return an error if the login details don't match any users.
            if (error || !user) {
                const err = new Error("Wrong email or password provided");
                err.status = 401;
                return res.render('login', {title: "Login Error", error: err});
            } else {
                // Return the user to the response.
                req.session.userId = user._id;

                // Redirect the user to the Booklist page
                return res.redirect('/booklist');
            }
        });
    // Return an error if no credentials are provided. 
    } else {
        const err = new Error("All fields required");
        err.status = 401;
        return res.render('login', {title: "Login Error", error: err});
    }
});

module.exports = loginRouter;
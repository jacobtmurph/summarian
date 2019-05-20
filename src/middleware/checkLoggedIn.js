const express = require('express');
const auth = require('basic-auth');
const User = require('../models/user');

// Check if a user is logged in
function checkLoggedIn(req, res, next) {
    // Parse the authentication heafer.
    const credentials = auth(req);

    // If login credentials are provided 
    if (credentials) {
        // Use the User model's authenticate method to check if they match a given user.
        User.authenticate(credentials.name, credentials.pass, function(error, user) {
            // Return an error if the login details don't match any users.
            if (error || !user) {
                var err = new Error("Wrong email or password provided");
                err.status = 401;
                return next(err);
            } else {
                // Return the user to the response.
                res.locals.user = user;
                return next();
            }
        });
    // Return an error if no credentials are provided. 
    } else {
        res.status(401).json({message: "Access Denied: No credentials provided"});
    }
};

// Export the middleware.
module.exports = checkLoggedIn;
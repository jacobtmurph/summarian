const express = require('express');
const User = require('../models/user');
const ValidationError = require('mongoose').Error.ValidationError;

const signupRouter = express.Router();

signupRouter.get('/', (req, res) => res.render('signup', {title: "Create an Account"}));

signupRouter.post('/', (req, res, next) => {
    if (req.body.password != req.body.confirmPassword) {
        const err = new Error("Password fields do not match");
        err.status = 400;
        return res.render('signup', {title: 'Error Creating Account', error: true, message: err.message});
    } else {
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
                if (error instanceof ValidationError) {
                    return res.render('signup', {title: 'Error Creating Account', error: true});
                } else {
                    error.status = 400;
                    return next(error);
                }
            } else {
                res.redirect(`/profile/${user.id}`);
            }
        })
    }
});

module.exports = signupRouter;
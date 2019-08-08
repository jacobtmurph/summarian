// Load imports.
const apiRoutes = require('./api');
const bookRoutes = require('./books')
const express = require('express');
const loginRoutes = require('./login');
const searchRoutes = require('./search');
const signupRoutes= require('./signup');
const User = require('../models/user');



// Create a handler for the routes.
const router = express.Router();

router.get('/', (req, res) => {
    if (res.locals.currentUser) {
        res.redirect('/booklist');
    } else {
        res.redirect('/landing');
    }    
});

router.get('/landing', (req, res) => res.render('landing'));

// App routes
router.use('/signup', signupRoutes);

// Hook in the Login routes
router.use('/login', loginRoutes);

// Hook in the book routes
router.use('/booklist', bookRoutes);

// Hook in the search routes
router.use('/search', searchRoutes);

// display a user profile
router.get('/profile/:userId', (req, res, next) => {
    return User.findById(req.params.userId, (err, user) => {
        if(err) return next(err);
        res.render('profile', {user: user, title: user.username});
    });
});

// Hook in the internal api.
router.use('/api/', apiRoutes);

// Export the router.
module.exports = router;
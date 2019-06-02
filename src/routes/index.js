// Load imports.
const express = require('express');
const apiRoutes = require('./apiRoutes');

// Create a handler for the routes.
const router = express.Router();

router.get('/', (req, res) => res.render('landing'));

router.get('/layout', (req, res) => res.render('layout', {title: "layout"}));

// Hook in the internal api.
router.use('/api/', apiRoutes);

// Export the router.
module.exports = router;
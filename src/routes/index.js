// Load imports.
const express = require('express');
const apiRoutes = require('./apiRoutes');

// Create a handler for the routes.
const router = express.Router();

// Hook in the internal api.
router.use('/api', apiRoutes);

// Export the router.
module.exports = router;
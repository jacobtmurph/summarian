// Load imports.
const express = require('express');
const apiRoutes = require('./apiRoutes');

// Create a handler for the routes.
const router = express.Router();

router.get('/', (req, res) => res.send("Hello, Summarian"));

// Hook in the internal api.
router.use('/api/', apiRoutes);

// Export the router.
module.exports = router;
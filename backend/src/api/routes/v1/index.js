const express = require('express');
const ingestorRoutes = require('./ingestor.route');

const router = express.Router();

/**
* Ingestor routes
*/
router.use('/ingestor', ingestorRoutes);

module.exports = router;

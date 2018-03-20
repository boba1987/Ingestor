const express = require('express');
const ingestRoutes = require('./ingest.route');

const router = express.Router();

/**
* ingest routes
*/
router.use('/ingest', ingestRoutes);

module.exports = router;

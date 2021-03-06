const express = require('express');

const controller = require('../../controllers/ingest.controller');

const router = express.Router();

router
  .route('/')
  /**
  * Insert data in a database
  */
  .post(controller.create)
  .get(controller.get);

module.exports = router;

const express = require('express');

const controller = require('../../controllers/ingestor.controller');

const router = express.Router();

router
  .route('/')
  .post(controller.create);

module.exports = router;

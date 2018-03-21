const mongoose = require('mongoose');

const schema = {
  clientId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  clientName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  UID: {
    type: Number,
    required: false,
    unique: true,
    trim: true,
    lowercase: true,
  },
};

/**
 * Requirement collection Schema
 * @private
 */
const clientSchema = new mongoose.Schema(
  schema,
  {
    timestamps: true,
  },
);

/**
 * @typedef Client
 */
exports.Model = mongoose.model('Client', clientSchema);

// Export schema keys object
exports.object = schema;

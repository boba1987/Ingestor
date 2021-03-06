const mongoose = require('mongoose');

const schema = {
  clientId: {
    type: String,
    required: true,
    unique: false,
    trim: true,
    lowercase: true,
  },
  amount: {
    type: Number,
    required: true,
    unique: false,
    trim: true,
    lowercase: true,
  },
  inputDate: {
    type: String,
    required: false,
    unique: false,
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
const requirementSchema = new mongoose.Schema(
  schema,
  {
    timestamps: true,
  },
);

/**
 * @typedef Requirement
 */
exports.Model = mongoose.model('Requirement', requirementSchema);

// Export schema keys object
exports.object = schema;

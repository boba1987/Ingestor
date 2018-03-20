const mongoose = require('mongoose');

/**
 * Requirement collection Schema
 * @private
 */
const requirementSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    amount: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    inputDate: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * @typedef Requirement
 */
module.exports = mongoose.model('Requirement', requirementSchema);

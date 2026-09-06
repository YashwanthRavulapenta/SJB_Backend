const mongoose = require('mongoose');

const sareeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true
    },

    description: {
      type: String,
      trim: true
    },

    image: {
      type: String,
      required: true
    },

    imagePublicId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Saree', sareeSchema);
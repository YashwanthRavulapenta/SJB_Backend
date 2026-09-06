const mongoose = require('mongoose');

const jewellerySchema = new mongoose.Schema(
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

module.exports = mongoose.model('Jewellery', jewellerySchema);
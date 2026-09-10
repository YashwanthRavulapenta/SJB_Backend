const mongoose = require("mongoose");

const jewellerySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        image: {
            type: String,
            required: true
        },

        imagePublicId: {
            type: String
        },

        isAvailable: {
            type: Boolean,
            default: true
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Jewellery",
    jewellerySchema
);
const mongoose = require('mongoose');


const jewellerySchema = new mongoose.Schema({

    image: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    }

});


const Jewellery = mongoose.model(
    'Jewellery',
    jewellerySchema
);


module.exports = Jewellery;
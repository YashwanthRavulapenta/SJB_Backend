const mongoose = require('mongoose');


const sareeSchema = new mongoose.Schema({

    image: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    color: {
        type: String,
        required: true
    }

});


const Saree = mongoose.model(
    'Saree',
    sareeSchema
);


module.exports = Saree;
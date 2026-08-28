const mongoose = require('mongoose')

const sareeSchema = new mongoose.Schema({
    image : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    name : {
        type : String
    },
    color : {
        type : String
    },
    price : {
        type : Number,
        required : true
    }
})

const sareeModel = mongoose.model('Saree',sareeSchema)

module.exports = {
    sareeModel
}
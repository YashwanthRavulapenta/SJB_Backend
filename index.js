const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const sareeRouter = require('./routes/sareeRoutes');

const app = express();

app.use(cors());

app.use(express.json());


// IMAGE FILES
app.use('/uploads/sarees', express.static('uploads/sarees'));

app.use('/sarees', sareeRouter);


// DATABASE
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("database connected");
    })
    .catch((error) => {
        console.log("database Not connected");
        console.log(error);
    });


// SERVER
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
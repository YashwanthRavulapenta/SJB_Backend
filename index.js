const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const sareeRouter = require('./routes/sareeRoutes');

const app = express();

app.use(cors());

app.use(express.json());


// Serve images
app.use(
    '/uploads/sarees',
    express.static('uploads/sarees')
);


// Saree routes
app.use('/sarees', sareeRouter);


// MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("database connected");
    })
    .catch((error) => {
        console.log("database Not connected");
        console.log(error);
    });


// Server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const sareeRouter = require('./routes/sareeRoutes');

const app = express();

app.use(cors());

app.use(express.json());

// Make uploaded images accessible
app.use(
    '/uploads/sarees',
    express.static('uploads/sarees')
);


// MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("database connected");
    })
    .catch((error) => {
        console.log("database Not connected");
        console.log(error);
    });


// Saree routes
app.use('/sarees', sareeRouter);


// Server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
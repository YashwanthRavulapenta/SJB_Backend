const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const sareeRouter = require('./routes/sareeRoutes');

const app = express();

app.use(cors());
app.use(express.json());


// Serve saree images
app.use(
    '/uploads/sarees',
    express.static(
        path.join(__dirname, 'uploads', 'sarees')
    )
);


// Saree API
app.use('/sarees', sareeRouter);


// MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("database connected");
    })
    .catch((error) => {
        console.log("database error:", error);
    });


// Server
app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
});
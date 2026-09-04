const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const sareeRouter = require('./routes/sareeRoutes');

const app = express();


// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());


// ================= STATIC IMAGE FOLDER =================

// Makes images inside sareesFolder accessible

app.use(
    '/sareesFolder',
    express.static(
        path.join(__dirname, 'sareesFolder')
    )
);


// ================= ROUTES =================

app.use('/sarees', sareeRouter);


// ================= TEST ROUTE =================

app.get('/', (req, res) => {

    res.json({
        message: "Server is running"
    });

});


// ================= DATABASE CONNECTION =================

mongoose.connect(process.env.MONGO_URL)

    .then(() => {
        console.log("MongoDB connected");
    })

    .catch((error) => {
        console.log("Database error:", error.message);
    });


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});
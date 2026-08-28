const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const sareeRouter = require('./routes/sareeRoutes');

const app = express();

app.use(cors());

app.use(express.json());


// ================= IMAGES =================

const uploadPath = path.join(
    process.cwd(),
    'uploads',
    'sarees'
);

app.use(
    '/uploads/sarees',
    express.static(uploadPath)
);


// ================= SAREE API =================

app.use('/sarees', sareeRouter);


// ================= DATABASE =================

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("database connected");
    })
    .catch((error) => {
        console.log("database error:", error);
    });


// ================= SERVER =================

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
});
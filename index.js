const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config()
const sareeRouter = require('./routes/sareeRoutes');
const app = express();

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("database connected")
}).catch(()=>{
    console.log("database Not connected")
})

app.use('/sarees',sareeRouter);

app.listen(process.env.PORT, () => {
    console.log("Server running on port 3000");
});
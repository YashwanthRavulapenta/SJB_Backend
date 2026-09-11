require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const sareeRoutes = require('./routes/sareeRoutes');
const jewelleryRoutes = require('./routes/jewelleryRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");


const app = express();


// ==========================================
// DATABASE CONNECTION
// ==========================================

connectDB();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth",authRoutes);

app.use('/api/sarees', sareeRoutes);

app.use('/api/jewellery', jewelleryRoutes);

app.use('/api/appointments', appointmentRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders",orderRoutes);

app.use("/api/payment",paymentRoutes);



// ==========================================
// TEST ROUTE
// ==========================================

app.get('/', (req, res) => {

  res.send('SJB Backend API is Running 🚀');

});


// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});
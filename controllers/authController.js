const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");


// =====================================
// REGISTER USER
// =====================================

const registerUser = async (req, res) => {

    try {

        const {
            name,
            phone,
            password
        } = req.body;


        // Check required fields
        if (
            !name ||
            !phone ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, phone and password are required"
            });
        }


        // Validate phone
        if (!/^[0-9]{10}$/.test(phone)) {

            return res.status(400).json({
                success: false,
                message: "Enter a valid 10-digit phone number"
            });
        }


        // Validate password
        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }


        // Check whether phone already exists
        const existingUser =
            await User.findOne({ phone });


        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "Phone number already registered"
            });
        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user
        const user =
            await User.create({
                name,
                phone,
                password: hashedPassword
            });


        return res.status(201).json({

            success: true,

            message: "Registration successful",

            user: {
                id: user._id,
                name: user.name,
                phone: user.phone
            }
        });


    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to register user"
        });
    }
};



// =====================================
// LOGIN USER
// =====================================

const loginUser = async (req, res) => {

    try {

        const {
            phone,
            password
        } = req.body;


        // Check required fields
        if (
            !phone ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message: "Phone and password are required"
            });
        }


        // Find user
        const user =
            await User.findOne({ phone });


        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid phone number or password"
            });
        }


        // Compare password
        const passwordMatched =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatched) {

            return res.status(401).json({
                success: false,
                message: "Invalid phone number or password"
            });
        }


        // Create JWT
        const token =
            jwt.sign(
                {
                    userId: user._id
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "7d"
                }
            );


        return res.status(200).json({

            success: true,

            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                phone: user.phone
            }
        });


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to login user"
        });
    }
};



module.exports = {
    registerUser,
    loginUser
};
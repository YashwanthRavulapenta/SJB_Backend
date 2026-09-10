const Saree = require('../models/sareeModel');

const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = require('../utils/cloudinaryUpload');


// =====================================
// ADD SAREE
// =====================================

const addSaree = async (req, res) => {

    try {

        const {
            name,
            category,
            color,
            price
        } = req.body;


        console.log("REQ.BODY:", req.body);


        if (!req.file) {
            return res.status(400).json({
                message: 'Please upload an image'
            });
        }


        // Upload image to Cloudinary
        const result = await uploadToCloudinary(
            req.file.buffer,
            'sarees'
        );


        // Save in MongoDB
        const saree = await Saree.create({

            name,
            category,
            color,
            price,

            image: result.secure_url,

            imagePublicId: result.public_id

        });


        res.status(201).json({

            message: 'Saree added successfully',

            saree

        });


    } catch (error) {

        console.log('Add Saree Error:', error);

        res.status(500).json({

            message: 'Error adding saree',

            error: error.message

        });

    }

};


// =====================================
// GET ALL SAREES
// =====================================

const getSarees = async (req, res) => {

    try {

        const sarees = await Saree.find()
            .sort({ createdAt: -1 });

        res.status(200).json(sarees);

    } catch (error) {

        res.status(500).json({
            message: 'Error getting sarees'
        });

    }

};


// =====================================
// GET SINGLE SAREE
// =====================================

const getSareeById = async (req, res) => {

    try {

        const saree = await Saree.findById(req.params.id);

        if (!saree) {

            return res.status(404).json({
                message: 'Saree not found'
            });

        }

        res.status(200).json(saree);

    } catch (error) {

        res.status(500).json({
            message: 'Error getting saree'
        });

    }

};


// =====================================
// DELETE SAREE
// =====================================

const deleteSaree = async (req, res) => {

    try {

        const saree = await Saree.findById(req.params.id);

        if (!saree) {

            return res.status(404).json({
                message: 'Saree not found'
            });

        }

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(
            saree.imagePublicId
        );


        // Delete from MongoDB
        await Saree.findByIdAndDelete(req.params.id);


        res.status(200).json({
            message: 'Saree and image deleted successfully'
        });

    } catch (error) {

        console.log('Delete Error:', error);

        res.status(500).json({
            message: 'Error deleting saree'
        });

    }

};


module.exports = {

    addSaree,
    getSarees,
    getSareeById,
    deleteSaree

};
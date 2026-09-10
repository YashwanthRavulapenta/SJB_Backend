const Jewellery = require('../models/jewelleryModel');

const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = require('../utils/cloudinaryUpload');


// =====================================
// ADD JEWELLERY
// =====================================

const addJewellery = async (req, res) => {

    try {

        const { name, category, price } = req.body;

        if (!req.file) {

            return res.status(400).json({
                message: 'Please upload an image'
            });

        }

        // Upload image to Cloudinary
        const result = await uploadToCloudinary(
            req.file.buffer,
            'jewellery'
        );

        // Save jewellery in MongoDB
        const jewellery = await Jewellery.create({

            name,
            category,
            price,

            image: result.secure_url,

            imagePublicId: result.public_id

        });

        res.status(201).json({

            message: 'Jewellery added successfully',

            jewellery

        });

    } catch (error) {

        console.log('Add Jewellery Error:', error);

        res.status(500).json({

            message: 'Error adding jewellery',

            error: error.message

        });

    }

};


// =====================================
// GET ALL JEWELLERY
// =====================================

const getJewellery = async (req, res) => {

    try {

        const jewellery = await Jewellery.find()
            .sort({ createdAt: -1 });

        res.status(200).json(jewellery);

    } catch (error) {

        console.log('Get Jewellery Error:', error);

        res.status(500).json({

            message: 'Error getting jewellery',

            error: error.message

        });

    }

};


// =====================================
// GET SINGLE JEWELLERY
// =====================================

const getJewelleryById = async (req, res) => {

    try {

        const jewellery = await Jewellery.findById(
            req.params.id
        );

        if (!jewellery) {

            return res.status(404).json({

                message: 'Jewellery not found'

            });

        }

        res.status(200).json(jewellery);

    } catch (error) {

        console.log('Get Jewellery By ID Error:', error);

        res.status(500).json({

            message: 'Error getting jewellery',

            error: error.message

        });

    }

};


// =====================================
// DELETE JEWELLERY
// =====================================

const deleteJewellery = async (req, res) => {

    try {

        const jewellery = await Jewellery.findById(
            req.params.id
        );

        if (!jewellery) {

            return res.status(404).json({

                message: 'Jewellery not found'

            });

        }

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(
            jewellery.imagePublicId
        );

        // Delete from MongoDB
        await Jewellery.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({

            message: 'Jewellery and image deleted successfully'

        });

    } catch (error) {

        console.log('Delete Error:', error);

        res.status(500).json({

            message: 'Error deleting jewellery',

            error: error.message

        });

    }

};


module.exports = {

    addJewellery,

    getJewellery,

    getJewelleryById,

    deleteJewellery

};
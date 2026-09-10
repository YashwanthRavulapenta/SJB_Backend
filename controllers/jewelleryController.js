const Jewellery = require('../models/jewelleryModel');

const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = require('../utils/cloudinaryUpload');



// =====================================
// ADD JEWELLERY
// =====================================

const addJewellery = async (req, res) => {

    try {

        const {
            name,
            category,
            price
        } = req.body;


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

            message:
                'Jewellery added successfully',

            jewellery

        });


    } catch (error) {

        console.log(
            'Add Jewellery Error:',
            error
        );


        res.status(500).json({

            message:
                'Error adding jewellery',

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


        res.status(200).json(
            jewellery
        );


    } catch (error) {

        console.log(
            'Get Jewellery Error:',
            error
        );


        res.status(500).json({

            message:
                'Error getting jewellery',

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

                message:
                    'Jewellery not found'

            });

        }


        res.status(200).json(
            jewellery
        );


    } catch (error) {

        console.log(
            'Get Jewellery By ID Error:',
            error
        );


        res.status(500).json({

            message:
                'Error getting jewellery'

        });

    }

};



// =====================================
// UPDATE JEWELLERY
// =====================================

const updateJewellery = async (req, res) => {

    try {

        const {
            name,
            category,
            price
        } = req.body;


        // Find existing jewellery
        const jewellery = await Jewellery.findById(
            req.params.id
        );


        if (!jewellery) {

            return res.status(404).json({

                message:
                    'Jewellery not found'

            });

        }


        // =====================================
        // UPDATE NORMAL FIELDS
        // =====================================

        jewellery.name = name;

        jewellery.category = category;

        jewellery.price = price;



        // =====================================
        // IF NEW IMAGE IS SELECTED
        // =====================================

        if (req.file) {

            console.log(
                "New jewellery image received"
            );


            // ---------------------------------
            // Upload new image
            // ---------------------------------

            const result =
                await uploadToCloudinary(
                    req.file.buffer,
                    'jewellery'
                );


            // ---------------------------------
            // Delete old image
            // ---------------------------------

            if (jewellery.imagePublicId) {

                try {

                    await cloudinary.uploader.destroy(
                        jewellery.imagePublicId
                    );

                } catch (cloudinaryError) {

                    console.log(
                        "Old image deletion failed:",
                        cloudinaryError.message
                    );

                }

            }


            // ---------------------------------
            // Save new image
            // ---------------------------------

            jewellery.image =
                result.secure_url;

            jewellery.imagePublicId =
                result.public_id;

        }


        // =====================================
        // SAVE
        // =====================================

        const updatedJewellery =
            await jewellery.save();


        res.status(200).json({

            message:
                'Jewellery updated successfully',

            jewellery:
                updatedJewellery

        });


    } catch (error) {

        console.log(
            'Update Jewellery Error:',
            error
        );


        res.status(500).json({

            message:
                'Error updating jewellery',

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

                message:
                    'Jewellery not found'

            });

        }


        // Delete image from Cloudinary
        if (jewellery.imagePublicId) {

            await cloudinary.uploader.destroy(
                jewellery.imagePublicId
            );

        }


        // Delete from MongoDB
        await Jewellery.findByIdAndDelete(
            req.params.id
        );


        res.status(200).json({

            message:
                'Jewellery and image deleted successfully'

        });


    } catch (error) {

        console.log(
            'Delete Error:',
            error
        );


        res.status(500).json({

            message:
                'Error deleting jewellery',

            error: error.message

        });

    }

};



module.exports = {

    addJewellery,

    getJewellery,

    getJewelleryById,

    updateJewellery,

    deleteJewellery

};
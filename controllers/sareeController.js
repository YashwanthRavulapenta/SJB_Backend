const Saree = require('../models/sareeModel');

const cloudinary = require('../config/cloudinary');

const uploadToCloudinary =
    require('../utils/cloudinaryUpload');


// =====================================
// ADD SAREE
// =====================================

const addSaree = async (req, res) => {

    try {

        const {
            name,
            category,
            color,
            price,
            isAvailable
        } = req.body;


        console.log(
            "REQ.BODY:",
            req.body
        );


        // =====================================
        // IMAGE CHECK
        // =====================================

        if (!req.file) {

            return res.status(400).json({

                message:
                    'Please upload an image'

            });

        }


        // =====================================
        // UPLOAD IMAGE TO CLOUDINARY
        // =====================================

        const result =
            await uploadToCloudinary(
                req.file.buffer,
                'sarees'
            );


        // =====================================
        // AVAILABILITY
        // =====================================

        /*
            FormData sends values as strings.

            "true"  -> true
            "false" -> false

            If the field isn't sent,
            we make it available.
        */

        let availability = true;


        if (
            isAvailable !== undefined
        ) {

            availability =
                isAvailable === "false"
                    ? false
                    : true;

        }


        // =====================================
        // SAVE IN MONGODB
        // =====================================

        const saree =
            await Saree.create({

                name,

                category,

                color,

                price,

                image:
                    result.secure_url,

                imagePublicId:
                    result.public_id,

                isAvailable:
                    availability

            });


        // =====================================
        // RESPONSE
        // =====================================

        res.status(201).json({

            message:
                'Saree added successfully',

            saree

        });


    } catch (error) {

        console.log(
            'Add Saree Error:',
            error
        );


        res.status(500).json({

            message:
                'Error adding saree',

            error:
                error.message

        });

    }

};



// =====================================
// GET ALL SAREES
// =====================================

const getSarees = async (
    req,
    res
) => {

    try {

        const sarees =
            await Saree.find()
                .sort({
                    createdAt: -1
                });


        res.status(200).json(
            sarees
        );


    } catch (error) {

        console.log(
            'Get Sarees Error:',
            error
        );


        res.status(500).json({

            message:
                'Error getting sarees'

        });

    }

};



// =====================================
// GET SINGLE SAREE
// =====================================

const getSareeById = async (
    req,
    res
) => {

    try {

        const saree =
            await Saree.findById(
                req.params.id
            );


        if (!saree) {

            return res.status(404).json({

                message:
                    'Saree not found'

            });

        }


        res.status(200).json(
            saree
        );


    } catch (error) {

        console.log(
            'Get Saree By ID Error:',
            error
        );


        res.status(500).json({

            message:
                'Error getting saree'

        });

    }

};



// =====================================
// UPDATE SAREE
// =====================================

const updateSaree = async (
    req,
    res
) => {

    try {

        const {
            name,
            category,
            color,
            price,
            isAvailable
        } = req.body;


        // =====================================
        // FIND SAREE
        // =====================================

        const saree =
            await Saree.findById(
                req.params.id
            );


        if (!saree) {

            return res.status(404).json({

                message:
                    'Saree not found'

            });

        }


        // =====================================
        // UPDATE NORMAL FIELDS
        // =====================================

        saree.name =
            name;

        saree.category =
            category;

        saree.color =
            color;

        saree.price =
            price;


        // =====================================
        // UPDATE AVAILABILITY
        // =====================================

        if (
            isAvailable !== undefined
        ) {

            saree.isAvailable =
                isAvailable === "false"
                    ? false
                    : true;

        }


        // =====================================
        // NEW IMAGE
        // =====================================

        if (req.file) {

            console.log(
                "New saree image received"
            );


            // ---------------------------------
            // UPLOAD NEW IMAGE
            // ---------------------------------

            const result =
                await uploadToCloudinary(
                    req.file.buffer,
                    'sarees'
                );


            // ---------------------------------
            // DELETE OLD IMAGE
            // ---------------------------------

            if (
                saree.imagePublicId
            ) {

                try {

                    await cloudinary
                        .uploader
                        .destroy(
                            saree.imagePublicId
                        );


                } catch (
                    cloudinaryError
                ) {

                    console.log(
                        "Old image deletion failed:",
                        cloudinaryError.message
                    );

                }

            }


            // ---------------------------------
            // SAVE NEW IMAGE
            // ---------------------------------

            saree.image =
                result.secure_url;

            saree.imagePublicId =
                result.public_id;

        }


        // =====================================
        // SAVE
        // =====================================

        const updatedSaree =
            await saree.save();


        // =====================================
        // RESPONSE
        // =====================================

        res.status(200).json({

            message:
                'Saree updated successfully',

            saree:
                updatedSaree

        });


    } catch (error) {

        console.log(
            'Update Saree Error:',
            error
        );


        res.status(500).json({

            message:
                'Error updating saree',

            error:
                error.message

        });

    }

};



// =====================================
// DELETE SAREE
// =====================================

const deleteSaree = async (
    req,
    res
) => {

    try {

        const saree =
            await Saree.findById(
                req.params.id
            );


        if (!saree) {

            return res.status(404).json({

                message:
                    'Saree not found'

            });

        }


        // =====================================
        // DELETE CLOUDINARY IMAGE
        // =====================================

        if (
            saree.imagePublicId
        ) {

            await cloudinary
                .uploader
                .destroy(
                    saree.imagePublicId
                );

        }


        // =====================================
        // DELETE MONGODB DOCUMENT
        // =====================================

        await Saree.findByIdAndDelete(
            req.params.id
        );


        res.status(200).json({

            message:
                'Saree and image deleted successfully'

        });


    } catch (error) {

        console.log(
            'Delete Error:',
            error
        );


        res.status(500).json({

            message:
                'Error deleting saree',

            error:
                error.message

        });

    }

};



module.exports = {

    addSaree,

    getSarees,

    getSareeById,

    updateSaree,

    deleteSaree

};
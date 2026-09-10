const Jewellery = require("../models/jewelleryModel");

const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = require(
    "../utils/cloudinaryUpload"
);


// ======================================================
// HELPER
// ======================================================

const convertAvailability = (value, defaultValue = true) => {

    if (value === undefined || value === null) {
        return defaultValue;
    }

    if (typeof value === "boolean") {
        return value;
    }

    return String(value).toLowerCase() === "true";
};


// ======================================================
// ADD JEWELLERY
// ======================================================

const addJewellery = async (req, res) => {

    try {

        console.log("=================================");
        console.log("ADD JEWELLERY");
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        console.log("=================================");


        const {
            name,
            category,
            price,
            isAvailable
        } = req.body;


        // ==================================================
        // VALIDATION
        // ==================================================

        if (!name || !name.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Jewellery name is required"

            });

        }


        if (!category || !category.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Jewellery category is required"

            });

        }


        if (
            price === undefined ||
            price === null ||
            price === "" ||
            Number(price) < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Valid price is required"

            });

        }


        // ==================================================
        // IMAGE CHECK
        // ==================================================

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message:
                    "Please upload an image"

            });

        }


        // ==================================================
        // CONVERT AVAILABILITY
        // ==================================================

        const available =
            convertAvailability(
                isAvailable,
                true
            );


        console.log(
            "isAvailable received:",
            isAvailable
        );

        console.log(
            "isAvailable converted:",
            available
        );


        // ==================================================
        // UPLOAD TO CLOUDINARY
        // ==================================================

        const result =
            await uploadToCloudinary(
                req.file.buffer,
                "jewellery"
            );


        // ==================================================
        // CREATE JEWELLERY
        // ==================================================

        const jewellery =
            await Jewellery.create({

                name:
                    name.trim(),

                category:
                    category.trim(),

                price:
                    Number(price),

                image:
                    result.secure_url,

                imagePublicId:
                    result.public_id,

                isAvailable:
                    available

            });


        // ==================================================
        // RESPONSE
        // ==================================================

        res.status(201).json({

            success: true,

            message:
                "Jewellery added successfully",

            jewellery

        });


    } catch (error) {

        console.error(
            "ADD JEWELLERY ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Error adding jewellery",

            error:
                error.message

        });

    }

};


// ======================================================
// GET ALL JEWELLERY
// ======================================================

const getJewellery = async (req, res) => {

    try {

        const jewellery =
            await Jewellery
                .find()
                .sort({
                    createdAt: -1
                });


        res.status(200).json(
            jewellery
        );


    } catch (error) {

        console.error(
            "GET JEWELLERY ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Error getting jewellery",

            error:
                error.message

        });

    }

};


// ======================================================
// GET JEWELLERY BY ID
// ======================================================

const getJewelleryById = async (req, res) => {

    try {

        const jewellery =
            await Jewellery.findById(
                req.params.id
            );


        if (!jewellery) {

            return res.status(404).json({

                success: false,

                message:
                    "Jewellery not found"

            });

        }


        res.status(200).json(
            jewellery
        );


    } catch (error) {

        console.error(
            "GET JEWELLERY BY ID ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Error getting jewellery",

            error:
                error.message

        });

    }

};


// ======================================================
// UPDATE JEWELLERY
// ======================================================

const updateJewellery = async (req, res) => {

    try {

        const jewellery =
            await Jewellery.findById(
                req.params.id
            );


        // ==================================================
        // NOT FOUND
        // ==================================================

        if (!jewellery) {

            return res.status(404).json({

                success: false,

                message:
                    "Jewellery not found"

            });

        }


        // ==================================================
        // GET FORM DATA
        // ==================================================

        const {
            name,
            category,
            price,
            isAvailable
        } = req.body;


        console.log(
            "UPDATE JEWELLERY BODY:",
            req.body
        );


        // ==================================================
        // UPDATE NAME
        // ==================================================

        if (
            name !== undefined &&
            name.trim() !== ""
        ) {

            jewellery.name =
                name.trim();

        }


        // ==================================================
        // UPDATE CATEGORY
        // ==================================================

        if (
            category !== undefined &&
            category.trim() !== ""
        ) {

            jewellery.category =
                category.trim();

        }


        // ==================================================
        // UPDATE PRICE
        // ==================================================

        if (
            price !== undefined &&
            price !== ""
        ) {

            if (Number(price) < 0) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Price cannot be negative"

                });

            }

            jewellery.price =
                Number(price);

        }


        // ==================================================
        // UPDATE AVAILABILITY
        // ==================================================

        if (
            isAvailable !== undefined
        ) {

            jewellery.isAvailable =
                convertAvailability(
                    isAvailable,
                    jewellery.isAvailable
                );


            console.log(
                "UPDATED AVAILABILITY:",
                jewellery.isAvailable
            );

        }


        // ==================================================
        // NEW IMAGE
        // ==================================================

        if (req.file) {

            // ----------------------------------------------
            // UPLOAD NEW IMAGE
            // ----------------------------------------------

            const result =
                await uploadToCloudinary(
                    req.file.buffer,
                    "jewellery"
                );


            // ----------------------------------------------
            // DELETE OLD CLOUDINARY IMAGE
            // ----------------------------------------------

            if (
                jewellery.imagePublicId
            ) {

                try {

                    await cloudinary
                        .uploader
                        .destroy(
                            jewellery.imagePublicId
                        );


                } catch (cloudinaryError) {

                    console.error(
                        "OLD IMAGE DELETE ERROR:",
                        cloudinaryError.message
                    );

                }

            }


            // ----------------------------------------------
            // SAVE NEW IMAGE
            // ----------------------------------------------

            jewellery.image =
                result.secure_url;

            jewellery.imagePublicId =
                result.public_id;

        }


        // ==================================================
        // SAVE
        // ==================================================

        await jewellery.save();


        // ==================================================
        // RESPONSE
        // ==================================================

        res.status(200).json({

            success: true,

            message:
                "Jewellery updated successfully",

            jewellery

        });


    } catch (error) {

        console.error(
            "UPDATE JEWELLERY ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Error updating jewellery",

            error:
                error.message

        });

    }

};


// ======================================================
// DELETE JEWELLERY
// ======================================================

const deleteJewellery = async (req, res) => {

    try {

        const jewellery =
            await Jewellery.findById(
                req.params.id
            );


        // ==================================================
        // NOT FOUND
        // ==================================================

        if (!jewellery) {

            return res.status(404).json({

                success: false,

                message:
                    "Jewellery not found"

            });

        }


        // ==================================================
        // DELETE CLOUDINARY IMAGE
        // ==================================================

        if (
            jewellery.imagePublicId
        ) {

            try {

                await cloudinary
                    .uploader
                    .destroy(
                        jewellery.imagePublicId
                    );


            } catch (cloudinaryError) {

                console.error(
                    "CLOUDINARY DELETE ERROR:",
                    cloudinaryError.message
                );

            }

        }


        // ==================================================
        // DELETE MONGODB DOCUMENT
        // ==================================================

        await Jewellery.findByIdAndDelete(
            req.params.id
        );


        // ==================================================
        // RESPONSE
        // ==================================================

        res.status(200).json({

            success: true,

            message:
                "Jewellery and image deleted successfully"

        });


    } catch (error) {

        console.error(
            "DELETE JEWELLERY ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Error deleting jewellery",

            error:
                error.message

        });

    }

};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    addJewellery,

    getJewellery,

    getJewelleryById,

    updateJewellery,

    deleteJewellery

};
const Jewellery = require('../models/jewelleryModel');


// ================= CREATE =================

const createJewellery = async (req, res) => {

    try {

        const {
            name,
            category,
            price
        } = req.body;


        // Check image

        if (!req.file) {

            return res.status(400).json({
                message: "Image is required"
            });

        }


        // Image URL

        const image =
            `https://sjb-backend-01lg.onrender.com/jewelleryFolder/${req.file.filename}`;


        // Create Jewellery

        const jewellery = await Jewellery.create({

            name,
            category,
            price,
            image

        });


        res.status(201).json({

            message: "Jewellery created successfully",

            jewellery

        });

    } catch (error) {

        console.log("CREATE ERROR:", error);

        res.status(500).json({

            message: error.message

        });

    }

};


// ================= GET ALL =================

const getJewellery = async (req, res) => {

    try {

        const jewellery = await Jewellery.find();

        res.status(200).json(jewellery);

    } catch (error) {

        console.log("GET ERROR:", error);

        res.status(500).json({

            message: error.message

        });

    }

};


// ================= GET ONE =================

const getJewelleryById = async (req, res) => {

    try {

        const jewellery = await Jewellery.findById(
            req.params.id
        );


        if (!jewellery) {

            return res.status(404).json({

                message: "Jewellery not found"

            });

        }


        res.status(200).json(jewellery);

    } catch (error) {

        console.log("GET ONE ERROR:", error);

        res.status(500).json({

            message: error.message

        });

    }

};


// ================= UPDATE =================

const updateJewellery = async (req, res) => {

    try {

        const {
            name,
            category,
            price
        } = req.body;


        const updateData = {

            name,
            category,
            price

        };


        // If new image is uploaded

        if (req.file) {

            const image =
                `https://sjb-backend-01lg.onrender.com/jewelleryFolder/${req.file.filename}`;

            updateData.image = image;

        }


        const jewellery = await Jewellery.findByIdAndUpdate(

            req.params.id,

            updateData,

            {
                new: true,
                runValidators: true
            }

        );


        if (!jewellery) {

            return res.status(404).json({

                message: "Jewellery not found"

            });

        }


        res.status(200).json({

            message: "Jewellery updated successfully",

            jewellery

        });

    } catch (error) {

        console.log("UPDATE ERROR:", error);

        res.status(500).json({

            message: error.message

        });

    }

};


// ================= DELETE =================

const deleteJewellery = async (req, res) => {

    try {

        const jewellery = await Jewellery.findByIdAndDelete(
            req.params.id
        );


        if (!jewellery) {

            return res.status(404).json({

                message: "Jewellery not found"

            });

        }


        res.status(200).json({

            message: "Jewellery deleted successfully"

        });

    } catch (error) {

        console.log("DELETE ERROR:", error);

        res.status(500).json({

            message: error.message

        });

    }

};


// ================= EXPORT =================

module.exports = {

    createJewellery,
    getJewellery,
    getJewelleryById,
    updateJewellery,
    deleteJewellery

};
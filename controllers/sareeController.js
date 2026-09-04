const Saree = require('../models/sareeModel');


// ================= CREATE =================

const createSaree = async (req, res) => {

    try {

        const {
            category,
            name,
            price,
            color
        } = req.body;


        // Check image

        if (!req.file) {

            return res.status(400).json({

                message: "Image is required"

            });

        }


        // Image URL

        const image =
            `${req.protocol}://${req.get('host')}` +
            `/sareesFolder/${req.file.filename}`;


        // Create data

        const saree = await Saree.create({

            category,
            name,
            price,
            color,
            image

        });


        res.status(201).json({

            message: "Saree created successfully",

            saree

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ================= GET ALL =================

const getSarees = async (req, res) => {

    try {

        const sarees = await Saree.find();

        res.status(200).json(sarees);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ================= GET ONE =================

const getSareeById = async (req, res) => {

    try {

        const saree = await Saree.findById(
            req.params.id
        );


        if (!saree) {

            return res.status(404).json({

                message: "Saree not found"

            });

        }


        res.status(200).json(saree);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ================= UPDATE =================

const updateSaree = async (req, res) => {

    try {

        const {
            category,
            name,
            price,
            color
        } = req.body;


        const updateData = {

            category,
            name,
            price,
            color

        };


        // If new image is uploaded

        if (req.file) {

            const image =
                `${req.protocol}://${req.get('host')}` +
                `/sareesFolder/${req.file.filename}`;


            updateData.image = image;

        }


        const saree =
            await Saree.findByIdAndUpdate(

                req.params.id,

                updateData,

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!saree) {

            return res.status(404).json({

                message: "Saree not found"

            });

        }


        res.status(200).json({

            message: "Saree updated successfully",

            saree

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ================= DELETE =================

const deleteSaree = async (req, res) => {

    try {

        const saree =
            await Saree.findByIdAndDelete(
                req.params.id
            );


        if (!saree) {

            return res.status(404).json({

                message: "Saree not found"

            });

        }


        res.status(200).json({

            message: "Saree deleted successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ================= EXPORT =================

module.exports = {

    createSaree,
    getSarees,
    getSareeById,
    updateSaree,
    deleteSaree

};
const Saree = require('../models/sareeModel');


// ================= CREATE =================

const createSaree = async (req, res) => {

    try {

        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        // Check image
        if (!req.file) {
            return res.status(400).json({
                message: "Image is required"
            });
        }

        const {
            category,
            name,
            price,
            color
        } = req.body;


        const image =
            `${process.env.BASE_URL}/uploads/sarees/${req.file.filename}`;


        const saree = await Saree.create({

            image,
            category,
            name,
            price,
            color

        });


        res.status(201).json({

            message: "Saree created successfully",

            saree

        });

    } catch (error) {

        console.error(error);

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
                `${process.env.BASE_URL}/uploads/sarees/${req.file.filename}`;

            updateData.image = image;

        }


        const saree = await Saree.findByIdAndUpdate(

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


        res.json({

            message: "Saree updated successfully",

            saree

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }
};



// ================= DELETE =================

const deleteSaree = async (req, res) => {

    try {

        const saree = await Saree.findByIdAndDelete(
            req.params.id
        );


        if (!saree) {

            return res.status(404).json({
                message: "Saree not found"
            });

        }


        res.json({

            message: "Saree deleted successfully"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }
};



module.exports = {

    createSaree,
    updateSaree,
    deleteSaree

};
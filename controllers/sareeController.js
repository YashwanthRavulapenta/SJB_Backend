const Saree = require('../models/sareeModel');


// ================= CREATE =================

const createSaree = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                error: "Image is required"
            });
        }

        const {
            category,
            name,
            price,
            color
        } = req.body;

        const image =
            `https://sjb-backend-01lg.onrender.com/uploads/sarees/${req.file.filename}`;

        const saree = await Saree.create({
            image,
            category,
            name,
            price,
            color
        });

        res.status(201).json(saree);

    } catch (error) {

        console.log("CREATE ERROR:", error);

        res.status(500).json({
            error: error.message
        });

    }
};


// ================= GET ALL =================

const getSarees = async (req, res) => {

    try {

        const sarees = await Saree.find();

        res.status(200).json(sarees);

    } catch (error) {

        console.log("GET SAREES ERROR:", error);

        res.status(500).json({
            error: error.message
        });

    }
};


// ================= GET ONE =================

const getSareeById = async (req, res) => {

    try {

        const saree = await Saree.findById(req.params.id);

        if (!saree) {
            return res.status(404).json({
                error: "Saree not found"
            });
        }

        res.status(200).json(saree);

    } catch (error) {

        console.log("GET SAREE ERROR:", error);

        res.status(500).json({
            error: error.message
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

        if (req.file) {

            const image =
                `https://sjb-backend-01lg.onrender.com/uploads/sarees/${req.file.filename}`;

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
                error: "Saree not found"
            });
        }

        res.status(200).json(saree);

    } catch (error) {

        console.log("UPDATE ERROR:", error);

        res.status(500).json({
            error: error.message
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
                error: "Saree not found"
            });
        }

        res.status(200).json(saree);

    } catch (error) {

        console.log("DELETE ERROR:", error);

        res.status(500).json({
            error: error.message
        });

    }
};


module.exports = {
    createSaree,
    getSarees,
    getSareeById,
    updateSaree,
    deleteSaree
};
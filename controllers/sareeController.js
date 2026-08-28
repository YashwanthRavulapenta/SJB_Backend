const Saree = require('../models/sareeModel');

const createSaree = async (req, res) => {
    try {
        const myImage = `https://sjb-backend-01lg.onrender.com/uploads/sarees/${req.file.filename}`
        const { category, name, price, color } = req.body;

        const saree = await Saree.create({
            image: myImage,
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
        res.status(500).json({
            message: error.message
        });
    }
};


const deleteSaree = async (req, res) => {
    try {

        await Saree.findByIdAndDelete(req.params.id);

        res.json({
            message: "Saree deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const updateSaree = async (req, res) => {
    try {

        const { category, name, price, color } = req.body;
        

        const updateData = {
            category,
            name,
            price,
            color
        };

        if (req.file) {
            const myImage = `https://sjb-backend-01lg.onrender.com/uploads/sarees/${req.file.filename}`
            updateData.image = myImage;
        }

        const saree = await Saree.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json({
            message: "Saree updated successfully",
            saree
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createSaree,
    deleteSaree,
    updateSaree
};
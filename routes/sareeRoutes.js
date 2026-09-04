const express = require('express');
const multer = require('multer');
const path = require('path');

const {
    createSaree,
    getSarees,
    getSareeById,
    updateSaree,
    deleteSaree
} = require('../controllers/sareeController');


const sareeRouter = express.Router();


// ================= MULTER =================

const storage = multer.diskStorage({

    // Where image will be stored

    destination: (req, file, cb) => {

        cb(
            null,

            path.join(
                __dirname,
                '..',
                'sareesFolder'
            )

        );

    },


    // Image file name

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            '-' +
            file.originalname;

        cb(null, uniqueName);

    }

});


const upload = multer({
    storage
});


// ================= GET ALL =================

// GET /sarees

sareeRouter.get(
    '/',
    getSarees
);


// ================= GET ONE =================

// GET /sarees/:id

sareeRouter.get(
    '/:id',
    getSareeById
);


// ================= CREATE =================

// POST /sarees

sareeRouter.post(
    '/',
    upload.single('image'),
    createSaree
);


// ================= UPDATE =================

// PUT /sarees/:id

sareeRouter.put(
    '/:id',
    upload.single('image'),
    updateSaree
);


// ================= DELETE =================

// DELETE /sarees/:id

sareeRouter.delete(
    '/:id',
    deleteSaree
);


module.exports = sareeRouter;
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const {

    createJewellery,
    getJewellery,
    getJewelleryById,
    updateJewellery,
    deleteJewellery

} = require('../controllers/jewelleryController');


const jewelleryRouter = express.Router();


// ================= UPLOAD FOLDER =================

const uploadPath = path.join(

    __dirname,
    '..',
    'jewelleryFolder'

);


// Create jewelleryFolder automatically

if (!fs.existsSync(uploadPath)) {

    fs.mkdirSync(uploadPath, {

        recursive: true

    });

}


// ================= MULTER =================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, uploadPath);

    },


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

jewelleryRouter.get(

    '/',

    getJewellery

);


// ================= GET ONE =================

jewelleryRouter.get(

    '/:id',

    getJewelleryById

);


// ================= CREATE =================

jewelleryRouter.post(

    '/',

    upload.single('image'),

    createJewellery

);


// ================= UPDATE =================

jewelleryRouter.put(

    '/:id',

    upload.single('image'),

    updateJewellery

);


// ================= DELETE =================

jewelleryRouter.delete(

    '/:id',

    deleteJewellery

);


// ================= EXPORT =================

module.exports = jewelleryRouter;
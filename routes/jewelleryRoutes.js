const express = require('express');

const router = express.Router();

const upload = require('../middleware/upload');

const {
  addJewellery,
  getJewellery,
  getJewelleryById,
  deleteJewellery
} = require('../controllers/jewelleryController');


router.post(
  '/add',
  upload.single('image'),
  addJewellery
);


router.get(
  '/',
  getJewellery
);


router.get(
  '/:id',
  getJewelleryById
);


router.delete(
  '/:id',
  deleteJewellery
);


module.exports = router;
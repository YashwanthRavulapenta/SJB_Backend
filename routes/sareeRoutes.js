const express = require('express');

const router = express.Router();

const upload = require('../middleware/upload');

const {
  addSaree,
  getSarees,
  getSareeById,
  deleteSaree
} = require('../controllers/sareeController');


router.post(
  '/add',
  upload.single('image'),
  addSaree
);


router.get(
  '/',
  getSarees
);


router.get(
  '/:id',
  getSareeById
);


router.delete(
  '/:id',
  deleteSaree
);


module.exports = router;
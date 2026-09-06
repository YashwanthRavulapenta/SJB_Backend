const cloudinary = require('../config/cloudinary');


const uploadToCloudinary = (fileBuffer, folder) => {

  return new Promise((resolve, reject) => {

    const uploadStream = cloudinary.uploader.upload_stream(

      {
        folder: folder,

        resource_type: 'image',

        public_id: `${Date.now()}-${Math.round(
          Math.random() * 1000000
        )}`
      },

      (error, result) => {

        if (error) {
          reject(error);
        } else {
          resolve(result);
        }

      }
    );

    uploadStream.end(fileBuffer);

  });

};


module.exports = uploadToCloudinary;
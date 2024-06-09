const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async image => {
  const b64 = Buffer.from(image.buffer).toString('base64');
  const dataURI = 'data:' + image.mimetype + ';base64,' + b64;
  const uploadedImage = await cloudinary.uploader.upload(dataURI, {
    resource_type: 'image',
    folder: 'inventory_app',
    transformation: {height: 300, width: 300},
  });
  return uploadedImage;
}

module.exports = uploadImage;
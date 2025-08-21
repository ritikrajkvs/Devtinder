const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your credentials from .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'devtinder-profiles', // This folder will be created in your Cloudinary account
    allowed_formats: ['jpeg', 'png', 'jpg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Resizes images on upload
  },
});

const upload = multer({ storage: storage });

module.exports = upload;

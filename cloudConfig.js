const cloudinary = require('cloudinary').v2; // ✅ v2 is required
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderland_dev', // ✅ cloud folder name
    allowed_formats: ['jpeg', 'png', 'jpg'], // ✅ allowed file types
  },
});

module.exports = {
  cloudinary,
  storage
};

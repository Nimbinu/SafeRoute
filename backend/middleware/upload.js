const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directories if they don't exist
const hazardUploadDir = path.join(__dirname, '../uploads/hazards');
const profileUploadDir = path.join(__dirname, '../uploads/profiles');

if (!fs.existsSync(hazardUploadDir)) {
  fs.mkdirSync(hazardUploadDir, { recursive: true });
}

if (!fs.existsSync(profileUploadDir)) {
  fs.mkdirSync(profileUploadDir, { recursive: true });
}

// Configure storage for hazard photos
const hazardStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, hazardUploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `hazard-${uniqueSuffix}-${nameWithoutExt}${ext}`);
  }
});

// Configure storage for profile photos
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, profileUploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: profile-userId-timestamp.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `profile-${req.user.id}-${uniqueSuffix}${ext}`);
  }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Configure multer for hazard photos
const uploadHazardPhoto = multer({
  storage: hazardStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: fileFilter
});

// Configure multer for profile photos
const uploadProfilePhoto = multer({
  storage: profileStorage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB max file size for profiles
  },
  fileFilter: fileFilter
});

module.exports = {
  hazard: uploadHazardPhoto,
  profile: uploadProfilePhoto,
  // For backward compatibility
  single: (fieldName) => uploadHazardPhoto.single(fieldName)
};

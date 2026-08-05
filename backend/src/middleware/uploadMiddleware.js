const multer = require("multer");
const path = require("path");

// Memory Storage
const storage = multer.memoryStorage();

// File Filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png/;

    const extension = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimeType = allowedTypes.test(file.mimetype);

    if (extension && mimeType) {
        return cb(null, true);
    }

    cb(new Error("Only JPG, JPEG and PNG images are allowed."));
};

// Upload Middleware
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter,
});

module.exports = upload;
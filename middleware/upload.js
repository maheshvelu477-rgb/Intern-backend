const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/', // Must match the static path in server.js
    filename: function(req, file, cb) {
        // Create a unique filename: fieldname-timestamp-original_extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Check File Type
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only (jpeg, jpg, png, gif)!');
    }
}

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Max 1MB file size
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image'); // 'image' must match the field name in the frontend FormData

module.exports = upload;

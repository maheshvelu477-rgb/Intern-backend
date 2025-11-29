// utils/upload.js (Creating the Multer configuration)
const multer = require('multer');
const path = require('path');

// Set Storage Engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Ensure this folder exists: [root]/public/uploads/
        cb(null, './public/uploads/'); 
    }, 
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check File Type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Images only!'); 
    }
}

// Init Multer configuration
const uploadMulter = multer({
    storage: storage,
    limits: { 
        fileSize: 1000000 // 1MB limit
    }, 
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image'); 

// Dedicated middleware to handle Multer errors gracefully
const uploadMiddleware = (req, res, next) => {
    uploadMulter(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Handle Multer internal errors (e.g., file size limit exceeded)
            return res.status(400).json({ 
                success: false, 
                message: `File upload error: ${err.message}`
            });
        } 
        if (err) {
            // Handle custom errors (e.g., 'Images only!')
            return res.status(400).json({ success: false, message: err });
        }
        
        // Success: proceed to the controller
        next();
    });
};

module.exports = uploadMiddleware;

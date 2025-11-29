const Mentor = require('../models/Mentors'); 
const asyncHandler = require('../middleware/async');
const fs = require('fs');
const path = require('path');

// @desc    Get all mentors
// @route   GET /api/v1/mentors
// @access  Public (for now) / Private (for admin)
exports.getMentors = asyncHandler(async (req, res, next) => {
    const mentors = await Mentor.find().sort({ mentorname: 1 });
    res.status(200).json({
        success: true,
        count: mentors.length,
        data: mentors
    });
});

// @desc    Get single mentor
// @route   GET /api/v1/mentors/:id
// @access  Public (for now) / Private (for admin)
exports.getMentor = asyncHandler(async (req, res, next) => {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
        return res.status(404).json({ success: false, error: `Mentor not found with id of ${req.params.id}` });
    }

    res.status(200).json({ success: true, data: mentor });
});

// @desc    Add new mentor
// @route   POST /api/v1/mentors
// @access  Private (Admin only)
exports.addMentor = asyncHandler(async (req, res, next) => {
    // Check if an image was uploaded via multer
    if (req.file) {
        // Store the public path to the image
        req.body.image = `/uploads/${req.file.filename}`;
    }

    const mentor = await Mentor.create(req.body);
    res.status(201).json({
        success: true,
        data: mentor
    });
});

// @desc    Update mentor
// @route   PUT /api/v1/mentors/:id
// @access  Private (Admin only)
exports.updateMentor = asyncHandler(async (req, res, next) => {
    let mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
        return res.status(404).json({ success: false, error: `Mentor not found with id of ${req.params.id}` });
    }

    // Handle image update and cleanup old file
    if (req.file) {
        const oldImagePath = mentor.image;
        req.body.image = `/uploads/${req.file.filename}`;
        
        // Delete old image if it's not the default no-photo.jpg
        if (oldImagePath && oldImagePath !== '/uploads/no-photo.jpg') {
            const fullPath = path.join(__dirname, '..', 'public', oldImagePath);
            fs.unlink(fullPath, (err) => {
                if (err) console.error(`Error deleting old image: ${err.message}`);
            });
        }
    }

    // Update the mentor
    mentor = await Mentor.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: mentor });
});

// @desc    Delete mentor
// @route   DELETE /api/v1/mentors/:id
// @access  Private (Admin only)
exports.deleteMentor = asyncHandler(async (req, res, next) => {
    const mentor = await Mentor.findByIdAndDelete(req.params.id);

    if (!mentor) {
        return res.status(404).json({ success: false, error: `Mentor not found with id of ${req.params.id}` });
    }
    
    // Cleanup image on deletion
    if (mentor.image && mentor.image !== '/uploads/no-photo.jpg') {
        const fullPath = path.join(__dirname, '..', 'public', mentor.image);
        fs.unlink(fullPath, (err) => {
            if (err) console.error(`Error deleting image on mentor deletion: ${err.message}`);
        });
    }

    res.status(200).json({ success: true, data: {} });
});

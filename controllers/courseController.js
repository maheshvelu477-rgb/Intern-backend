// controllers/courseController.js

const Course = require('../models/Course');

// @desc      Get all courses
// @route     GET /api/v1/courses
exports.getCourses = async (req, res, next) => {
    try {
        // Fetch all courses from the database
        const courses = await Course.find(); 
        
        res.status(200).json({ 
            success: true, 
            count: courses.length,
            data: courses 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error fetching courses.' });
    }
};

// 🌟 MISSING FUNCTION ADDED: Get single course
// @desc      Get single course
// @route     GET /api/v1/courses/:id
exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ 
                success: false, 
                message: `Course not found with id of ${req.params.id}` 
            });
        }

        res.status(200).json({ success: true, data: course });
    } catch (err) {
        // Handle CastError for invalid ID format (e.g., ID too short)
        if (err.name === 'CastError') {
             return res.status(400).json({ success: false, message: `Invalid course ID format: ${req.params.id}` });
        }
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error fetching course.' });
    }
};

// @desc      Create new course
// @route     POST /api/v1/courses
exports.createCourse = async (req, res, next) => {
    try {
        if (req.file) {
            req.body.image = `/uploads/${req.file.filename}`;
        } else {
            if (!req.body.image) {
                req.body.image = 'no-photo.jpg'; 
            }
        }

        const course = await Course.create(req.body);
        
        res.status(201).json({ 
            success: true, 
            data: course 
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ 
                success: false, 
                message: messages.join(', ') 
            });
        }
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error: Could not create course.'
        });
    }
};

// @desc      Update course
// @route     PUT /api/v1/courses/:id
exports.updateCourse = async (req, res, next) => {
    try {
        if (req.file) {
            req.body.image = `/uploads/${req.file.filename}`;
        }

        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true 
        });

        if (!course) {
            return res.status(404).json({ success: false, message: `Course not found with id of ${req.params.id}` });
        }

        res.status(200).json({ success: true, data: course });

    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        // Handle CastError for invalid ID format
        if (err.name === 'CastError') {
             return res.status(400).json({ success: false, message: `Invalid course ID format.` });
        }
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error during update.' });
    }
};

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: `Course not found with id of ${req.params.id}` });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        // Handle CastError for invalid ID format
        if (err.name === 'CastError') {
             return res.status(400).json({ success: false, message: `Invalid course ID format.` });
        }
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error during deletion.' });
    }
};

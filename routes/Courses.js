// routes/Courses.js

const express = require('express');
const { getCourses,createCourse,getCourse,deleteCourse,updateCourse } = require('../controllers/courseController');
 const upload = require('../utils/upload'); // <--- IMPORT MULTER CONFIG

const router = express.Router(); 

// The POST route now uses the 'upload' middleware BEFORE the 'createCourse' controller
router.route('/')
    .get(getCourses) 
    .post(upload, createCourse); // <--- ADD upload middleware

router.route('/:id')
    .get(getCourse) // You might want to create a separate getCourseById controller for this
    .delete(deleteCourse)    
    .put(upload, updateCourse) // NOTE: If you update the image, you need to add 'upload' middleware here too: .put(upload, updateCourse)

module.exports = router;

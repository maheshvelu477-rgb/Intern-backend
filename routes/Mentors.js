const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // <-- Import the new upload middleware

const { 
    getMentors, 
    getMentor, 
    addMentor, 
    updateMentor, 
    deleteMentor 
} = require('../controllers/Mentors');

router.route('/')
    .get(getMentors)
    .post(upload, addMentor); // <-- Added upload middleware

router.route('/:id')
    .get(getMentor)
    .put(upload, updateMentor) // <-- Added upload middleware
    .delete(deleteMentor);

module.exports = router;

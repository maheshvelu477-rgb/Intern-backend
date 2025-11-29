const mongoose = require('mongoose'); 
// Removed unused CourseSchema

// Define the Mentor Schema
const MentorSchema = new mongoose.Schema({
    mentorname: {
        type: String,
        required: [true, 'Please add a mentor name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    position: {
        type: String,
        required: [true, 'Please add a position or title'],
        maxlength: [100, 'Position cannot be more than 100 characters']
    },
    details: {
        type: String,
        required: [true, 'Please add mentor details/bio'],
    },
    image: {
        type: String,
        default: '/uploads/no-photo.jpg' // Default image path
    },
    coursesTaught: {
        // This is an array of strings to hold the course names
        type: [String], 
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    } 
});

// Export the model, which will be named 'Mentor' in MongoDB
module.exports = mongoose.model('Mentor', MentorSchema);

const express = require('express');
const router = express.Router();
const authController = require('../controller/controllers'); // Import the controllers

// Homepage route
router.get('/', (req, res) => {
    res.render('homepage');
});

// Signup page route
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Handle signup form submission
router.post('/signup', authController.signup);

// Signin page route
router.get('/signin', (req, res) => {
    res.render('signin');
});

// Handle signin form submission
router.post('/signin', authController.signin);

router.get('/admin', (req, res) => {
    res.render('admin');
});

// Route to get user profile by ID number
router.get('/employee', authController.getEmployeeProfile);

// Save employment information
router.post('/employee/employment', authController.saveEmploymentInfo);

// Route to handle leave request submissions
router.post('/employee/leave', authController.submitLeaveRequest);


// Route to fetch leave requests for the employee profile
router.get('/employee/leave', authController.getLeaveRequests);


module.exports = router;

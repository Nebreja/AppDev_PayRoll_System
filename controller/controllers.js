const models = require('../model/models'); // Ensure this path is correct

// Signup controller
exports.signup = async (req, res) => {
    const userData = {
        last_name: req.body.last,
        first_name: req.body.first,
        middle_name: req.body.middle,
        dob: req.body.dob,
        gender: req.body.gender,
        status: req.body.status,
        contact_number: req.body.number,
        emergency_number: req.body.emernumber,
        address: req.body.address,
        email: req.body.email,
        id_number: req.body.idnum,
        password: req.body.password
    };

    try {
        await models.createUser(userData);
        res.redirect('/signin'); // Redirect to signin page after successful signup
    } catch (err) {
        res.status(500).send("Error creating user: " + err.message);
    }
};

// Signin controller
exports.signin = async (req, res) => {
    const idnum = req.body.idnum; 
    const password = req.body.password;

    try {
        const user = await models.findUserByIdNum(idnum);
        if (!user) {
            return res.status(401).send("User not found.");
        }

        const isMatch = await models.verifyPassword(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid password.");
        }

        // Password is valid, redirect to employee.js with the user's ID
        res.redirect(`/employee?idnum=${idnum}`);
    } catch (err) {
        res.status(500).send("Error processing request: " + err.message);
    }
};

// Add employment information
exports.saveEmploymentInfo = async (req, res) => {
    const employmentData = {
        id_number: req.body.idnum,
        employment_type: req.body.employmenttype,
        department: req.body.department,
        hire_date: req.body.hireDate,
        position: req.body.position,
        salary_rate: req.body.rate,
        bank_name: req.body.bankname,
        account_holder_name: req.body.accountname,
        account_number: req.body.accountnum,
        routing_number: req.body.routingnum
    };

    try {
        await models.createEmploymentInfo(employmentData);
        res.redirect(`/employee?idnum=${employmentData.id_number}`); // Redirect back to employee profile
    } catch (err) {
        res.status(500).send("Error saving employment information: " + err.message);
    }
};

// Fetch user data and render the employee page
// Fetch user data and render the employee page
exports.getEmployeeProfile = async (req, res) => {
    const idnum = req.query.idnum;

    if (!idnum) {
        return res.status(400).send("ID number is required.");
    }

    try {
        const user = await models.findUserByIdNum(idnum);
        if (!user) {
            return res.status(404).send("User not found.");
        }

        const employmentInfo = await models.getEmploymentInfoByIdNum(idnum);
        const leaveRequests = await models.getLeaveRequestsByIdNum(idnum); // Fetch leave requests

        // Render the employee page with user, employmentInfo, and leaveRequests
        res.render('employee', { user, employmentInfo: employmentInfo || {}, leaveRequests: leaveRequests || [] }); // Ensure leaveRequests is an empty array if not found
    } catch (err) {
        res.status(500).send("Error retrieving data: " + err.message);
    }
};


// Submit leave request
exports.submitLeaveRequest = async (req, res) => {
    const leaveData = {
        id_number: req.body.idnum, // Check that this is being set correctly
        subject: req.body.subject,
        leave_type: req.body.leaveType,
        leave_date: req.body.leavedate,
        end_date: req.body.enddate,
        message: req.body.message,
        status: 'Pending' // Set the initial status as 'Pending'
    };

    console.log("Leave Data:", leaveData); // Log leave data for debugging

    try {
        await models.createLeaveRequest(leaveData);
        res.redirect(`/employee?idnum=${leaveData.id_number}`); // Redirect back to the employee profile
    } catch (err) {
        res.status(500).send("Error submitting leave request: " + err.message);
    }
};



// Fetch leave requests for the employee profile
exports.getLeaveRequests = async (req, res) => {
    const idnum = req.query.idnum;

    try {
        const leaveRequests = await models.getLeaveRequestsByIdNum(idnum);
        res.render('employee', { user: req.user, employmentInfo: req.employmentInfo, leaveRequests });
    } catch (err) {
        res.status(500).send("Error retrieving leave requests: " + err.message);
    }
};

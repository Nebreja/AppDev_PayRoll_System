const models = require('../model/models');

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
        password: req.body.password // Ensure to hash this before saving
    };

    try {
        await models.createUser(userData); // Ensure createUser hashes the password
        res.redirect('/signin');
    } catch (err) {
        res.status(500).send("Error creating user: " + err.message);
    }
};

// Signin controller
exports.signin = async (req, res) => {
    const { idnum, password } = req.body;

    try {
        const user = await models.findUserByIdNum(idnum);
        if (!user) return res.status(401).send("User not found.");

        const isMatch = await models.verifyPassword(password, user.password);
        if (!isMatch) return res.status(401).send("Invalid password.");

        req.session.userId = user.id_number; // Store user ID in session
        req.session.role = user.role; // Store user role in session for later use

        console.log('User signed in:', req.session.userId); // Debug log
        
        // Check user role and redirect accordingly
        if (user.role === 'Employee') {
            res.redirect('/employee');
        } else if (user.role === 'Admin') {
            res.redirect('/admin');
        } else {
            res.status(403).send("Unauthorized role."); // Handle unexpected roles
        }
    } catch (err) {
        res.status(500).send("Error processing request: " + err.message);
    }
};

// In your controller file (e.g., controllers.js)
exports.renderAdminPage = (req, res) => {
    res.render('admin'); // Ensure you have an admin.ejs view
};



// Logout controller
exports.logout = (req, res) => {
    console.log('Logging out user:', req.session.userId); // Log current user ID
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send("Error logging out.");
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.redirect('/signin');
    });
};

// Get employee profile
exports.getEmployeeProfile = async (req, res) => {
    const idnum = req.session.userId;

    if (!idnum) return res.redirect('/signin'); // Ensure redirect if session ID is not present

    try {
        const user = await models.findUserByIdNum(idnum);
        if (!user) return res.status(404).send("User not found.");

        const employmentInfo = await models.getEmploymentInfoByIdNum(idnum);
        const leaveRequests = await models.getLeaveRequestsByIdNum(idnum);
        const holidays = await models.getAllHolidays(); // Fetch holidays

        // Pass holidays to the view
        res.render('employee', { user, employmentInfo: employmentInfo || {}, leaveRequests: leaveRequests || [], holidays: holidays || [] });
    } catch (err) {
        res.status(500).send("Error retrieving data: " + err.message);
    }
};
exports.updateProfile = async (req, res) => {
    const { last, first, middle, dob, gender, status, number, emernumber, address, email, idnum } = req.body;
    const userData = {
        last_name: last,
        first_name: first,
        middle_name: middle,
        dob,
        gender,
        status,
        contact_number: number,
        emergency_number: emernumber,
        address,
        email,
        id_number: idnum
    };

    try {
        await models.updateUserProfile(userData);
        res.redirect('/employee'); // Or the appropriate page after updating
    } catch (err) {
        res.status(500).send("Error updating profile: " + err.message);
    }
};

// Save employment information
exports.saveEmploymentInfo = async (req, res) => {
    const employmentData = {
        id_number: req.session.userId,
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
        res.redirect('/employee');
    } catch (err) {
        res.status(500).send("Error saving employment information: " + err.message);
    }
};

exports.updateEmploymentInfo = async (req, res) => {
    const { idnum, employmenttype, department, hireDate, position, rate, bankname, accountname, accountnum, routingnum } = req.body;

    try {
        // Check if the employee exists by their ID number
        const employee = await models.findUserByIdNum(idnum);
        if (!employee) {
            return res.status(404).send("Employee not found");
        }

        // Create the data to update in the employment_info table
        const employmentData = {
            id_number: idnum,
            employment_type: employmenttype,
            department: department,
            hire_date: hireDate,
            position: position,
            salary_rate: rate,
            bank_name: bankname,
            account_holder_name: accountname,
            account_number: accountnum,
            routing_number: routingnum
        };

        // Update the employment info
        await models.updateEmploymentInfo(idnum, employmentData);

        // Optionally, redirect to a success page or show a success message
        res.redirect('/employee/profile'); // Or you can render the updated profile page
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating employment information: " + err.message);
    }
};


// Submit leave request
exports.submitLeaveRequest = async (req, res) => {
    const leaveData = {
        id_number: req.session.userId,
        subject: req.body.subject,
        leave_type: req.body.leaveType,
        leave_date: req.body.leavedate,
        end_date: req.body.enddate,
        message: req.body.message,
        status: 'Pending'
    };

    try {
        await models.createLeaveRequest(leaveData);
        res.redirect('/employee');
    } catch (err) {
        res.status(500).send("Error submitting leave request: " + err.message);
    }
};

// Fetch leave requests for the employee profile
exports.getLeaveRequests = async (req, res) => {
    const idnum = req.session.userId;

    try {
        const leaveRequests = await models.getLeaveRequestsByIdNum(idnum);
        res.render('employee', { user: req.user, employmentInfo: req.employmentInfo, leaveRequests });
    } catch (err) {
        res.status(500).send("Error retrieving leave requests: " + err.message);
    }
};

exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.redirect('/signin'); // Redirect to sign-in if not authenticated
    }
};

exports.renderAdminPage = async (req, res) => {
    try {
        const employees = await models.getAllEmployees(); // Fetch employees
        const leaveRequests = await models.getAllLeaveRequests(); // Fetch leave requests
        const holidays = await models.getAllHolidays(); // Fetch all holidays
        const departments = await models.getAllDepartments(); // Fetch or define your departments

        res.render('admin', { employees, leaveRequests, holidays, departments }); // Pass both to the EJS view
    } catch (err) {
        res.status(500).send("Error retrieving data: " + err.message);
    }
};

exports.getEmployeesByDepartment = async (req, res) => {
    const { departmentName } = req.query; // Get the department name from the query

    try {
        const employees = await models.getEmployeesByDepartment(departmentName); // Fetch employees for the selected department
        const leaveRequests = await models.getAllLeaveRequests(); // Optional: Fetch leave requests if needed
        const departments = models.getAllDepartments(); // Fetch all departments for the dropdown
        const holidays = await models.getAllHolidays(); // Fetch holidays

        res.render('admin', { employees, leaveRequests, departments, holidays }); // Render admin page with employees and holidays
    } catch (err) {
        res.status(500).send("Error retrieving data: " + err.message);
    }
};


exports.addHoliday = async (req, res) => {
    // Destructure the incoming holiday data from the request body
    const { title, description, start_date, end_date } = req.body;

    // Log the incoming data for debugging
    console.log('Received holiday data:', req.body); // Log the incoming data

    // Validate the input
    if (!title || !start_date || !end_date) {
        return res.status(400).json({ message: 'Title, start date, and end date are required.' });
    }

    try {
        // Call the createHoliday function to save the holiday to the database
        await models.createHoliday({ title, description, start_date, end_date });
        res.status(201).json({ message: 'Holiday added successfully' });
    } catch (err) {
        // Handle any errors that occur during the saving process
        res.status(500).json({ message: 'Error adding holiday: ' + err.message });
    }
};
// Fetch holidays
exports.getHolidays = async (req, res) => {
    try {
        const holidays = await models.getAllHolidays(); // Ensure this retrieves created_at along with other fields
        res.render('admin', { holidays }); // Pass holidays to the EJS view
    } catch (err) {
        res.status(500).send("Error retrieving holidays: " + err.message);
    }
};

// Fetch holidays for the employee profile
exports.getHolidaysForEmployee = async (req, res) => {
    try {
        const holidays = await models.getAllHolidays(); // Fetch all holidays
        res.render('employee', { holidays }); // Render employee view with holidays
    } catch (err) {
        res.status(500).send("Error retrieving holidays: " + err.message);
    }
};

exports.getEmployeeInfo = (req, res) => {
    const idNumber = req.params.idNumber;

    EmployeeModel.getEmployeeInfo(idNumber, (err, employeeData) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching data', error: err });
        }
        if (!employeeData) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employeeData); // Respond with the employee data in JSON format
    });
};

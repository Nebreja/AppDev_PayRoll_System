
const db = require('../connection/db'); // Adjust the path as necessary
const bcrypt = require('bcrypt');

// Create a new user in the database
const createUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const query = `
    INSERT INTO users (last_name, first_name, middle_name, dob, gender, status, contact_number, emergency_number, address, email, id_number, password, created_at, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DEFAULT, 'Employee')
    `;
    const data = [
        userData.last_name,
        userData.first_name,
        userData.middle_name,
        userData.dob,
        userData.gender,
        userData.status,
        userData.contact_number,
        userData.emergency_number,
        userData.address,
        userData.email,
        userData.id_number,
        hashedPassword
    ];

    return new Promise((resolve, reject) => {
        db.query(query, data, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

// Find a user by ID number for signin and validate password
const findUserByIdNum = (idnum) => {
    const query = 'SELECT * FROM users WHERE id_number = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [idnum], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return resolve(null); // User not found
            resolve(results[0]); // Return the user
        });
    });
};

// Verify password
const verifyPassword = (enteredPassword, storedPassword) => {
    return bcrypt.compare(enteredPassword, storedPassword);
};

// Create employment information
const createEmploymentInfo = (employmentData) => {
    const query = `
    INSERT INTO employment_info (id_number, employment_type, department, hire_date, position, salary_rate, bank_name, account_holder_name, account_number, routing_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const data = [
        employmentData.id_number,
        employmentData.employment_type,
        employmentData.department,
        employmentData.hire_date,
        employmentData.position,
        employmentData.salary_rate,
        employmentData.bank_name,
        employmentData.account_holder_name,
        employmentData.account_number,
        employmentData.routing_number
    ];

    return new Promise((resolve, reject) => {
        db.query(query, data, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

// Get employment information by ID number
const getEmploymentInfoByIdNum = (idnum) => {
    const query = 'SELECT * FROM employment_info WHERE id_number = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [idnum], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]); // Return employment info
        });
    });
};

// Create leave request
const createLeaveRequest = (leaveData) => {
    const query = `
    INSERT INTO leave_requests (id_number, subject, leave_type, leave_date, end_date, message, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const data = [
        leaveData.id_number,
        leaveData.subject,
        leaveData.leave_type,
        leaveData.leave_date,
        leaveData.end_date,
        leaveData.message,
        leaveData.status
    ];

    return new Promise((resolve, reject) => {
        db.query(query, data, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};


// Get leave requests by ID number
const getLeaveRequestsByIdNum = (idnum) => {
    const query = 'SELECT * FROM leave_requests WHERE id_number = ? ORDER BY created_at DESC';
    return new Promise((resolve, reject) => {
        db.query(query, [idnum], (err, results) => {
            if (err) return reject(err);
            resolve(results); // Return all leave requests
        });
    });
};

// Get all users with the role of Employee
const getAllEmployees = () => {
    const query = 'SELECT * FROM users WHERE role = "Employee"';
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results); // Return all employees
        });
    });
};
// Get all leave requests
const getAllLeaveRequests = () => {
    const query = 'SELECT * FROM leave_requests ORDER BY created_at DESC';
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results); // Return all leave requests
        });
    });
};
// Get all employees by department
const getEmployeesByDepartment = (departmentName) => {
    const query = `
    SELECT users.* FROM users
    JOIN employment_info ON users.id_number = employment_info.id_number
    WHERE users.role = 'Employee' AND employment_info.department = ?
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [departmentName], (err, results) => {
            if (err) return reject(err);
            resolve(results); // Return employees in the specified department
        });
    });
};

// Get all departments
const getAllDepartments = () => {
    // This function can be a simple static array if you don't have a separate departments table
    return ['Sales Department', 'Service Department', 'Parts Department', 'Finance and Accounting Department', 'Marketing Department',
        'Human Resources Department', 'Customer Relations Department', 'IT Department', 'Security Department', 'Logistics and Transport Department',
        'Cleaning Department'
    ]; // Example department names
};

const createHoliday = async (holidayData) => {
    const query = `
    INSERT INTO holidays (title, description, start_date, end_date)
    VALUES (?, ?, ?, ?)
    `;
    const data = [
        holidayData.title,
        holidayData.description,
        holidayData.start_date,
        holidayData.end_date
    ];

    return new Promise((resolve, reject) => {
        db.query(query, data, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};
const getAllHolidays = () => {
    const query = 'SELECT * FROM holidays ORDER BY start_date'; // Adjust the order as needed
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results); // Return all holidays
        });
    });
};

const getEmployeeInfo = (idNumber, callback) => {
    const query = `
        SELECT u.id_number, u.last_name, u.first_name, u.middle_name, u.dob, u.gender, u.status, u.contact_number,
               u.emergency_number, u.address, u.email, e.department, e.position, e.employment_type, e.hire_date,
               e.salary_rate, e.bank_name, e.account_holder_name, e.account_number, e.routing_number
        FROM users u
        JOIN employment_info e ON u.id_number = e.id_number
        WHERE u.id_number = ?
    `;

    connection.execute(query, [idNumber], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        if (results.length === 0) {
            return callback(new Error('Employee not found'), null);
        }
        return callback(null, results[0]);
    });
}
const updateUserProfile = (userData) => {
    const query = `
    UPDATE users
    SET last_name = ?, first_name = ?, middle_name = ?, dob = ?, gender = ?, status = ?, contact_number = ?, emergency_number = ?, address = ?, email = ?
    WHERE id_number = ?
    `;
    const data = [
        userData.last_name,
        userData.first_name,
        userData.middle_name,
        userData.dob,
        userData.gender,
        userData.status,
        userData.contact_number,
        userData.emergency_number,
        userData.address,
        userData.email,
        userData.id_number
    ];

    return new Promise((resolve, reject) => {
        db.query(query, data, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};


// Function to update employment info
const updateEmploymentInfo = async (idnum, employmentData) => {
    try {
        // Update the employment_info table based on the idnum
        const query = `
            UPDATE employment_info 
            SET 
                employment_type = ?, 
                department = ?, 
                hire_date = ?, 
                position = ?, 
                salary_rate = ?, 
                bank_name = ?, 
                account_holder_name = ?, 
                account_number = ?, 
                routing_number = ?
            WHERE id_number = ?
        `;
        
        const values = [
            employmentData.employment_type,
            employmentData.department,
            employmentData.hire_date,
            employmentData.position,
            employmentData.salary_rate,
            employmentData.bank_name,
            employmentData.account_holder_name,
            employmentData.account_number,
            employmentData.routing_number,
            idnum
        ];

        const [result] = await pool.execute(query, values);
        if (result.affectedRows === 0) {
            throw new Error('No employment information found for the given ID number.');
        }
        return result;
    } catch (err) {
        throw err;
    }
};



module.exports = { 
    createUser, 
    findUserByIdNum, 
    verifyPassword, 
    createEmploymentInfo, 
    getEmploymentInfoByIdNum,
    createLeaveRequest,   // Add this line
    getLeaveRequestsByIdNum, // And this line
    getAllEmployees,
    getAllLeaveRequests,
    getEmployeesByDepartment,
    getAllDepartments,
    createHoliday,
    getAllHolidays,
    getEmployeeInfo,
    updateUserProfile,
    updateEmploymentInfo
};

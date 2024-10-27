const db = require('../connection/db'); // Adjust the path as necessary
const bcrypt = require('bcrypt');

// Create a new user in the database
const createUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const query = `
    INSERT INTO users (last_name, first_name, middle_name, dob, gender, status, contact_number, emergency_number, address, email, id_number, password, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DEFAULT)
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

module.exports = { 
    createUser, 
    findUserByIdNum, 
    verifyPassword, 
    createEmploymentInfo, 
    getEmploymentInfoByIdNum,
    createLeaveRequest,   // Add this line
    getLeaveRequestsByIdNum // And this line
};


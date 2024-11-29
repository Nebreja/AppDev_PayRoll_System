document.addEventListener("DOMContentLoaded", function () {
    const rowsPerPage = 5; // Adjust number of rows per page
    let currentPage = 1;

    const table = document.getElementById("requesttable");
    const rows = Array.from(table.getElementsByTagName("tbody")[0].rows);
    const searchInput = document.getElementById("search");
    const searchBtn = document.getElementById("search-btn");
    const pageInfo = document.getElementById("page-info");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    // Update page info
    function updatePageInfo() {
        const totalPages = Math.ceil(rows.length / rowsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    // Show rows for the current page
    function showPage(page) {
        rows.forEach((row, index) => {
            row.style.display =
                index >= (page - 1) * rowsPerPage && index < page * rowsPerPage
                    ? ""
                    : "none";
        });
        updatePageInfo();
    }

    // Filter rows based on search input
    function filterTable() {
        const filter = searchInput.value.toLowerCase();
        rows.forEach((row) => {
            const cells = Array.from(row.getElementsByTagName("td"));
            row.style.display = cells.some((cell) =>
                cell.textContent.toLowerCase().includes(filter)
            )
                ? ""
                : "none";
        });
    }

    // Event listeners for search and pagination
    searchInput.addEventListener("input", filterTable);
    searchBtn.addEventListener("click", filterTable); // Trigger search on button click

    prevBtn.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
        }
    });

    nextBtn.addEventListener("click", function () {
        const totalPages = Math.ceil(rows.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
        }
    });

    showPage(currentPage); // Initial display
});


function showContainer(containerId) {
    // Hide all containers
    document.querySelectorAll('.profilecontainer, .salarycontainer, .employmentcontainer, .leavecontainer, .leavereqcontainer, .holidayscontainer')
        .forEach(container => container.classList.add('hidden'));
    
    // Show the selected container
    document.getElementById(containerId).classList.remove('hidden');
}

// Show default container
document.getElementById('profilecontainer').classList.remove('hidden');

document.addEventListener("DOMContentLoaded", function() {
    const departmentSelect = document.getElementById("department");
    const positionSelect = document.getElementById("position");

    // Define positions for each department
    const positions = {
        "Sales Department": [
            "Sales Manager",
            "Sales Executive",
            "Showroom Sales Consultant",
            "Fleet Sales Officer",
            "Sales Coordinator",
            "Customer Service Representative"
        ],
        "Service Department": [
            "Service Manager",
            "Service Advisor",
            "Automotive Technician",
            "Warranty Clerk",
            "Service Coordinator",
            "Quality Control Inspector"
        ],
        "Parts Department": [
            "Parts Manager",
            "Parts Specialist",
            "Inventory Control Specialist",
            "Warehouse Assistant",
            "Parts Sales Representative",
            "Parts Clerk"
        ],
        "Finance and Accounting Department": [
            "Finance Manager",
            "Accountant",
            "Billing Specialist",
            "Accounts Receivable Clerk",
            "Payroll Specialist",
            "Financial Analyst"
        ],
        "Marketing Department": [
            "Marketing Manager",
            "Digital Marketing Specialist",
            "Marketing Coordinator",
            "Event Planner",
            "Social Media Manager",
            "Public Relations Officer"
        ],
        "Human Resources Department": [
            "HR Manager",
            "Recruitment Specialist",
            "Payroll Officer",
            "Employee Relations Officer",
            "Training and Development Coordinator",
            "Benefits Administrator"
        ],
        "Customer Relations Department": [
            "Customer Relations Manager",
            "Customer Service Representative",
            "Complaint Resolution Specialist",
            "Call Center Agent",
            "Customer Support Specialist",
            "Customer Success Manager"
        ],
        "IT Department": [
            "IT Manager",
            "Network Administrator",
            "Systems Analyst",
            "Help Desk Support",
            "Software Developer",
            "Database Administrator"
        ],
        "Security Department": [
            "Security Manager",
            "Security Guard",
            "CCTV Operator",
            "Safety Officer",
            "Loss Prevention Officer"
        ],
        "Logistics and Transport Department": [
            "Logistics Manager",
            "Transport Coordinator",
            "Fleet Manager",
            "Delivery Driver",
            "Dispatch Supervisor",
            "Warehouse Supervisor"
        ],
        "Cleaning Department": [
            "Cleaning Supervisor",
            "Janitor/Custodian",
            "Housekeeping Staff",
            "Sanitation Worker",
            "Window Cleaner",
            "Waste Management Specialist"
        ]
    };

    // Event listener for department selection
    departmentSelect.addEventListener("change", function() {
        const selectedDepartment = this.value;
        // Clear previous position options
        positionSelect.innerHTML = '<option value="" disabled selected>Select Position</option>';

        // Populate positions based on selected department
        if (positions[selectedDepartment]) {
            positions[selectedDepartment].forEach(position => {
                const option = document.createElement("option");
                option.value = position;
                option.textContent = position;
                positionSelect.appendChild(option);
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Event listener for ID number links
    const idLinks = document.querySelectorAll('.id-link');

    idLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault(); // Prevent default link behavior
            const idNumber = link.getAttribute('data-id');

            // Fetch employee data based on the ID number
            const response = await fetch(`/admin/employee/${idNumber}`);
            const data = await response.json();

            // Populate modal with employee data
            if (data) {
                document.querySelector('#employeeinformationForm').innerHTML = `
                    <label>ID Number: ${data.id_number}</label>
                    <label>Last Name: ${data.last_name}</label>
                    <label>First Name: ${data.first_name}</label>
                    <label>Middle Name: ${data.middle_name}</label>
                    <label>DOB: ${new Date(data.dob).toLocaleDateString()}</label>
                    <label>Gender: ${data.gender}</label>
                    <label>Status: ${data.status}</label>
                    <label>Contact Number: ${data.contact_number}</label>
                    <label>Emergency Number: ${data.emergency_number}</label>
                    <label>Address: ${data.address}</label>
                    <label>Email: ${data.email}</label>
                    <label>Department: ${data.department}</label>
                    <label>Position: ${data.position}</label>
                    <label>Employment Type: ${data.employment_type}</label>
                    <label>Date of Hire: ${new Date(data.hire_date).toLocaleDateString()}</label>
                    <label>Salary Rate: ${data.salary_rate}</label>
                    <label>Bank Name: ${data.bank_name}</label>
                    <label>Account Holder Name: ${data.account_holder_name}</label>
                    <label>Account Number: ${data.account_number}</label>
                    <label>Routing Number: ${data.routing_number}</label>
                `;
            }

            // Show the modal
            document.querySelector('#employeeinformationModal').classList.remove('hidden');
        });
    });

    // Close button functionality for the modal
    document.querySelector('.close-btn').addEventListener('click', () => {
        document.querySelector('#employeeinformationModal').classList.add('hidden');
    });
});

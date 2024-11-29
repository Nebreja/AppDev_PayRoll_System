function showContainer(containerId) {
    // Hide all containers
    document.querySelectorAll('.employeecontainer, .salarycontainer, .leavereqcontainer, .holidayscontainer')
        .forEach(container => container.classList.add('hidden'));
    
    // Show the selected container
    document.getElementById(containerId).classList.remove('hidden');
}

// Show default container (Employee section)
document.getElementById('employeecontainer').classList.remove('hidden');

// Show the modal when the "Add Holiday" button is clicked
document.getElementById("add-holiday-btn").addEventListener("click", function() {
    document.getElementById("addHolidayModal").style.display = "flex";
});

// Close the modal when the close button is clicked
document.querySelector(".close-btn").addEventListener("click", function() {
    document.getElementById("addHolidayModal").style.display = "none";
});

// Close the modal when clicking outside of the modal content
window.addEventListener("click", function(event) {
    const modal = document.getElementById("addHolidayModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Handle form submission
document.getElementById("addHolidayForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect the form data
    const holidayData = {
        title: document.getElementById("holidayTitle").value,
        description: document.getElementById("holidayDescription").value,
        start_date: document.getElementById("holidayDate").value,
        end_date: document.getElementById("endDate").value
    };
    

    console.log('Collected holiday data:', holidayData); // Log the collected data

    // Check for empty values
    if (!holidayData.title || !holidayData.start_date || !holidayData.end_date) {
        alert('Please fill in all required fields.');
        return;
    }

    try {
        // Send the data to the server
        const response = await fetch('/admin/holidays', { // Adjust the endpoint as needed
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(holidayData)
        });

        if (response.ok) {
            // Successfully saved the holiday
            const result = await response.json();
            console.log('Holiday saved:', result);

            // Optionally, you can update the holiday table or display a success message
            document.getElementById("addHolidayModal").style.display = "none";
        } else {
            // Handle errors
            const errorData = await response.json();
            console.error('Error saving holiday:', errorData);
            alert('Failed to save holiday: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the holiday.');
    }
});

document.querySelectorAll('.id-link').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();

        const employeeId = this.getAttribute('data-id'); // Get the employee ID from the data attribute

        fetch(`/admin/employees/${employeeId}`)
            .then(response => response.json())
            .then(data => {
                // Fill the modal fields with the fetched data
                document.getElementById('idNumber').value = data.id_number;
                document.getElementById('lastName').value = data.last_name;
                document.getElementById('firstName').value = data.first_name;
                document.getElementById('middleName').value = data.middle_name;
                document.getElementById('dob').value = new Date(data.dob).toLocaleDateString();
                document.getElementById('gender').value = data.gender;
                document.getElementById('status').value = data.status;
                document.getElementById('contactNumber').value = data.contact_number;
                document.getElementById('emergencyNumber').value = data.emergency_number;
                document.getElementById('address').value = data.address;
                document.getElementById('email').value = data.email;

                // Employment details
                document.getElementById('department').value = data.department;
                document.getElementById('position').value = data.position;
                document.getElementById('employmentType').value = data.employment_type;
                document.getElementById('dateOfHire').value = new Date(data.hire_date).toLocaleDateString();
                document.getElementById('salaryRate').value = data.salary_rate;

                // Bank information
                document.getElementById('bankName').value = data.bank_name;
                document.getElementById('accountHolderName').value = data.account_holder_name;
                document.getElementById('accountNumber').value = data.account_number;
                document.getElementById('routingNumber').value = data.routing_number;

                // Display the modal
                document.getElementById('employeeinformation').classList.remove('hidden');
            })
            .catch(error => console.error('Error fetching employee data:', error));
    });
});

// Close modal
document.querySelector('.close-btn').addEventListener('click', function () {
    document.getElementById('employeeinformation').classList.add('hidden');
});

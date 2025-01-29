function logout() {
    // Clear only session-specific data
    const lastPrescriptionId = localStorage.getItem('lastPrescriptionId');
    sessionStorage.clear();
    localStorage.clear();
    // Restore the prescription counter
    if (lastPrescriptionId) {
        localStorage.setItem('lastPrescriptionId', lastPrescriptionId);
    }
    // Redirect to login page
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    // Set doctor name from session storage
    const doctorName = sessionStorage.getItem('userName');
    if (doctorName) {
        document.getElementById('doctorName').textContent = doctorName;
    }

    const medicineInput = document.getElementById('medicine');
    const searchResultsTable = document.getElementById('searchResultsTable').getElementsByTagName('tbody')[0];
    const selectedMedicinesTable = document.getElementById('selectedMedicinesTable').getElementsByTagName('tbody')[0];
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    
    let currentPage = 1;
    let totalPages = 1;
    let lastSearchTerm = '';

    // Medicine search functionality
    const searchMedicineBtn = document.getElementById('medicine-search');
    
    async function searchMedicines(page = 1) {
        const prefix = medicineInput.value.trim();
        lastSearchTerm = prefix;
        if (prefix === '') return;

        try {
            const response = await fetch(`https://prescriptionservicegateway-egfnhudhbwbnh5ct.canadacentral-01.azurewebsites.net/medicine/search
?prefix=${encodeURIComponent(prefix)}&page=${page}`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            console.log('Search results:', data);
            
            // Clear previous search results
            searchResultsTable.innerHTML = '';
            
            // Display search results in the left table
            if (data && data.data && Array.isArray(data.data)) {
                data.data.forEach(medicine => {
                    const row = searchResultsTable.insertRow();
                    const cell = row.insertCell();
                    cell.textContent = medicine;
                    cell.style.display = 'block';
                    cell.style.width = '100%';
                    
                    // Add double-click event listener
                    row.addEventListener('dblclick', function() {
                        addToSelectedMedicines(medicine);
                    });
                });
                searchResultsTable.style.display = 'block';

                // Update pagination
                currentPage = data.page;
                totalPages = Math.ceil(data.totalCount / data.pageSize);
                currentPageSpan.textContent = `Page ${currentPage} of ${totalPages}`;
                prevPageBtn.disabled = currentPage <= 1;
                nextPageBtn.disabled = currentPage >= totalPages;
            }
        } catch (error) {
            console.error('Error fetching medicine suggestions:', error);
            console.log('Error details:', error.message);
        }
    }

    // Add event listeners for pagination
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            searchMedicines(currentPage - 1);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            searchMedicines(currentPage + 1);
        }
    });

    // Add search button click handler
    searchMedicineBtn.addEventListener('click', () => searchMedicines(1));

    // Add enter key handler
    medicineInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchMedicines(1);
        }
    });

    function addToSelectedMedicines(medicine) {
        // Check if medicine is already in selected medicines
        const existingMedicines = Array.from(selectedMedicinesTable.rows).map(row => row.cells[0].textContent);
        if (existingMedicines.includes(medicine)) {
            return; // Don't add if already exists
        }

        const newRow = selectedMedicinesTable.insertRow();
        const nameCell = newRow.insertCell();
        const actionsCell = newRow.insertCell();
        
        nameCell.textContent = medicine;
        actionsCell.innerHTML = `
            <div class="action-buttons">
                <button class="edit-btn">EDIT</button>
                <button class="delete-btn">DELETE</button>
            </div>
        `;

        // Add event listeners for edit and delete buttons
        const editBtn = actionsCell.querySelector('.edit-btn');
        const deleteBtn = actionsCell.querySelector('.delete-btn');

        editBtn.addEventListener('click', function() {
            const newName = prompt('Enter new medicine name:', medicine);
            if (newName !== null && newName.trim() !== '') {
                nameCell.textContent = newName;
            }
        });

        deleteBtn.addEventListener('click', function() {
            selectedMedicinesTable.deleteRow(newRow.rowIndex - 1);
        });
    }

    // Update patient search functionality
    const patientSearchBtn = document.getElementById('patient-search');
    patientSearchBtn.addEventListener('click', async function() {
        const tcId = document.getElementById('tcId').value;
        if (!tcId) return;

        try {
            const response = await fetch('https://67936d105eae7e5c4d8e9881.mockapi.io/api/v1/TcLookup/identity');
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            console.log('Patient search results:', data);

            // Find the patient with matching TC ID
            const patient = data.find(p => p.TcKimlik === parseInt(tcId));
            
            if (patient) {
                document.getElementById('fullname').value = patient.FullName;
                // Get the current prescription ID from local storage or start from 43
                let currentPrescriptionId = parseInt(localStorage.getItem('lastPrescriptionId')) || 55;
                currentPrescriptionId++;
                // Save the new prescription ID
                localStorage.setItem('lastPrescriptionId', currentPrescriptionId.toString());
                // Set the prescription ID in the form
                document.getElementById('prescriptionId').value = currentPrescriptionId;
            } else {
                document.getElementById('fullname').value = '';
                document.getElementById('prescriptionId').value = '';
                alert('Patient not found');
            }
        } catch (error) {
            console.error('Error fetching patient data:', error);
            alert('Error searching for patient');
        }
    });

    // Add Complete Prescription functionality
    const completeBtn = document.getElementById('complete-prescription');
    
    completeBtn.addEventListener('click', async function() {
        const tcId = document.getElementById('tcId').value;
        const doctorId = sessionStorage.getItem('doctorId'); // Get doctor ID from session storage

        // Validate required fields
        if (!tcId || !doctorId) {
            alert('Please fill in all required fields and search for a patient first.');
            return;
        }

        // Get selected medicines
        const selectedMedicines = Array.from(selectedMedicinesTable.rows).map(row => ({
            medicineName: row.cells[0].textContent.trim()
        }));

        if (selectedMedicines.length === 0) {
            alert('Please add at least one medicine to the prescription.');
            return;
        }

        // Create prescription object
        const prescription = {
            patientTC: tcId.toString(),
            visitDate: new Date().toISOString(),
            doctorId: doctorId,
            medicines: selectedMedicines
        };

        try {
            const response = await fetch('https://prescriptionservicegateway-egfnhudhbwbnh5ct.canadacentral-01.azurewebsites.net/prescription/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify(prescription)
            });

            if (!response.ok) {
                throw new Error('Failed to create prescription');
            }

            const result = await response.json();
            alert('Prescription created successfully!');
            
            // Clear the form
            document.getElementById('tcId').value = '';
            document.getElementById('fullname').value = '';
            document.getElementById('prescriptionId').value = '';
            document.getElementById('medicine').value = '';
            searchResultsTable.innerHTML = '';
            selectedMedicinesTable.innerHTML = '';

        } catch (error) {
            console.error('Error creating prescription:', error);
            alert('Failed to create prescription. Please try again.');
        }
    });
}); 
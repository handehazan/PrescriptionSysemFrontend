function logout() {
    // Clear session storage
    sessionStorage.clear();
    // Redirect to login page
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    // Set pharmacist name
    const pharmacistName = sessionStorage.getItem('userName');
    if (pharmacistName) {
        document.getElementById('pharmacy').value = pharmacistName;
    }

    const addBtn = document.querySelector('.add-btn');
    const medicineInput = document.getElementById('medicine');
    const medicineTable = document.getElementById('medicineTable').getElementsByTagName('tbody')[0];
    const totalAmountSpan = document.getElementById('totalAmount');
    const prescriptionsSelect = document.getElementById('prescriptions');
    const submitBtn = document.getElementById('submit-prescription');
    let total = 0;

    // Medicine search functionality
    const searchMedicineBtn = document.getElementById('medicine-search');
    const searchResultsTable = document.getElementById('searchResultsTable').getElementsByTagName('tbody')[0];
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    
    let currentPage = 1;
    let totalPages = 1;
    let lastSearchTerm = '';

    // Function to handle medicine search
    async function searchMedicine(page = 1) {
        const prefix = medicineInput.value.trim();
        lastSearchTerm = prefix;
        if (prefix === '') return;

        try {
            const response = await fetch(`https://prescriptionservicegateway-egfnhudhbwbnh5ct.canadacentral-01.azurewebsites.net/medicine/search?prefix=${encodeURIComponent(prefix)}&page=${page}`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            console.log('Search results:', data);
            
            // Clear previous search results
            searchResultsTable.innerHTML = '';
            
            // Display search results
            if (data && data.data && Array.isArray(data.data)) {
                data.data.forEach(medicine => {
                    const row = searchResultsTable.insertRow();
                    const cell = row.insertCell();
                    cell.textContent = medicine;
                    cell.style.display = 'block';
                    cell.style.width = '100%';
                    
                    // Add double-click event listener
                    row.addEventListener('dblclick', function() {
                        // Add medicine to pricing table with random price
                        const price = Math.floor(Math.random() * 90 + 10);
                        const newRow = medicineTable.insertRow();
                        newRow.innerHTML = `
                            <td>${medicine}</td>
                            <td>${price}</td>
                            <td>
                                <button class="edit-btn">EDIT</button>
                                <button class="delete-btn">DELETE</button>
                            </td>
                        `;

                        updateTotal(price);
                        medicineInput.value = '';
                        searchResultsTable.innerHTML = '';

                        // Add event listeners for edit and delete buttons
                        const editBtn = newRow.querySelector('.edit-btn');
                        const deleteBtn = newRow.querySelector('.delete-btn');

                        editBtn.addEventListener('click', function() {
                            const price = parseInt(newRow.cells[1].textContent);
                            const newPrice = prompt('Enter new price:', price);
                            if (newPrice !== null && !isNaN(newPrice)) {
                                updateTotal(-price); // Subtract old price
                                newRow.cells[1].textContent = newPrice;
                                updateTotal(parseInt(newPrice)); // Add new price
                            }
                        });

                        deleteBtn.addEventListener('click', function() {
                            const price = parseInt(newRow.cells[1].textContent);
                            updateTotal(-price);
                            medicineTable.deleteRow(newRow.rowIndex - 1);
                        });
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
            searchMedicine(currentPage - 1);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            searchMedicine(currentPage + 1);
        }
    });

    // Add search button click handler
    searchMedicineBtn.addEventListener('click', () => searchMedicine(1));

    // Add enter key handler
    medicineInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchMedicine(1);
        }
    });

    // Disable submit button initially
    submitBtn.disabled = true;

    // Search functionality for patient
    const searchBtn = document.getElementById('patient-search');
    searchBtn.addEventListener('click', async function() {
        const tcId = document.getElementById('tcId').value;
        if (!tcId) return;

        try {
            // First fetch patient data
            const patientResponse = await fetch('https://67936d105eae7e5c4d8e9881.mockapi.io/api/v1/TcLookup/identity');
            if (!patientResponse.ok) throw new Error('Network response was not ok');
            
            const patientData = await patientResponse.json();
            const patient = patientData.find(p => p.TcKimlik === parseInt(tcId));
            
            if (patient) {
                document.getElementById('fullname').value = patient.FullName;
                
                // Then fetch prescriptions for this patient
                const prescriptionsResponse = await fetch(`https://prescriptionservicegateway-egfnhudhbwbnh5ct.canadacentral-01.azurewebsites.net/prescription/${tcId}`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                if (!prescriptionsResponse.ok) throw new Error('Failed to fetch prescriptions');
                
                const prescriptions = await prescriptionsResponse.json();
                console.log('Prescriptions:', prescriptions);

                // Clear previous options
                prescriptionsSelect.innerHTML = '<option value="">Select a prescription</option>';
                
                // Add prescriptions to select
                prescriptions.forEach(prescription => {
                    const option = document.createElement('option');
                    option.value = prescription.prescriptionId;
                    const date = new Date(prescription.visitDate).toLocaleDateString();
                    option.textContent = `Prescription ID: ${prescription.prescriptionId} (${date})`;
                    prescriptionsSelect.appendChild(option);
                });

                // Clear prescription ID field and disable submit button
                document.getElementById('prescriptionId').value = '';
                submitBtn.disabled = true;
                
            } else {
                document.getElementById('fullname').value = '';
                prescriptionsSelect.innerHTML = '<option value="">Select a prescription</option>';
                document.getElementById('prescriptionId').value = '';
                submitBtn.disabled = true;
                alert('Patient not found');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error searching for patient');
        }
    });

    // Handle prescription selection
    prescriptionsSelect.addEventListener('change', async function() {
        const selectedPrescriptionId = this.value;
        document.getElementById('prescriptionId').value = selectedPrescriptionId;
        document.getElementById('displayPrescriptionId').textContent = selectedPrescriptionId || '-';
        
        if (!selectedPrescriptionId) {
            medicineTable.innerHTML = '';
            total = 0;
            totalAmountSpan.textContent = total;
            submitBtn.disabled = true;
            document.getElementById('displayPrescriptionId').textContent = '-';
            return;
        }

        try {
            // Fetch medicines for selected prescription
            const response = await fetch(`https://prescriptionservicegateway-egfnhudhbwbnh5ct.canadacentral-01.azurewebsites.net/prescription/medicines/${selectedPrescriptionId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch medicines');
            
            const medicines = await response.json();
            console.log('Prescription medicines:', medicines);

            // Clear previous displays
            medicineTable.innerHTML = '';
            const prescriptionList = document.getElementById('prescriptionMedicinesList');
            prescriptionList.innerHTML = '';
            total = 0;
            totalAmountSpan.textContent = total;

            // Display medicines in the prescription list
            medicines.forEach(medicine => {
                const li = document.createElement('li');
                li.textContent = medicine.medicineName;
                prescriptionList.appendChild(li);
            });

            // Enable submit button when medicines are loaded
            submitBtn.disabled = false;
        } catch (error) {
            console.error('Error fetching medicines:', error);
            alert('Error loading prescription medicines');
            submitBtn.disabled = true;
        }
    });

    function updateTotal(amount) {
        total += amount;
        totalAmountSpan.textContent = total;
    }

    // Handle prescription submission
    submitBtn.addEventListener('click', async function() {
        const prescriptionId = document.getElementById('prescriptionId').value;
        const pharmacyName = document.getElementById('pharmacy').value;
        if (!prescriptionId) {
            alert('Please select a prescription first');
            return;
        }

        // Get all medicines with their prices
        const medicinesGiven = Array.from(medicineTable.rows).map(row => row.cells[0].textContent.trim());

        if (medicinesGiven.length === 0) {
            alert('No medicines in the prescription');
            return;
        }

        const confirmation = confirm(`Submit prescription with total amount: ${total} TL?`);
        if (!confirmation) return;

        try {
            const response = await fetch('https://prescriptionservicegateway-egfnhudhbwbnh5ct.canadacentral-01.azurewebsites.net/prescription/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    prescriptionId: parseInt(prescriptionId),
                    pharmacyName: pharmacyName,
                    medicinesGiven: medicinesGiven
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit prescription');
            }

            const result = await response.json();

            // Check if there are missing medicines
            if (result.missingMedicines && result.missingMedicines.length > 0) {
                const missingMeds = result.missingMedicines.join(', ');
                const confirmMissing = confirm(`Warning: The following medicines are missing:\n${missingMeds}\n\nDo you want to submit anyway?`);
                if (!confirmMissing) {
                    return;
                }
            }

            alert('Prescription submitted successfully!');
            
            // Clear the form
            document.getElementById('tcId').value = '';
            document.getElementById('fullname').value = '';
            document.getElementById('prescriptionId').value = '';
            prescriptionsSelect.innerHTML = '<option value="">Select a prescription</option>';
            medicineTable.innerHTML = '';
            document.getElementById('prescriptionMedicinesList').innerHTML = '';
            total = 0;
            totalAmountSpan.textContent = total;
            submitBtn.disabled = true;
        } catch (error) {
            console.error('Error submitting prescription:', error);
            alert('Failed to submit prescription. Please try again.');
        }
    });
}); 
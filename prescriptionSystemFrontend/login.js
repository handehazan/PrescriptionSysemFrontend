document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('https://prescriptionsystem-chhsbsebereue3a4.northeurope-01.azurewebsites.net/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            console.log('Login response:', data); // For debugging
            
            // Store login info in sessionStorage
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('userRole', data.role);
            sessionStorage.setItem('doctorId', data.id);
            sessionStorage.setItem('userName', data.name);
            
            // Redirect based on role
            if (data.role === 'doctor') {
                window.location.href = 'doctor.html';
            } else if (data.role === 'pharmacy') {
                window.location.href = 'pharmacy.html';
            } else {
                throw new Error('Invalid role');
            }
            
        } catch (error) {
            errorMessage.textContent = 'Invalid credentials. Please try again.';
            console.error('Login error:', error);
        }
    });
}); 
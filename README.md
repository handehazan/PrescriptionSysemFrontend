# Prescription System Frontend

## 📌 Project Overview

The **Prescription System Frontend** is a web-based user interface designed for doctors and pharmacies to:

- Manage **prescriptions** efficiently.
- View **medicine details** stored in the system.
- Authenticate and authorize users using **JWT authentication**.
- Communicate with the backend via a **REST API**.
- Provide a responsive and user-friendly interface.

This application is built with **HTML, CSS, and JavaScript** and deployed on **Azure Static Web Apps** to ensure seamless integration with the backend system.

---

## 🛠️ Tech Stack

- **Frontend Framework:** HTML, CSS, JavaScript
- **Authentication:** JWT-based authentication
- **Styling:** CSS, FontAwesome for icons
- **API Communication:** Fetch API
- **Deployment:** Azure Static Web Apps

---

## 🔗 Backend Integration

The frontend communicates with the backend **Prescription System API**, which is responsible for handling prescription management, user authentication, and medicine data.

🔗 **Backend Repository:** [Prescription System Backend](https://github.com/your-username/prescription-system)

🔗 **Web Site:** [Prescription - Doctor Visit Web Site](https://wonderful-river-0db27400f.4.azurestaticapps.net/index.html)

---

## 📡 API Endpoints Used

| Feature                       | Endpoint                                   | HTTP Method |
| ----------------------------- | ------------------------------------------ | ----------- |
| Login                         | `/auth/login`                              | POST        |
| Search Medicine               | `/medicine/search`                         | GET         |
| Create Prescription           | `/prescription/create`                     | POST        |
| Get Prescription              | `/prescription/{patientTC}`                | GET         |
| Get Medicines in Prescription | `/prescription/medicines/{prescriptionId}` | GET         |
| Submit Prescription           | `/prescription/submit`                     | POST        |

All requests are routed through an **API Gateway (Ocelot)** for simplified request handling.

---

## 📂 Project Structure

```
📁 frontend/
 ┣ 📜 index.html        # Login Page
 ┣ 📜 login.js          # Handles authentication and redirects users based on role
 ┣ 📜 login-styles.css  # Styling for login page
 ┣ 📜 doctor.html       # Doctor's dashboard
 ┣ 📜 script.js         # Handles medicine search, prescription creation, and logout
 ┣ 📜 pharmacy.html     # Pharmacy's dashboard
 ┣ 📜 pharmacy.js       # Handles prescription retrieval, medicine pricing, and submission
 ┗ 📜 styles.css        # Styling for doctor and pharmacy page 
```

---

## 🔑 Authentication Flow
1. Users enter their **username** and **password** on the login page (`index.html`).
2. The credentials are sent via **POST** to the `/auth/login` endpoint.
3. If authentication is successful:
   - The JWT token is stored in **sessionStorage**.
   - The user is redirected to either `doctor.html` or `pharmacy.html` based on their role.
4. If authentication fails, an error message is displayed.

---

## 🏥 Doctor Dashboard Features (`doctor.html`)

The **Doctor Dashboard** provides an interface for doctors to:

- **Search for patients** using their **TC ID**.
- **Search for medicines with auto complete** from the database.
- **Add medicines** to a new prescription.
- **Edit or remove medicines** before finalizing a prescription.
- **Complete and create prescriptions** securely.
- **Logout securely** to prevent unauthorized access.

### 🔍 Medicine Search & Pagination
- **Search for medicines** by name or prefix.
- **Paginated search results** for better navigation.
- **Double-click on a medicine** to add it to the prescription list.
- **Delete/Edit medicines** in the selected list.

### 🏷️ Prescription Handling
- **Generate a new prescription ID** for each patient.
- **Save prescription records** to the database.

---

## 🏪 Pharmacy Dashboard Features (`pharmacy.html`)

The **Pharmacy Dashboard** provides an interface for pharmacists to:

- **Search for prescriptions** using a **patient's TC ID**.
- **Retrieve a list of active prescriptions** for the patient.
- **View prescription details**, including medicines prescribed.
- **Search and add medicine prices** dynamically.
- **Calculate total cost** of the prescription.
- **Submit completed prescriptions**, ensuring missing medicines are reported and pushed to the queue.
- **Logout securely** after processing prescriptions.

### 📑 Prescription Handling
- **Retrieve prescriptions** for a patient by **TC ID**.
- **View medicines prescribed** and check availability.
- **Update medicine prices** dynamically before submission.
- **Submit completed prescriptions**, with a check for missing medicines.

### 🚀 Prescription Submission
- **Validate completeness** before submission.
- **Ensure missing medicines are reported** using RabbitMQ notifications.
- **Confirm successful submission** before resetting the UI.

---
## 📸 Screenshots of the frontend

| Login Page | Doctor Dashboard | Pharmacy Dashboard |
|------------|----------------|----------------|
| ![Login](https://github.com/user-attachments/assets/0979ea52-6153-47a8-8d26-ec007e7633be) | ![Doctor](https://github.com/user-attachments/assets/ab19390a-794c-4c7c-b081-742fdb5e4969) | ![Pharmacy](https://github.com/user-attachments/assets/bccb89e3-2666-45ba-af92-fab7aa71ad5c) |



## 🚀 Installation & Setup

### 1️⃣ **Clone the Repository**

```bash
git clone https://github.com/handehazan/PrescriptionSysemFrontend.git
cd PrescriptionSysemFrontend
```

### 2️⃣ **Run the Application Locally**
Simply open `index.html` in your browser.

Alternatively, start a simple local HTTP server:
```bash
npx serve .
```
Then open `http://localhost:3000/` in your browser.

---

## 📦 Deployment

This frontend is deployed using **Azure Static Web Apps**. To redeploy:

1. Push changes to the `main` branch.
2. Azure Static Web Apps automatically triggers a new deployment.

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. **Fork** the repository.
2. **Create a branch** (`git checkout -b feature-name`).
3. **Commit changes** (`git commit -m 'Added new feature'`).
4. **Push to GitHub** (`git push origin feature-name`).
5. **Submit a Pull Request**.

---

## 📜 License

This project is licensed under the **MIT License**.

---

🚀 **Now you're ready to use the Prescription System Frontend!** 🚀

                 🚀 **THANK YOU FOR READING!** 🚀


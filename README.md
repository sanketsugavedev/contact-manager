# Contact Book & Address Manager

A full-stack web application for managing personal and professional contacts. Users can create, view, update, delete, search, and filter contacts through a simple interface.

## Features

- **Create Contacts:** Add contacts with name, email, phone number, address, and category.
- **View Contacts:** Display all saved contacts.
- **Edit Contacts:** Update existing contact information.
- **Delete Contacts:** Remove contacts from the database.
- **Search Contacts:** Search by name, email, or phone number.
- **Filter by Category:** Filter contacts by Personal, Family, Friends, Business, or Other.
- **Contact Details:** View complete contact information in a modal.
- **Duplicate Validation:** Prevent duplicate email addresses and phone numbers.
- **Data Persistence:** Store contact information in MongoDB.

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Fetch API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv

## Project Structure

Contact-Book/
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── index.html
│
└── backend/
    ├── controllers/
    │   └── contactController.js
    │
    ├── models/
    │   └── Contact.js
    │
    ├── routes/
    │   └── contactRoutes.js
    │
    ├── config/
    ├── .env
    ├── .gitignore
    ├── app.js
    ├── server.js
    └── package.json


## Installation & Setup

### 1. Clone the repository

git clone <your-repository-url>
cd Contact-Book


### 2. Install backend dependencies


cd backend
npm install express mongoose dotenv


### 3. Configure environment variables

Create a `.env` file inside the backend directory:


PORT=3000
MONGO_URI=mongodb://127

# User Management System

A full-stack CRUD application for user management built with React, Node.js, Express, and MySQL.

## Requirements

- Node.js (v14 o superior)
- MySQL Server (XAMPP o MySQL standalone)
- npm o yarn

## Database Setup

1. Ensure MySQL is running in XAMPP
2. Open phpMyAdmin or MySQL client
3. Execute the `database.sql` file to create the database and table:

```bash
mysql -u root -p < database.sql
```

Alternatively, copy and paste the file content into phpMyAdmin.

## Installation

### Backend

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env` file:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=crud_db
```

4. Start the server:
```bash
npm start
```

Server will run on `http://localhost:5000`

### Frontend

1. Open a new terminal and navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start React application:
```bash
npm start
```

Application will open automatically at `http://localhost:3000`

## Features

The application provides full CRUD functionality:

- **Create**: Add new users with name, email, and age
- **Read**: View complete list of users
- **Update**: Edit existing user information
- **Delete**: Remove users from database

## Project Structure

```
Crud_react/
│
├── backend/
│   ├── config/
│   │   └── database.js       # MySQL configuration
│   ├── server.js             # Express server and API routes
│   ├── package.json
│   └── .env                  # Environment variables
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js           # Main component
│   │   ├── App.css          # Component styles
│   │   ├── index.js         # Entry point
│   │   └── index.css        # Global styles
│   └── package.json
│
└── database.sql             # Database script
```

## API Endpoints

- `GET /api/usuarios` - Retrieve all users
- `GET /api/usuarios/:id` - Retrieve user by ID
- `POST /api/usuarios` - Create new user
- `PUT /api/usuarios/:id` - Update user
- `DELETE /api/usuarios/:id` - Delete user

## Technology Stack

### Backend
- Node.js
- Express
- MySQL2
- CORS
- dotenv

### Frontend
- React 18
- Axios
- CSS3

## Notes

- Ensure XAMPP is running with MySQL active
- Default backend port is 5000 (configurable in .env file)
- Frontend connects to backend at `http://localhost:5000`

## Troubleshooting

### MySQL Connection Error
- Verify MySQL is running in XAMPP
- Check credentials in `.env` file
- Ensure `crud_db` database exists

### CORS Error
- Backend has CORS enabled by default
- Verify frontend is accessing `http://localhost:5000`

### React Application Not Connecting
- Ensure backend is running first
- Verify URL in `App.js` is `http://localhost:5000/api/usuarios`

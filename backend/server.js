/**
 * Express Server for User Management System
 * RESTful API for CRUD operations
 */

const express = require('express');
const cors = require('cors');
const db = require('./config/database');
require('dotenv').config();

const app = express();

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes

// GET - Retrieve all users
app.get('/api/usuarios', (req, res) => {
  const query = 'SELECT * FROM usuarios ORDER BY id DESC';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to retrieve users',
        message: error.message 
      });
    }
    res.json({
      success: true,
      data: results,
      count: results.length
    });
  });
});

// GET - Retrieve user by ID
app.get('/api/usuarios/:id', (req, res) => {
  const query = 'SELECT * FROM usuarios WHERE id = ?';
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid user ID' 
    });
  }

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to retrieve user',
        message: error.message 
      });
    }
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    res.json({
      success: true,
      data: results[0]
    });
  });
});

// POST - Create new user
app.post('/api/usuarios', (req, res) => {
  const { nombre, email, edad } = req.body;

  // Validation
  if (!nombre || !email || !edad) {
    return res.status(400).json({ 
      success: false,
      error: 'All fields are required',
      fields: { nombre, email, edad }
    });
  }

  if (typeof edad !== 'number' || edad < 1 || edad > 120) {
    return res.status(400).json({ 
      success: false,
      error: 'Age must be between 1 and 120' 
    });
  }

  const query = 'INSERT INTO usuarios (nombre, email, edad) VALUES (?, ?, ?)';
  db.query(query, [nombre, email, edad], (error, results) => {
    if (error) {
      console.error('Database insert error:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
          success: false,
          error: 'Email already exists' 
        });
      }
      return res.status(500).json({ 
        success: false,
        error: 'Failed to create user',
        message: error.message 
      });
    }
    res.status(201).json({ 
      success: true,
      data: {
        id: results.insertId, 
        nombre, 
        email, 
        edad
      },
      message: 'User created successfully' 
    });
  });
});

// PUT - Update user
app.put('/api/usuarios/:id', (req, res) => {
  const { nombre, email, edad } = req.body;
  const userId = parseInt(req.params.id);

  // Validation
  if (isNaN(userId)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid user ID' 
    });
  }

  if (!nombre || !email || !edad) {
    return res.status(400).json({ 
      success: false,
      error: 'All fields are required' 
    });
  }

  if (typeof edad !== 'number' || edad < 1 || edad > 120) {
    return res.status(400).json({ 
      success: false,
      error: 'Age must be between 1 and 120' 
    });
  }

  const query = 'UPDATE usuarios SET nombre = ?, email = ?, edad = ? WHERE id = ?';
  db.query(query, [nombre, email, edad, userId], (error, results) => {
    if (error) {
      console.error('Database update error:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
          success: false,
          error: 'Email already exists' 
        });
      }
      return res.status(500).json({ 
        success: false,
        error: 'Failed to update user',
        message: error.message 
      });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    res.json({ 
      success: true,
      data: {
        id: userId,
        nombre, 
        email, 
        edad
      },
      message: 'User updated successfully' 
    });
  });
});

// DELETE - Remove user
app.delete('/api/usuarios/:id', (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid user ID' 
    });
  }

  const query = 'DELETE FROM usuarios WHERE id = ?';
  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Database delete error:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to delete user',
        message: error.message 
      });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    res.json({ 
      success: true,
      message: 'User deleted successfully' 
    });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/usuarios`);
});

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/usuarios';

/**
 * Main Application Component
 * Manages CRUD operations for user management system
 */
function App() {
  // State Management
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    email: '',
    edad: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load users on component mount
  useEffect(() => {
    fetchUsuarios();
  }, []);

  /**
   * Fetch all users from API
   */
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      const users = response.data.data || response.data;
      setUsuarios(Array.isArray(users) ? users : []);
      setError('');
    } catch (err) {
      setError('Error loading users. Please ensure the server is running.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form input changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  /**
   * Handle form submission for create/update operations
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email || !formData.edad) {
      setError('Please complete all fields');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const userAge = parseInt(formData.edad);
    if (isNaN(userAge) || userAge < 1 || userAge > 120) {
      setError('Age must be between 1 and 120');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${formData.id}`, {
          nombre: formData.nombre,
          email: formData.email,
          edad: userAge
        });
        setSuccess('User updated successfully');
      } else {
        await axios.post(API_URL, {
          nombre: formData.nombre,
          email: formData.email,
          edad: userAge
        });
        setSuccess('User created successfully');
      }
      
      resetForm();
      fetchUsuarios();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error saving user';
      setError(errorMessage);
      console.error('Save error:', err);
      setTimeout(() => setError(''), 5000);
    }
  };

  /**
   * Prepare form for editing existing user
   * @param {Object} usuario - User object to edit
   */
  const handleEdit = (usuario) => {
    setFormData({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      edad: usuario.edad
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Delete user by ID
   * @param {number} id - User ID to delete
   */
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setSuccess('User deleted successfully');
        fetchUsuarios();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Error deleting user';
        setError(errorMessage);
        console.error('Delete error:', err);
        setTimeout(() => setError(''), 5000);
      }
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      id: null,
      nombre: '',
      email: '',
      edad: ''
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="App">
      <div className="header">
        <h1>User Management</h1>
        <p>Administration System</p>
      </div>

      <div className="container">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* Form Section */}
        <div className="form-section">
          <h2>{isEditing ? 'Edit User' : 'New User'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleInputChange}
                placeholder="Enter age"
                min="1"
                max="120"
                required
              />
            </div>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Update User' : 'Create User'}
            </button>
            {isEditing && (
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Users List Section */}
        <div className="list-section">
          <h2>Users List</h2>
          {loading ? (
            <div className="loading">Loading users...</div>
          ) : usuarios.length === 0 ? (
            <div className="empty-state">No users registered</div>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.edad}</td>
                    <td>
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEdit(usuario)}
                        title="Edit user"
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDelete(usuario.id)}
                        title="Delete user"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hyperspeed from './Hyperspeed';
import { hyperspeedPresets } from './HyperSpeedPresets';
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
  const [activeTab, setActiveTab] = useState('crear');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsuarios = usuarios.filter((usuario) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    return (
      usuario.nombre?.toLowerCase().includes(query) ||
      usuario.email?.toLowerCase().includes(query) ||
      String(usuario.edad).includes(query)
    );
  });

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
      setError('Error al cargar usuarios. Asegúrate de que el servidor esté en ejecución.');
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

    if (activeTab === 'editar' && !isEditing) {
      setError('Selecciona un usuario desde la tabla para editarlo');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    if (!formData.nombre || !formData.email || !formData.edad) {
      setError('Por favor, completa todos los campos');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const userAge = parseInt(formData.edad);
    if (isNaN(userAge) || userAge < 1 || userAge > 120) {
      setError('La edad debe estar entre 1 y 120');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      if (activeTab === 'editar') {
        await axios.put(`${API_URL}/${formData.id}`, {
          nombre: formData.nombre,
          email: formData.email,
          edad: userAge
        });
        setSuccess('Usuario actualizado correctamente');
      } else {
        await axios.post(API_URL, {
          nombre: formData.nombre,
          email: formData.email,
          edad: userAge
        });
        setSuccess('Usuario creado correctamente');
      }
      
      resetForm();
      fetchUsuarios();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al guardar el usuario';
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
    setActiveTab('editar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Delete user by ID
   * @param {number} id - User ID to delete
   */
  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setSuccess('Usuario eliminado correctamente');
        fetchUsuarios();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Error al eliminar el usuario';
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

  const handleCreateTab = () => {
    setActiveTab('crear');
    resetForm();
  };

  const handleEditTab = () => {
    setActiveTab('editar');
  };

  const handleListTab = () => {
    setActiveTab('listar');
    resetForm();
  };

  return (
    <>
      <div className="hyperspeed-background" aria-hidden="true">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Hyperspeed effectOptions={hyperspeedPresets.one} />
        </div>
      </div>

      <div className="App">
        <header className="header">
          <div className="header-badge">React CRUD</div>
          <h1>Gestión de Usuarios</h1>
          <p>Panel de administración moderno con operaciones CRUD en tiempo real</p>
        </header>

        <div className="container">
          <div className="top-stats">
            <div className="stat-card">
              <span className="stat-label">Total de Usuarios</span>
              <strong className="stat-value">{usuarios.length}</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">Modo</span>
              <strong className="stat-value">
                {activeTab === 'editar'
                  ? 'Editando'
                  : activeTab === 'listar'
                    ? 'Listando'
                    : 'Creando'}
              </strong>
            </div>
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="tabs-row">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'crear' ? 'active' : ''}`}
              onClick={handleCreateTab}
            >
              Crear
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'editar' ? 'active' : ''}`}
              onClick={handleEditTab}
            >
              Editar
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'listar' ? 'active' : ''}`}
              onClick={handleListTab}
            >
              Listar
            </button>
          </div>

          {/* Form Section */}
          {activeTab !== 'listar' && (
            <div className="form-section">
              <h2>{activeTab === 'editar' ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              {activeTab === 'editar' && !isEditing && (
                <div className="tab-hint">Ve a “Listar”, elige un usuario y pulsa “Editar”.</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ingresa el nombre completo"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Correo:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ingresa el correo electrónico"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Edad:</label>
                  <input
                    type="number"
                    name="edad"
                    value={formData.edad}
                    onChange={handleInputChange}
                    placeholder="Ingresa la edad"
                    min="1"
                    max="120"
                    required
                  />
                </div>
                <div className="button-row">
                  <button type="submit" className="btn-submit" disabled={activeTab === 'editar' && !isEditing}>
                    {activeTab === 'editar'
                      ? isEditing
                        ? 'Actualizar Usuario'
                        : 'Selecciona un usuario'
                      : 'Crear Usuario'}
                  </button>
                  {activeTab === 'editar' && (
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        resetForm();
                        setActiveTab('crear');
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Users List Section */}
          {activeTab === 'listar' && (
            <div className="list-section">
              <h2>Lista de Usuarios</h2>
              <div className="form-group">
                <label>Buscar:</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, correo o edad"
                />
              </div>
              {loading ? (
                <div className="loading">Cargando usuarios...</div>
              ) : usuarios.length === 0 ? (
                <div className="empty-state">No hay usuarios registrados</div>
              ) : filteredUsuarios.length === 0 ? (
                <div className="empty-state">No se encontraron usuarios con esa búsqueda</div>
              ) : (
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Edad</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>{usuario.id}</td>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.edad}</td>
                        <td>
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(usuario)}
                            title="Editar usuario"
                          >
                            Editar
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(usuario.id)}
                            title="Eliminar usuario"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;

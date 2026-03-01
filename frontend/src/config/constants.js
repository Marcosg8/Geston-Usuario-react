/**
 * Application Configuration and Constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  ENDPOINTS: {
    USERS: '/api/usuarios'
  },
  TIMEOUT: 10000
};

// Validation Rules
export const VALIDATION_RULES = {
  AGE: {
    MIN: 1,
    MAX: 120
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};

// UI Messages
export const MESSAGES = {
  SUCCESS: {
    CREATE: 'User created successfully',
    UPDATE: 'User updated successfully',
    DELETE: 'User deleted successfully'
  },
  ERROR: {
    FETCH: 'Error loading users. Please ensure the server is running.',
    CREATE: 'Error creating user',
    UPDATE: 'Error updating user',
    DELETE: 'Error deleting user',
    VALIDATION: 'Please complete all fields correctly',
    SERVER_CONNECTION: 'Cannot connect to server'
  },
  CONFIRM: {
    DELETE: 'Are you sure you want to delete this user?'
  },
  EMPTY_STATE: 'No users registered'
};

// UI Configuration
export const UI_CONFIG = {
  MESSAGE_TIMEOUT: 3000,
  ERROR_TIMEOUT: 5000
};

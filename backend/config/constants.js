/**
 * Backend Configuration and Constants
 */

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Response Messages
const MESSAGES = {
  SUCCESS: {
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully'
  },
  ERROR: {
    USER_NOT_FOUND: 'User not found',
    INVALID_ID: 'Invalid user ID',
    ALL_FIELDS_REQUIRED: 'All fields are required',
    INVALID_AGE: 'Age must be between 1 and 120',
    EMAIL_EXISTS: 'Email already exists',
    FAILED_RETRIEVE: 'Failed to retrieve users',
    FAILED_CREATE: 'Failed to create user',
    FAILED_UPDATE: 'Failed to update user',
    FAILED_DELETE: 'Failed to delete user'
  }
};

// Validation Rules
const VALIDATION = {
  AGE: {
    MIN: 1,
    MAX: 120
  }
};

// Database Error Codes
const DB_ERROR = {
  DUPLICATE_ENTRY: 'ER_DUP_ENTRY'
};

module.exports = {
  HTTP_STATUS,
  MESSAGES,
  VALIDATION,
  DB_ERROR
};

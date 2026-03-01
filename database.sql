-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS crud_db;

-- Usar la base de datos
USE crud_db;

-- Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  edad INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar algunos datos de prueba
INSERT INTO usuarios (nombre, email, edad) VALUES
('Juan Pérez', 'juan@example.com', 25),
('María García', 'maria@example.com', 30),
('Carlos López', 'carlos@example.com', 28);

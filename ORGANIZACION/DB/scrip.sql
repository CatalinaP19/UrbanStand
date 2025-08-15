DROP DATABASE IF EXISTS PROYECTOCC;
CREATE DATABASE PROYECTOCC;
USE PROYECTOCC;

-- Tabla de localidades
CREATE TABLE localidades (
    id_localidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE
);

-- Tabla de vendedores
CREATE TABLE vendedores (
    id_vendedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    tipo_documento VARCHAR(3),
    numero_documento BIGINT,
    hemi_url TEXT,
    rivi_url TEXT,
    vigencia BOOLEAN,
    productos_que_ofrece BOOLEAN,
    numero_celular VARCHAR(10),
    correo VARCHAR(100) UNIQUE,
    contraseña VARCHAR(255),
    direccion_puesto_trabajo TEXT,
    id_localidad INT,
    CONSTRAINT fk_vendedor_localidad FOREIGN KEY (id_localidad) REFERENCES localidades(id_localidad)
);

-- Tabla de productos (N:1 con vendedores)
CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    id_vendedor INT,
    nombre VARCHAR(100),
    descripcion TEXT,
    precio DECIMAL(10,2),
    CONSTRAINT fk_producto_vendedor FOREIGN KEY (id_vendedor) REFERENCES vendedores(id_vendedor) ON DELETE CASCADE
);

-- Tabla de clientes
CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
);

-- Tabla de mensajes (entre vendedores)
CREATE TABLE mensajes (
    id_mensaje SERIAL PRIMARY KEY,
    id_emisor INT,
    id_receptor INT,
    contenido TEXT,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mensaje_emisor FOREIGN KEY (id_emisor) REFERENCES vendedores(id_vendedor),
    CONSTRAINT fk_mensaje_receptor FOREIGN KEY (id_receptor) REFERENCES vendedores(id_vendedor)
);

-- Tabla de notificaciones (entre vendedores)
CREATE TABLE notificaciones (
    id_notificacion SERIAL PRIMARY KEY,
    id_emisor INT,
    id_receptor INT,
    mensaje TEXT,
    leido BOOLEAN DEFAULT FALSE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notificacion_emisor FOREIGN KEY (id_emisor) REFERENCES vendedores(id_vendedor),
    CONSTRAINT fk_notificacion_receptor FOREIGN KEY (id_receptor) REFERENCES vendedores(id_vendedor)
);

-- Tabla de ubicaciones (N:1 con vendedores)
CREATE TABLE ubicaciones (
    id_ubicacion SERIAL PRIMARY KEY,
    id_vendedor INT,
    latitud DECIMAL(9,6),
    longitud DECIMAL(9,6),
    CONSTRAINT fk_ubicacion_vendedor FOREIGN KEY (id_vendedor) REFERENCES vendedores(id_vendedor) ON DELETE CASCADE
);

-- Tabla de entidades
CREATE TABLE entidades (
    id_entidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    tipo_documento VARCHAR(3),
    numero_documento BIGINT,
    hemi_url TEXT,
    rivi_url TEXT,
    vigencia BOOLEAN,
    productos_que_ofrece BOOLEAN,
    numero_celular VARCHAR(10),
    correo VARCHAR(100) UNIQUE,
    contraseña VARCHAR(255),
    direccion_puesto_trabajo TEXT,
    id_localidad INT,
    CONSTRAINT fk_vendedor_localidad FOREIGN KEY (id_localidad) REFERENCES localidades(id_localidad)
);
const pool = require('../config/database');

const initTables = async () => {
  try {
    console.log('🔄 Creando tablas...');

    // Tabla de usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        correo VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        celular VARCHAR(20),
        rol VARCHAR(20) DEFAULT 'usuario',
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de productos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(200) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL,
        imagen VARCHAR(500),
        stock INTEGER DEFAULT 0,
        categoria VARCHAR(100),
        autor VARCHAR(100),
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de carritos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS carritos (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id),
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de items del carrito
    await pool.query(`
      CREATE TABLE IF NOT EXISTS carrito_items (
        id SERIAL PRIMARY KEY,
        carrito_id INTEGER REFERENCES carritos(id),
        producto_id INTEGER REFERENCES productos(id),
        cantidad INTEGER DEFAULT 1,
        agregado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de pedidos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id),
        total DECIMAL(10,2) NOT NULL,
        estado VARCHAR(50) DEFAULT 'pendiente',
        fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de items de pedidos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pedido_items (
        id SERIAL PRIMARY KEY,
        pedido_id INTEGER REFERENCES pedidos(id),
        producto_id INTEGER REFERENCES productos(id),
        cantidad INTEGER NOT NULL,
        precio DECIMAL(10,2) NOT NULL
      );
    `);

    console.log('✅ Tablas creadas exitosamente');

    // Insertar admin por defecto
    await pool.query(`
      INSERT INTO usuarios (nombre, correo, password, rol) 
      VALUES ('Administrador', 'admin@tienda.cl', '$2a$10$r8J7OcS2qYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQY', 'admin')
      ON CONFLICT (correo) DO NOTHING;
    `);

    console.log('✅ Admin por defecto creado');

  } catch (error) {
    console.error('❌ Error creando tablas:', error);
  }
};

module.exports = initTables;
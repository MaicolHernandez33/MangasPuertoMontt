const express = require('express');
const pool = require('../config/database');


const router = express.Router();

//  POST /api/admin/usuarios - Crear usuario desde admin 
router.post('/usuarios', async (req, res) => {
  try {
    const { nombre, correo, celular, password, rol } = req.body;

    // Validaciones
    if (!nombre || !correo || !password) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    //  Guardar contraseña en texto plano (TEMPORAL)
    const nuevoUsuario = await pool.query(
      `INSERT INTO usuarios (nombre, correo, celular, password, rol) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, nombre, correo, celular, rol, creado_en`,
      [nombre, correo, celular || null, password, rol || 'usuario'] // ← password en texto
    );

    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: nuevoUsuario.rows[0]
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/admin/usuarios - Ver todos los usuarios 
router.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nombre, correo, celular, rol, creado_en 
      FROM usuarios 
      ORDER BY creado_en DESC
    `);

    res.json({
      usuarios: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/admin/usuarios/:id - Obtener usuario específico
router.get('/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, nombre, correo, celular, rol, creado_en 
       FROM usuarios 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      usuario: result.rows[0]
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// PUT /api/admin/usuarios/:id - Actualizar rol de usuario
router.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;

  try {
    const usuarioActualizado = await pool.query(
      'UPDATE usuarios SET rol = $1 WHERE id = $2 RETURNING id, nombre, correo, celular, rol, creado_en',
      [rol, id]
    );

    if (usuarioActualizado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      mensaje: 'Rol de usuario actualizado',
      usuario: usuarioActualizado.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/admin/usuarios/:id - Eliminar usuario
router.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el usuario existe
    const usuarioExistente = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [id]
    );

    if (usuarioExistente.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = usuarioExistente.rows[0];

    // No permitir eliminar al admin principal
    if (usuario.correo === 'admin@tienda.cl') {
      return res.status(400).json({ error: 'No se puede eliminar al administrador principal' });
    }

    // Verificar si el usuario tiene pedidos
    const tienePedidos = await pool.query(
      'SELECT * FROM pedidos WHERE usuario_id = $1',
      [id]
    );

    if (tienePedidos.rows.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el usuario porque tiene pedidos asociados' 
      });
    }

    // Eliminar carrito del usuario si existe
    await pool.query('DELETE FROM carrito_items WHERE carrito_id IN (SELECT id FROM carritos WHERE usuario_id = $1)', [id]);
    await pool.query('DELETE FROM carritos WHERE usuario_id = $1', [id]);

    // Eliminar usuario
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);

    res.json({ mensaje: 'Usuario eliminado exitosamente' });

  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/admin/productos - Agregar producto desde admin
router.post('/productos', async (req, res) => {
  const { nombre, descripcion, precio, imagen, stock, categoria, autor, tipo, descuento } = req.body;

  try {
    if (!nombre || !precio || !stock) {
      return res.status(400).json({ error: 'Nombre, precio y stock son obligatorios' });
    }
    if (precio <= 0) return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
    if (stock < 0) return res.status(400).json({ error: 'El stock no puede ser negativo' });

    const nuevoProducto = await pool.query(
      `INSERT INTO productos 
        (nombre, descripcion, precio, imagen, stock, categoria, autor, tipo, descuento) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [nombre, descripcion, precio, imagen, stock, categoria, autor, tipo || 'manga', descuento || 0]
    );

    res.status(201).json({ mensaje: 'Producto agregado exitosamente', producto: nuevoProducto.rows[0] });
  } catch (error) {
    console.error('Error agregando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// GET /api/admin/productos/:id - Obtener producto específico
router.get('/productos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, nombre, descripcion, precio, imagen, stock, categoria, autor, creado_en 
       FROM productos 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({
      producto: result.rows[0]
    });

  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/admin/productos/:id - Actualizar producto 
router.put('/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, imagen, stock, categoria, autor, tipo, descuento } = req.body;

  try {
    const productoExistente = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (productoExistente.rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    const productoActual = productoExistente.rows[0];
    const nombreFinal = nombre ?? productoActual.nombre;
    const descripcionFinal = descripcion ?? productoActual.descripcion;
    const precioFinal = precio ?? productoActual.precio;
    const imagenFinal = imagen ?? productoActual.imagen;
    const stockFinal = stock ?? productoActual.stock;
    const categoriaFinal = categoria ?? productoActual.categoria;
    const autorFinal = autor ?? productoActual.autor;
    const tipoFinal = tipo ?? productoActual.tipo;
    const descuentoFinal = descuento ?? productoActual.descuento;

    if (precioFinal <= 0) return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
    if (stockFinal < 0) return res.status(400).json({ error: 'El stock no puede ser negativo' });
    if (descuentoFinal < 0 || descuentoFinal > 100) return res.status(400).json({ error: 'Descuento inválido' });

    const productoActualizado = await pool.query(
      `UPDATE productos 
       SET nombre=$1, descripcion=$2, precio=$3, imagen=$4, stock=$5, categoria=$6, autor=$7, tipo=$8, descuento=$9
       WHERE id=$10 RETURNING *`,
      [nombreFinal, descripcionFinal, precioFinal, imagenFinal, stockFinal, categoriaFinal, autorFinal, tipoFinal, descuentoFinal, id]
    );

    res.json({ mensaje: 'Producto actualizado exitosamente', producto: productoActualizado.rows[0] });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// PUT /api/admin/pedidos/:id - Actualizar estado del pedido
router.put('/pedidos/:id', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const pedidoActualizado = await pool.query(
      'UPDATE pedidos SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );

    if (pedidoActualizado.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json({
      mensaje: 'Estado del pedido actualizado',
      pedido: pedidoActualizado.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/admin/productos/:id - Eliminar producto
router.delete('/productos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el producto existe
    const productoExistente = await pool.query(
      'SELECT * FROM productos WHERE id = $1',
      [id]
    );

    if (productoExistente.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar si el producto está en algún carrito o pedido
    const enCarrito = await pool.query(
      'SELECT * FROM carrito_items WHERE producto_id = $1',
      [id]
    );

    const enPedidos = await pool.query(
      'SELECT * FROM pedido_items WHERE producto_id = $1', 
      [id]
    );

    if (enCarrito.rows.length > 0 || enPedidos.rows.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el producto porque está en carritos o pedidos activos' 
      });
    }

    // Eliminar producto
    await pool.query('DELETE FROM productos WHERE id = $1', [id]);

    res.json({ mensaje: 'Producto eliminado exitosamente' });

  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/productos/ofertas 
router.get('/productos/ofertas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos WHERE descuento > 0 ORDER BY descuento DESC');
    res.json({ productos: result.rows });
  } catch (error) {
    console.error('Error obteniendo productos en oferta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/admin/pedidos/:id - Eliminar pedido
router.delete('/pedidos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el pedido existe
    const pedidoExistente = await pool.query(
      'SELECT * FROM pedidos WHERE id = $1',
      [id]
    );

    if (pedidoExistente.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Eliminar items del pedido primero (por la foreign key)
    await pool.query('DELETE FROM pedido_items WHERE pedido_id = $1', [id]);

    // Eliminar el pedido
    await pool.query('DELETE FROM pedidos WHERE id = $1', [id]);

    res.json({ mensaje: 'Pedido eliminado exitosamente' });

  } catch (error) {
    console.error('Error eliminando pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/admin/pedidos - Todos los pedidos (admin)
router.get('/pedidos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.total,
        p.estado,
        p.fecha_pedido,
        u.nombre as usuario_nombre,
        u.correo as usuario_correo,
        json_agg(
          json_build_object(
            'producto_id', pi.producto_id,
            'nombre', prod.nombre,
            'precio', pi.precio,
            'cantidad', pi.cantidad,
            'subtotal', (pi.precio * pi.cantidad)
          )
        ) as items
      FROM pedidos p
      LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
      LEFT JOIN productos prod ON pi.producto_id = prod.id
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      GROUP BY p.id, p.total, p.estado, p.fecha_pedido, u.nombre, u.correo
      ORDER BY p.fecha_pedido DESC
    `);

    res.json({
      pedidos: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo pedidos admin:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
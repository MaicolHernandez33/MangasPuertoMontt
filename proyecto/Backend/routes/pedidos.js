const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Middleware para obtener usuario
const getUsuarioId = (req) => {
  return req.headers['usuario-id'] || 1;
};

// GET /api/pedidos - Obtener pedidos del usuario
router.get('/', async (req, res) => {
  try {
    const usuarioId = getUsuarioId(req);

    const result = await pool.query(`
      SELECT 
        p.id,
        p.total,
        p.estado,
        p.fecha_pedido,
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
      WHERE p.usuario_id = $1
      GROUP BY p.id, p.total, p.estado, p.fecha_pedido
      ORDER BY p.fecha_pedido DESC
    `, [usuarioId]);

    res.json({
      pedidos: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/pedidos - Crear pedido desde carrito
router.post('/', async (req, res) => {
  try {
    const usuarioId = getUsuarioId(req);

    // Obtener carrito del usuario
    const carrito = await pool.query(
      `SELECT ci.producto_id, ci.cantidad, p.precio, p.nombre
       FROM carrito_items ci
       JOIN carritos c ON ci.carrito_id = c.id
       JOIN productos p ON ci.producto_id = p.id
       WHERE c.usuario_id = $1`,
      [usuarioId]
    );

    if (carrito.rows.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // Calcular total
    const total = carrito.rows.reduce((sum, item) => {
      return sum + (parseFloat(item.precio) * item.cantidad);
    }, 0);

    // Crear pedido
    const pedidoResult = await pool.query(
      'INSERT INTO pedidos (usuario_id, total, estado) VALUES ($1, $2, $3) RETURNING *',
      [usuarioId, total, 'pendiente']
    );

    const pedidoId = pedidoResult.rows[0].id;

    // Crear items del pedido
    for (const item of carrito.rows) {
      await pool.query(
        'INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio) VALUES ($1, $2, $3, $4)',
        [pedidoId, item.producto_id, item.cantidad, item.precio]
      );
    }

    // Vaciar carrito
    const carritoInfo = await pool.query(
      'SELECT id FROM carritos WHERE usuario_id = $1',
      [usuarioId]
    );

    if (carritoInfo.rows.length > 0) {
      await pool.query(
        'DELETE FROM carrito_items WHERE carrito_id = $1',
        [carritoInfo.rows[0].id]
      );
    }

    res.status(201).json({
      mensaje: 'Pedido creado exitosamente',
      pedido: {
        id: pedidoId,
        total: total,
        estado: 'pendiente'
      }
    });

  } catch (error) {
    console.error('Error creando pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
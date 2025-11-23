const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Middleware para obtener usuario (simulado por ahora)
const getUsuarioId = (req) => {
  // En producción, esto vendría de un token JWT
  return req.headers['usuario-id'] || 1; // Temporal: usuario 1
};

// GET /api/carrito - Obtener carrito del usuario
router.get('/', async (req, res) => {
  try {
    const usuarioId = getUsuarioId(req);

    const result = await pool.query(`
      SELECT 
        ci.id as item_id,
        p.id as producto_id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.imagen,
        ci.cantidad,
        (p.precio * ci.cantidad) as subtotal
      FROM carrito_items ci
      JOIN productos p ON ci.producto_id = p.id
      JOIN carritos c ON ci.carrito_id = c.id
      WHERE c.usuario_id = $1
      ORDER BY ci.agregado_en DESC
    `, [usuarioId]);

    const total = result.rows.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

    res.json({
      items: result.rows,
      total: total
    });

  } catch (error) {
    console.error('Error obteniendo carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/carrito - Agregar item al carrito
router.post('/', async (req, res) => {
  const { producto_id, cantidad = 1 } = req.body;

  try {
    const usuarioId = getUsuarioId(req);

    if (!producto_id) {
      return res.status(400).json({ error: 'producto_id es requerido' });
    }

    // Verificar si el producto existe
    const producto = await pool.query('SELECT * FROM productos WHERE id = $1', [producto_id]);
    if (producto.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Obtener o crear carrito
    let carrito = await pool.query(
      'SELECT * FROM carritos WHERE usuario_id = $1',
      [usuarioId]
    );

    let carritoId;
    if (carrito.rows.length === 0) {
      const nuevoCarrito = await pool.query(
        'INSERT INTO carritos (usuario_id) VALUES ($1) RETURNING id',
        [usuarioId]
      );
      carritoId = nuevoCarrito.rows[0].id;
    } else {
      carritoId = carrito.rows[0].id;
    }

    // Verificar si el item ya está en el carrito
    const itemExistente = await pool.query(
      'SELECT * FROM carrito_items WHERE carrito_id = $1 AND producto_id = $2',
      [carritoId, producto_id]
    );

    if (itemExistente.rows.length > 0) {
      // Actualizar cantidad
      await pool.query(
        'UPDATE carrito_items SET cantidad = cantidad + $1 WHERE id = $2',
        [cantidad, itemExistente.rows[0].id]
      );
    } else {
      // Agregar nuevo item
      await pool.query(
        'INSERT INTO carrito_items (carrito_id, producto_id, cantidad) VALUES ($1, $2, $3)',
        [carritoId, producto_id, cantidad]
      );
    }

    res.json({ mensaje: 'Producto agregado al carrito' });

  } catch (error) {
    console.error('Error agregando al carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/carrito/:itemId - Eliminar item del carrito
router.delete('/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;

    const result = await pool.query(
      'DELETE FROM carrito_items WHERE id = $1 RETURNING *',
      [itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado en el carrito' });
    }

    res.json({ mensaje: 'Item eliminado del carrito' });

  } catch (error) {
    console.error('Error eliminando del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
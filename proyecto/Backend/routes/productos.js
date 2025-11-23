const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// GET /api/productos - Listar todos los productos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM productos 
      ORDER BY creado_en DESC
    `);

    res.json({
      productos: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/productos/:id - Obtener producto específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ producto: result.rows[0] });

  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
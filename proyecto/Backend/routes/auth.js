const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { nombre, correo, password, celular } = req.body;

  try {
    // Validaciones
    if (!nombre || !correo || !password) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben ser completados' });
    }

    const dominioPermitido = /@(?:duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(correo);
    if (!dominioPermitido) {
      return res.status(400).json({ error: 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com' });
    }

    const okPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
    if (!okPass) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres, con mayúscula, minúscula y número' });
    }

    // Verificar si usuario existe
    const usuarioExistente = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo.toLowerCase()]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ error: 'Este correo ya está registrado' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const nuevoUsuario = await pool.query(
      `INSERT INTO usuarios (nombre, correo, password, celular, rol) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, nombre, correo, celular, rol`,
      [nombre.trim(), correo.toLowerCase(), hashedPassword, celular?.trim() || null, 'usuario']
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: nuevoUsuario.rows[0]
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Buscar usuario
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    const usuario = result.rows[0];

    // ✅ COMPARACIÓN CORRECTA CON BCRYPT
    const passwordValido = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValido) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    // Eliminar password de la respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    res.json({
      mensaje: 'Login exitoso',
      usuario: usuarioSinPassword
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
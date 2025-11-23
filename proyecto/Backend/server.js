const express = require('express');
const cors = require('cors');
const initTables = require('./models/initDB');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar base de datos
initTables();

// Routes
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const carritoRoutes = require('./routes/carrito');
const pedidosRoutes = require('./routes/pedidos');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/admin', adminRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Backend de Manga5PuertoMontt funcionando!',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login', 
      'GET  /api/productos',
      'GET  /api/carrito',
      'POST /api/carrito',
      'DELETE /api/carrito/:itemId',
      'GET  /api/pedidos',
      'POST /api/pedidos',
      'GET  /api/admin/pedidos',
      'PUT  /api/admin/productos/:id',
      'DELETE /api/admin/productos/:id'
    ]
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
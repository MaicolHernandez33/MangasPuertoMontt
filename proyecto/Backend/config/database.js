const { Pool } = require('pg');
require('dotenv').config();

// Tu connection string de Neon
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_aJ8ru3AiHTQO@ep-lucky-tree-ac9abeo3-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: {
    rejectUnauthorized: false
  }
});

// Verificar conexión
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.stack);
  } else {
    console.log('✅ Conectado a PostgreSQL en Neon');
    release();
  }
});

module.exports = pool;
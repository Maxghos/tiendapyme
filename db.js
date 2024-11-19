require('dotenv').config();
const { Pool } = require('pg');

// Configuración de la conexión
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // URL de la base de datos desde .env
  ssl: { rejectUnauthorized: false }, // Necesario para Railway
});

module.exports = pool; // Exportar el pool de conexión

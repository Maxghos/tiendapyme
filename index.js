const { Client } = require('pg'); // Importa el cliente de PostgreSQL

// Configuración de la base de datos
const client = new Client({
  connectionString: process.env.DATABASE_URL, // Usa la variable de entorno
  ssl: {
    rejectUnauthorized: false, // Habilita SSL si Railway lo requiere
  },
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    await client.connect(); // Conéctate al servidor
    console.log('✅ Conexión exitosa a PostgreSQL en Railway');

    const res = await client.query('SELECT NOW()'); // Realiza una consulta simple
    console.log('Fecha y hora actuales en la base de datos:', res.rows[0]);
  } catch (err) {
    console.error('❌ Error al conectar con la base de datos:', err);
  } finally {
    await client.end(); // Cierra la conexión
  }
};

// Ejecuta la función
testConnection();
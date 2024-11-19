const { Pool } = require('pg'); // Importar el Pool de conexiones
require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env

// Configuración del Pool de PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Dirección de la base de datos desde .env
    ssl: {
        rejectUnauthorized: false, // Asegúrate de usar esto si Railway requiere SSL
    },
});

// Probar la conexión (esto se ejecutará al cargar el archivo)
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error al conectar con la base de datos:', err.stack);
    } else {
        console.log('✅ Conexión exitosa a PostgreSQL');
        client.query('SELECT NOW()', (err, result) => {
            release(); // Libera el cliente después de la consulta
            if (err) {
                console.error('❌ Error al ejecutar la consulta:', err.stack);
            } else {
                console.log('Fecha y hora actuales en la base de datos:', result.rows[0]);
            }
        });
    }
});

// Exportar el pool para usarlo en otros archivos
module.exports = pool;

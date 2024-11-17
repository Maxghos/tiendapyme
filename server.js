const express = require('express'); // Importa Express
const { testConnection } = require('./index'); // Importa la función de conexión desde index.js

const app = express(); // Crea la aplicación de Express
const PORT = process.env.PORT || 3000; // Configura el puerto

// Ruta para probar la conexión a la base de datos
app.get('/test-db', async (req, res) => {
    try {
        await testConnection(); // Llama a la función de prueba
        res.send('Conexión exitosa con la base de datos');
    } catch (err) {
        console.error('Error en la conexión:', err);
        res.status(500).send('Error al conectar con la base de datos');
    }
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

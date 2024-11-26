// Importar módulos necesarios
const express = require('express');
const path = require('path'); // Módulo para manejar rutas
const app = express();
const PORT = process.env.PORT || 3000;
const pool = require('./db'); // Importar la conexión a PostgreSQL desde db.js
const cors = require('cors'); // Cuirao e

// Habilitar CORS para todas las rutas
app.use(cors());

// Middleware para procesar JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Ruta básica de prueba
app.get('/', (req, res) => {
    res.send('¡Servidor funcionando correctamente!');
});

// Ruta para probar la conexión a PostgreSQL
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.send(`Conexión exitosa. Fecha y hora actual en la base de datos: ${result.rows[0].now}`);
    } catch (err) {
        console.error('Error al conectar con la base de datos:', err.message);
        res.status(500).send('Error al conectar con la base de datos');
    }
});

// Crear un nuevo producto
app.post('/productos', async (req, res) => {
    const { id_producto, id_categoria, nombre, descripcion, precio, stock } = req.body;

    try {
        const query = `
            INSERT INTO "productos" (id_producto, id_categoria, nombre, descripcion, precio, stock)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        await pool.query(query, [id_producto, id_categoria, nombre, descripcion, precio, stock]);
        res.status(201).send('Producto creado exitosamente');
    } catch (err) {
        console.error('Error al crear producto:', err.message);
        res.status(500).send('Error al crear producto');
    }
});



// Obtener productos
app.get('/productos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "productos"');
        if (result.rows.length === 0) {
            return res.status(404).send('No hay productos en la base de datos');
        }
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener productos:', err.message);
        res.status(500).send('Error al obtener productos');
    }
});

// Actualizar un producto
app.put('/productos/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, id_categoria } = req.body;

    try {
        const query = `
            UPDATE "productos"
            SET nombre = $1, descripcion = $2, precio = $3, stock = $4, id_categoria = $5
            WHERE id_producto = $6
        `;
        const result = await pool.query(query, [nombre, descripcion, precio, stock, id_categoria, id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Producto no encontrado');
        }
        res.send('Producto actualizado exitosamente');
    } catch (err) {
        console.error('Error al actualizar producto:', err.message);
        res.status(500).send('Error al actualizar producto');
    }
});

// Eliminar un producto
app.delete('/productos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM "productos" WHERE id_producto = $1`;
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Producto no encontrado');
        }
        res.send('Producto eliminado exitosamente');
    } catch (err) {
        console.error('Error al eliminar producto:', err.message);
        res.status(500).send('Error al eliminar producto');
    }
});

// Procesar compra: generar resumen y actualizar stock
app.post('/api/checkout', async (req, res) => {
    const { email, carrito, total, direccion_envio } = req.body;

    console.log("Datos recibidos en /api/checkout:", { email, carrito, total, direccion_envio });

    if (!email || !carrito || !total || !direccion_envio) {
        return res.status(400).send('Faltan datos necesarios para procesar la compra.');
    }

    try {
        // Crear orden de compra
        const resultOrden = await pool.query(
            `INSERT INTO orden_compra (id_usuario, fecha_aprobacion, estado_envio, direccion_envio)
             VALUES (
                (SELECT id_usuario FROM usuario WHERE correo_electronico = $1),
                NOW(),
                'En proceso',
                $2
             ) RETURNING id_orden`,
            [email, direccion_envio]
        );

        const id_orden = resultOrden.rows[0]?.id_orden;

        if (!id_orden) {
            throw new Error("No se pudo crear la orden de compra.");
        }

        // Procesar carrito y actualizar stock
        for (const item of carrito) {
            const { name: nombre, quantity: cantidad } = item;

            console.log("Procesando producto:", { nombre, cantidad });

            // Verificar stock y actualizarlo
            const resultStock = await pool.query(
                `UPDATE productos
                 SET stock = stock - $1
         WHERE nombre = $2 AND stock >= $1
                 RETURNING stock`,
                [cantidad, nombre]
            );

            if (resultStock.rowCount === 0) {
                throw new Error(`Stock insuficiente para el producto: ${nombre}`);
            }
        }

        // Crear resumen para el cliente
        let resumenHtml = `<h1>Resumen de tu Compra</h1><ul>`;
        carrito.forEach(item => {
            resumenHtml += `<li>${item.name} - Cantidad: ${item.quantity} - Precio: ${item.price}</li>`;
        });
        resumenHtml += `</ul><p>Total: $${total}</p><p>Gracias por comprar con nosotros.</p>`;

        res.status(200).send({
            message: 'Compra procesada exitosamente',
            resumen: resumenHtml
        });
    } catch (error) {
        console.error('Error al procesar la compra:', error.message);
        res.status(500).send(`Error al procesar la compra: ${error.message}`);
    }
});

app.post('/api/cart', async (req, res) => {
  const { carrito } = req.body;

  console.log("Datos recibidos en /api/cart:", carrito);

  if (!carrito || carrito.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío.' });
  }

  try {
      for (const item of carrito) {
          console.log("Procesando producto:", item);
          const result = await pool.query(`
              SELECT precio 
              FROM productos 
              WHERE nombre = $1
          `, [item.nombre]);

          if (result.rows.length === 0) {
              console.error(`Producto no encontrado: ${item.nombre}`);
              return res.status(404).json({ error: `Producto no encontrado: ${item.nombre}` });
          }

          const precio = parseFloat(result.rows[0].precio);
          const totalProducto = precio * item.cantidad;

          await pool.query(`
              INSERT INTO carrito (id_producto, cantidad, fecha_creacion, total_todo)
              VALUES (
                  (SELECT id_producto FROM productos WHERE nombre = $1), 
                  $2, 
                  NOW(),
                  $3
              )
          `, [item.nombre, item.cantidad, totalProducto]);
      }

      res.status(200).json({ message: 'Carrito procesado correctamente con totales calculados.' });
  } catch (error) {
      console.error('Error al procesar el carrito:', error.message);
      res.status(500).json({ error: 'Error al procesar el carrito.' });
  }
});



// Usuarios crear
app.post('/api/usuarios', async (req, res) => {
    const { id_usuario, id_rol, correo_electronico, contraseña, nombre, domicilio, telefono } = req.body;

    if (!id_usuario || !id_rol || !correo_electronico || !contraseña || !nombre || !domicilio || !telefono) {
        return res.status(400).json({ error: "Faltan datos requeridos." });
    }

    const fechaUltimoIngreso = new Date().toISOString();

    try {
        const userCheckQuery = `
            SELECT contraseña 
            FROM usuario 
            WHERE correo_electronico = $1
        `;
        const userCheckResult = await pool.query(userCheckQuery, [correo_electronico]);

        if (userCheckResult.rows.length > 0) {
            const storedPassword = userCheckResult.rows[0].contraseña;

            if (storedPassword !== contraseña) {
                return res.status(400).json({ error: "Contraseña incorrecta para este correo electrónico." });
            }

            const updateLoginDateQuery = `
                UPDATE usuario
                SET fecha_ultimo_ingreso = $1
                WHERE correo_electronico = $2
            `;
            await pool.query(updateLoginDateQuery, [fechaUltimoIngreso, correo_electronico]);

            return res.status(200).json({ message: "Usuario existente, fecha de último ingreso actualizada." });
        }

        const insertUserQuery = `
            INSERT INTO usuario (id_usuario, id_rol, correo_electronico, contraseña, nombre, domicilio, telefono, fecha_ultimo_ingreso)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        await pool.query(insertUserQuery, [
            id_usuario,
            id_rol,
            correo_electronico,
            contraseña,
            nombre,
            domicilio,
            telefono,
            fechaUltimoIngreso
        ]);

        res.status(201).json({ message: "Usuario registrado exitosamente." });
    } catch (err) {
        console.error("Error al procesar usuario:", err.message);
        res.status(500).json({ error: "Error al procesar usuario." });
    }
});

// Ruta para obtener el stock de un producto por su código
app.get('/api/productos/:codigo', async (req, res) => {
  const { codigo } = req.params; // Obtiene el código del producto de la URL

  try {
      // Consulta a la base de datos
      const query = `SELECT stock FROM productos WHERE id_producto = $1`;
      const result = await pool.query(query, [codigo]);

      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Responde con el stock del producto
      res.json({ stock: result.rows[0].stock });
  } catch (error) {
      console.error('Error al obtener stock:', error.message);
      res.status(500).json({ error: 'Error al obtener stock' });
  }
});



// Ruta para obtener el precio de un producto por su código
app.get('/api/precio/:codigo', async (req, res) => {
  const { codigo } = req.params; // Obtiene el código del producto de la URL

  try {
      // Consulta a la base de datos
      const query = `SELECT precio FROM productos WHERE id_producto = $1`;
      const result = await pool.query(query, [codigo]);

      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Responde con el precio del producto
      res.json({ precio: result.rows[0].precio });
  } catch (error) {
      console.error('Error al obtener precio:', error.message);
      res.status(500).json({ error: 'Error al obtener precio' });
  }
});

// Ruta para manejar inicio de sesión
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Correo y contraseña son obligatorios." });
    }

    try {
        // Consultar el usuario en la base de datos
        const query = `
            SELECT id_rol, contraseña
            FROM usuario
            WHERE correo_electronico = $1
        `;
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        const user = result.rows[0];

        // Validar la contraseña
        if (user.contraseña !== password) {
            return res.status(401).json({ error: "Contraseña incorrecta." });
        }

        // Devolver el rol del usuario
        res.json({ id_rol: user.id_rol });
    } catch (error) {
        console.error("Error durante la autenticación:", error.message);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

//Para registrarUsuario
app.post('/api/registrarse', async (req, res) => {
    const { id_usuario, id_rol = 2, correo_electronico, contraseña, nombre, domicilio, telefono } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!correo_electronico || !contraseña || !nombre) {
        return res.status(400).json({ error: "Faltan datos requeridos para el registro." });
    }

    try {
        // Generar un nuevo ID de usuario (puedes usar una lógica más avanzada si es necesario)
        const newIdUsuario = Math.floor(Math.random() * 1000000000); // Generar un número aleatorio

        // Insertar el nuevo usuario en la base de datos
        const query = `
            INSERT INTO usuario (id_usuario, id_rol, correo_electronico, contraseña, nombre, domicilio, telefono)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await pool.query(query, [
            newIdUsuario,
            id_rol,
            correo_electronico,
            contraseña,
            nombre,
            domicilio || 'Sin domicilio', // Valor predeterminado
            telefono || 'Sin teléfono',  // Valor predeterminado
        ]);

        res.status(201).json({ message: "Usuario registrado exitosamente." });
    } catch (error) {
        console.error("Error al registrar usuario:", error.message);
        res.status(500).json({ error: "Hubo un problema al registrar el usuario." });
    }
});

// Ruta para obtener el nombre de un producto por su código
app.get('/api/nombre/:codigo', async (req, res) => {
    const { codigo } = req.params; // Obtiene el código del producto de la URL

    try {
        // Consulta a la base de datos
        const query = `SELECT nombre FROM productos WHERE id_producto = $1`;
        const result = await pool.query(query, [codigo]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Responde con el nombre del producto
        res.json({ nombre: result.rows[0].nombre });
    } catch (error) {
        console.error('Error al obtener nombre:', error.message);
        res.status(500).json({ error: 'Error al obtener nombre' });
    }
});

//Cosa de editar USUARIOS
app.put('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, correo_electronico, id_rol } = req.body;

    try {
        const query = `
            UPDATE usuario
            SET nombre = $1, correo_electronico = $2, id_rol = $3
            WHERE id_usuario = $4
        `;
        const result = await pool.query(query, [nombre, correo_electronico, id_rol, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error.message);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// Ruta para obtener usuarios
app.get('/api/usuarios', async (req, res) => {
    try {
        console.log('Solicitud recibida en /api/usuarios');
        const result = await pool.query('SELECT * FROM usuario');
        console.log('Usuarios obtenidos:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Ruta para eliminar un usuario por su ID
app.delete('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params; // Obtiene el ID del usuario de los parámetros de la URL

    try {
        // Consulta para eliminar al usuario
        const query = `DELETE FROM usuario WHERE id_usuario = $1`;
        const result = await pool.query(query, [id]);

        // Verifica si el usuario fue encontrado y eliminado
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

//Obtener Solcitudes de Ordenes
app.get('/api/ordenes', async (req, res) => {
    try {
        const result = await pool.query('SELECT id_orden, id_usuario, fecha_aprobacion, estado_envio FROM orden_compra');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        res.status(500).json({ error: 'Error al obtener órdenes' });
    }
});

// Cambiar estado a 'Aceptado'
app.post('/api/aceptar-orden/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `UPDATE orden_compra
             SET estado_envio = 'Aceptado', fecha_aprobacion = NOW()
             WHERE id_orden = $1
             RETURNING id_orden, estado_envio, fecha_aprobacion`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        res.json(result.rows[0]); // Devolver los datos actualizados
    } catch (error) {
        console.error('Error al aceptar la orden:', error);
        res.status(500).json({ error: 'Error al aceptar la orden' });
    }
});

// Cambiar estado a 'Rechazado'
app.post('/api/rechazar-orden/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `UPDATE orden_compra
             SET estado_envio = 'Rechazado', fecha_aprobacion = NOW()
             WHERE id_orden = $1
             RETURNING id_orden, estado_envio, fecha_aprobacion`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        res.json(result.rows[0]); // Devolver los datos actualizados
    } catch (error) {
        console.error('Error al rechazar la orden:', error);
        res.status(500).json({ error: 'Error al rechazar la orden' });
    }
});



// Ruta para servir el archivo index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
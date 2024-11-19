// Función para validar los campos del formulario
function validateForm() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const domicilio = document.getElementById('domicilio').value.trim();
    const contraseña = document.getElementById('contraseña').value.trim();

    if (!nombre || !email || !telefono || !domicilio || !contraseña) {
        alert("Por favor, completa todos los campos antes de continuar.");
        return false;
    }

    // Validación adicional para el formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        return false;
    }

    // Validación adicional para el teléfono (números únicamente)
    const telefonoRegex = /^[0-9]+$/;
    if (!telefonoRegex.test(telefono)) {
        alert("Por favor, ingresa un número de teléfono válido.");
        return false;
    }

    // Validación para longitud mínima de la contraseña
    if (contraseña.length < 7) {
        alert("La contraseña debe tener al menos 7 caracteres.");
        return false;
    }

    return true;
}

// Función para generar un ID de usuario aleatorio
function generateUniqueId() {
    return Math.floor(100000000 + Math.random() * 900000000); // Genera un número entero único
}

// Envía los datos al backend
document.getElementById('submit-btn').addEventListener('click', async (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del botón

    if (validateForm()) {
        const id_usuario = generateUniqueId();
        const id_rol = 2; // Por ejemplo, rol 2 para un usuario estándar
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const domicilio = document.getElementById('domicilio').value.trim();
        const contraseña = document.getElementById('contraseña').value.trim();

        const userData = {
            id_usuario,
            id_rol,
            correo_electronico: email,
            contraseña,
            nombre,
            domicilio,
            telefono
        };

        try {
            // Enviar datos al backend
            const response = await fetch("https://tiendapyme-production.up.railway.app/api/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error("Error al registrar al usuario.");
            }

            // Guardar el correo en localStorage para usarlo en las siguientes páginas
            localStorage.setItem('userEmail', email);

            alert("Usuario ingresado/registrado correctamente.");
            window.location.href = "../compra3/compra3.html"; // Redirige a la siguiente página
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un problema al registrar al usuario.");
        }
    }
});

// Mostrar u ocultar la contraseña
document.getElementById('toggle-password').addEventListener('change', function () {
    const passwordField = document.getElementById('contraseña');
    passwordField.type = this.checked ? 'text' : 'password';
});

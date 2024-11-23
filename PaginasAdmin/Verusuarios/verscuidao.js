// Definimos las URLs necesarias para interactuar con el backend
const API_FETCH_URL = 'https://tiendapyme-production.up.railway.app/api/usuarios'; // Para obtener y manejar usuarios
const API_REGISTER_URL = 'https://tiendapyme-production.up.railway.app/api/registrarse'; // Para registrar un nuevo usuario

// Alternar el menú lateral
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.width = (sidebar.style.width === "250px") ? "0" : "250px";
}

// Abrir el formulario para agregar usuario
function openAddUserForm() {
    document.getElementById('addUserModal').style.display = 'block';
}

// Cerrar modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Obtener y mostrar usuarios desde la base de datos
async function fetchUsers() {
    try {
        const response = await fetch(API_FETCH_URL);
        if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
        }
        const users = await response.json();

        const userList = document.getElementById('user-list');
        userList.innerHTML = ''; // Limpiar lista actual

        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
                <h3>${user.nombre}</h3>
                <p><strong>Email:</strong> ${user.correo_electronico}</p>
                <p><strong>Rol:</strong> ${user.id_rol === 1 ? 'Administrador' : 'Usuario'}</p>
                <button onclick="editUser('${user.id_usuario}')">Editar</button>
                <button onclick="confirmDeleteUser('${user.id_usuario}')">Eliminar</button>
            `;
            userList.appendChild(userCard);
        });
    } catch (error) {
        console.error('Error al cargar usuarios:', error.message);
        alert('No se pudieron cargar los usuarios.');
    }
}

// Agregar usuario
async function addUser() {
    const nombre = document.getElementById('userName').value;
    const correo = document.getElementById('userEmail').value;
    const contraseña = document.getElementById('userPassword').value;
    const rol = document.getElementById('userRole').value;
    const domicilio = document.getElementById('userAddress').value || 'Sin domicilio';
    const telefono = document.getElementById('userPhone').value || 'Sin teléfono';

    if (!nombre || !correo || !contraseña) {
        alert('Por favor, completa los campos Nombre, Email y Contraseña.');
        return;
    }

    const payload = {
        nombre,
        correo_electronico: correo,
        contraseña,
        id_rol: rol === 'admin' ? 1 : 2, // 1 para Admin, 2 para Usuario
        domicilio,
        telefono,
    };

    console.log("Datos enviados al servidor:", payload);

    try {
        const response = await fetch(API_REGISTER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al agregar el usuario');
        }

        alert('Usuario agregado exitosamente');
        closeModal('addUserModal');
        fetchUsers();
    } catch (error) {
        console.error('Error al agregar usuario:', error.message);
        alert(`No se pudo agregar el usuario: ${error.message}`);
    }
}

// Editar usuario
async function editUser(userId) {
    const nombre = prompt('Introduce el nuevo nombre del usuario');
    const correo = prompt('Introduce el nuevo correo electrónico');
    const rol = confirm('¿Es Administrador?') ? 1 : 2;

    if (!nombre || !correo) {
        alert('No puedes dejar los campos vacíos');
        return;
    }

    const payload = {
        nombre,
        correo_electronico: correo,
        id_rol: rol,
    };

    console.log("Datos enviados al servidor para editar:", payload);

    try {
        const response = await fetch(`${API_FETCH_URL}/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || 'Error al editar el usuario');
        }

        alert('Usuario editado exitosamente');
        fetchUsers(); // Recargar la lista de usuarios
    } catch (error) {
        console.error('Error al editar usuario:', error.message);
        alert(`No se pudo editar el usuario: ${error.message}`);
    }
}

// Confirmar y eliminar usuario
async function confirmDeleteUser(userId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;

    try {
        const response = await fetch(`${API_FETCH_URL}/${userId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || 'Error al eliminar el usuario');
        }

        alert('Usuario eliminado exitosamente');
        fetchUsers(); // Actualizar la lista de usuarios
    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        alert(`No se pudo eliminar el usuario: ${error.message}`);
    }
}

// Inicializar la carga de usuarios cuando se carga la página
document.addEventListener('DOMContentLoaded', fetchUsers);

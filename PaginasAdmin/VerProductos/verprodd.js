const BASE_URL = 'https://tiendapyme-production.up.railway.app'; // Cambia al dominio del backend si no es localhost
let productos = []; // Lista global para almacenar productos desde el backend

// Función para mostrar y ocultar el menú lateral
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.width === '250px') {
        sidebar.style.width = '0';
    } else {
        sidebar.style.width = '250px';
    }
}


// Obtener productos desde el backend
async function fetchProductos() {
    try {
        const response = await fetch(`${BASE_URL}/productos`);
        if (!response.ok) throw new Error('Error al obtener productos');
        
        productos = await response.json(); // Actualiza la variable global
        displayProducts(productos); // Muestra los productos
    } catch (err) {
        console.error('Error al obtener productos:', err.message);
    }
}

function displayProducts(productos) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Limpiar la lista antes de mostrar

    productos.forEach((product) => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <p><strong>ID Producto:</strong> ${product.id_producto}</p>
            <h3>${product.nombre}</h3>
            <p>Precio: $${product.precio}</p>
            <p>Stock: ${product.stock} unidades</p>
            <p>Categoría: ${product.categoria}</p>
            <button onclick="openEditProductModal('${product.id_producto}')">Editar</button>
            <button onclick="deleteProduct('${product.id_producto}')">Eliminar</button>
        `;
        productList.appendChild(productElement);
    });
}

// Mostrar el modal de agregar producto
function addProduct() {
    document.getElementById('addProductModal').style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
}

// Mostrar el modal de edición y cargar los datos del producto seleccionado
function openEditProductModal(idProducto) {
    const producto = productos.find(p => p.id_producto === idProducto);

    if (!producto) {
        alert('Producto no encontrado');
        return;
    }

    // Prellenar los campos del formulario de edición
    document.getElementById('editProductName').value = producto.nombre;
    document.getElementById('editProductDescription').value = producto.descripcion;
    document.getElementById('editProductPrice').value = producto.precio;
    document.getElementById('editProductStock').value = producto.stock;
    document.getElementById('editProductCategory').value = producto.categoria;

    // Guardar el ID del producto como atributo del modal
    document.getElementById('editProductModal').dataset.id = idProducto;

    // Mostrar el modal
    document.getElementById('editProductModal').style.display = 'block';
}

// Cerrar un modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Agregar producto
async function submitProduct() {
    const idProducto = document.getElementById('productId').value.trim();
    const nombre = document.getElementById('productName').value.trim();
    const descripcion = document.getElementById('productDescription').value.trim();
    const precio = document.getElementById('productPrice').value.trim();
    const stock = document.getElementById('productStock').value.trim();
    const categoria = document.getElementById('productCategory').value;

    if (!idProducto || !nombre || !descripcion || !precio || !stock || !categoria) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/productos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_producto: idProducto,
                nombre: nombre,
                descripcion: descripcion,
                precio: precio,
                stock: stock,
                id_categoria: categoria
            }),
        });

        if (!response.ok) throw new Error('Error al agregar producto');
        alert('Producto agregado correctamente');
        fetchProductos(); // Actualizar la lista de productos
        closeModal('addProductModal'); // Cerrar el modal
    } catch (err) {
        console.error('Error al agregar producto:', err.message);
    }
}
async function updateProduct() {
    const modal = document.getElementById('editProductModal');
    const idProducto = modal.dataset.id; // Obtener el ID del producto desde el atributo del modal
    const productName = document.getElementById('editProductName').value.trim();
    const productDescription = document.getElementById('editProductDescription').value.trim();
    const productPrice = parseFloat(document.getElementById('editProductPrice').value.trim());
    const productStock = parseInt(document.getElementById('editProductStock').value.trim());
    const productCategory = document.getElementById('editProductCategory').value;

    // Validación básica
    if (!productName || !productDescription || isNaN(productPrice) || isNaN(productStock) || !productCategory) {
        document.getElementById('editErrorMessage').style.display = 'block';
        return;
    }

    // Validación de precio
if (productPrice < 0) {
    document.getElementById('editErrorMessage').innerText = "El precio no puede ser negativo.";
    document.getElementById('editErrorMessage').style.display = 'block';
    return;
}

    try {
        // Enviar la categoría tal cual desde el frontend
        const response = await fetch(`${BASE_URL}/productos/${idProducto}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: productName,
                descripcion: productDescription,
                precio: productPrice,
                stock: productStock,
                id_categoria: productCategory, // Enviar directamente como está
            }),
        });

        if (!response.ok) {
            const errorData = await response.text(); // Capturar error del backend
            throw new Error(errorData);
        }

        alert('Producto actualizado correctamente');
        closeModal('editProductModal');
        fetchProductos(); // Refrescar la lista de productos
    } catch (err) {
        console.error('Error al actualizar producto:', err.message);
        alert('Error al actualizar producto.');
    }
}

// Eliminar producto del backend
async function deleteProduct(idProducto) {
    try {
        const response = await fetch(`${BASE_URL}/productos/${idProducto}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar producto');
        alert('Producto eliminado correctamente');
        fetchProductos();
    } catch (err) {
        console.error('Error al eliminar producto:', err.message);
    }
}

function filterProducts() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const categoryValue = document.getElementById('category-filter').value;

    const filteredProducts = productos.filter(product => {
        const matchesCategory = !categoryValue || product.id_categoria === categoryValue;
        const matchesSearch = product.nombre.toLowerCase().includes(searchValue);
        return matchesCategory && matchesSearch;
    });

    displayProducts(filteredProducts); // Muestra solo los productos filtrados
}


// Cargar productos al iniciar
fetchProductos();

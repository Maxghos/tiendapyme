// **Función para alternar el menú lateral**
// Muestra u oculta el menú lateral al ajustar su ancho.
function toggleMenu() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "250px";
    }
}

//FUNCION ADICIONAAAAAAAAAAAAAAAAAAAAAAAL
//ESTO ES PARA MANTENER CARRITO TODAS LAS PAGS OBLIGATORI
//------------------------------------------------------------------------------------------------------------

function updateCartQuantity(quantity) {
    const cartButton = document.querySelector(".btn-cart");
    if (cartButton) {
        cartButton.setAttribute("data-quantity", quantity);
        cartButton.querySelector(".quantity").textContent = quantity;
    } else {
        console.warn("Botón del carrito no encontrado");
    }
}






//-------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
// **FUNCIÓN PARA VENTANA EMERGENTE DE SESIÓN**

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM necesarios
    const modal = document.getElementById('user-modal'); // Ventana modal
    const openModalBtn = document.getElementById('open-modal-btn'); // Botón para abrir la ventana modal
    const closeModalBtn = document.getElementById('close-modal-btn'); // Botón para cerrar la ventana modal
    const authBtn = document.getElementById('auth-btn'); // Botón de inicio/cierre de sesión
    const accountConfigBtn = document.getElementById('account-config-btn'); // Botón para configuración de cuenta
    
    let isAuthenticated = false; // Estado de autenticación del usuario

    // Función para actualizar el estado del botón de autenticación
    function updateAuthButton() {
        if (authBtn) { // Verifica que el botón exista
            if (isAuthenticated) {
                // Si el usuario está autenticado
                authBtn.textContent = 'Cerrar Sesión';
                authBtn.onclick = () => {
                    isAuthenticated = false;
                    updateAuthButton();
                    alert('Sesión cerrada'); // Acciones adicionales para cierre de sesión
                };

                // Habilitar botón de configuración de cuenta
                accountConfigBtn.disabled = false;
                accountConfigBtn.onclick = () => {
                    window.location.href = 'config_cuenta.html'; // Redirección a configuración
                };

            } else {
                // Si el usuario NO está autenticado
                authBtn.textContent = 'Iniciar Sesión';
                authBtn.onclick = () => {
                    window.location.href = '../Cuenta InicioSesion/IniciarSes.html'; // Redirección a página de inicio de sesión
                    isAuthenticated = true;
                    updateAuthButton();
                };

                // Deshabilitar botón de configuración de cuenta
                accountConfigBtn.disabled = true;
                accountConfigBtn.onclick = null; // Remueve la acción del botón
            }
        } else {
            console.error("El botón 'auth-btn' no existe.");
        }
    }

    // Función para abrir la ventana modal
    openModalBtn.onclick = function() {
        modal.style.display = 'flex';
        updateAuthButton();
    };

    // Función para cerrar la ventana modal
    closeModalBtn.onclick = function() {
        modal.style.display = 'none';
    };

    // Cierra el modal cuando se hace clic fuera de él
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Inicializa el estado del botón de autenticación
    updateAuthButton();
});

// **FINAL FUNCIÓN PARA VENTANA EMERGENTE DE SESIÓN**
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------

// Función para alternar el menú lateral del carrito
function toggleCartMenu() {
    const cartSidebar = document.getElementById("cart-sidebar");
    if (cartSidebar) {
        cartSidebar.style.width = cartSidebar.style.width === "300px" ? "0" : "300px";
    }
}

//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------

// Inicializa el carrito desde `localStorage` o crea uno vacío si no existe
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let selectedTalla = ''; // Variable global para la talla seleccionada

// Función para actualizar el localStorage cada vez que el carrito cambie
function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Función para capturar la talla seleccionada
function selectTalla(talla) {
    selectedTalla = talla;
    const tallaButtons = document.querySelectorAll('.talla');
    tallaButtons.forEach(button => button.classList.remove('selected'));
    event.target.classList.add('selected');
}

// Función para añadir un producto al carrito
function addToCart() {
    const productName = document.querySelector('.product-details h1').textContent;
    const productPrice = document.querySelector('.price').textContent;
    const productImage = document.getElementById('imagen-principal').src;
    const productQuantity = parseInt(document.getElementById('cantidad').value, 10);

    const product = {
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: productQuantity,
        talla: selectedTalla || 'Sin talla',
    };

    cartItems.push(product);

    // Guarda el carrito actualizado en localStorage
    saveCart();

    // Actualiza la interfaz del carrito
    renderCartItems();
    updateCartQuantity(cartItems.length);
}

// Función para renderizar los productos en el menú lateral del carrito
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Limpia el contenedor antes de actualizar

    cartItems.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" style="width:50px; height:50px;">
            <div class="cart-item-details">
                <p>${item.name}</p>
                <p>${item.price}</p>
                <p>Talla: ${item.talla}</p>
                <p>Cantidad: ${item.quantity}</p>
            </div>
            <button class="remove-btn" onclick="removeCartItem(${index})">Eliminar</button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    updateCartTotal();
}

// Función para actualizar la cantidad total de productos en el icono del carrito
function updateCartQuantity(quantity) {
    const cartButton = document.querySelector(".btn-cart");
    if (cartButton) {
        cartButton.setAttribute("data-quantity", quantity);
        cartButton.querySelector(".quantity").textContent = quantity;
    }
}

// Función para actualizar el total del carrito
function updateCartTotal() {
    const cartTotalElement = document.getElementById('cart-total');
    const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.price.replace('$', '')) * item.quantity), 0);
    if (cartTotalElement) {
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }
}

// Función para eliminar un producto del carrito
function removeCartItem(index) {
    cartItems.splice(index, 1); // Elimina el producto del arreglo
    saveCart(); // Guarda el carrito actualizado en localStorage
    renderCartItems(); // Vuelve a renderizar los productos
    updateCartQuantity(cartItems.length); // Actualiza el número de productos en el icono del carrito
}

// Función para restaurar el carrito al cargar cada página
document.addEventListener('DOMContentLoaded', function() {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        renderCartItems();
        updateCartQuantity(cartItems.length);
    }
});

// Función para ir a la página de pago y almacenar los datos del carrito en localStorage
function goToCheckout() {
    saveCart(); // Asegura que los datos del carrito están actualizados antes de ir a la página de pago
    window.location.href = "../CompraOficial/Compra1/compra1.html"; // <<-- Página de pago simulada
}

// Escucha para el botón "Agregar Al Carrito"
const addToCartButton = document.querySelector('.add-to-cart');
if (addToCartButton) {
    addToCartButton.addEventListener('click', addToCart);
}




//-------------------------------------------------------------------------------------------------------------------------------------
//SOLO PARA WEAS DE COMPRAS PARA PAGAS ATENTOOOOOOOOOOOOO
/* Lista de productos en el catálogo
const productos = [
    { id: 'A1023', nombre: 'Falda Short Tela Sofia', precio: 6000, stock: 6, imagen: '../imagenesGeneralPrendaInf/faldas mujer modelar.jpg', miniaturas: ['../imagenesGeneralPrendaInf/faldas mujer modelar.jpg', '../imagenesGeneralPrendaInf/faldas mujer modelar.jpg'] , descripcion: 'Falda corta y ligera, ideal para el verano.' },
    { id: 'A10288', nombre: 'Falda Señora', precio: 8000, stock: 5, imagen: '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg', miniaturas: ['../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg', '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg'] , descripcion: 'Falda elegante y clásica, para ocasiones formales.' },
    { id: 'A1024', nombre: 'Falda Short Gamusa', precio: 8000, stock: 4, imagen: '../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg', miniaturas: ['../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg', '../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg'] , descripcion: 'Falda corta de gamuza suave y moderna.' },
    { id: 'A1025', nombre: 'Calza-Short', precio: 3500, stock: 3, imagen: '../imagenesGeneralPrendaInf/faldas mujer modelar.jpg', miniaturas: ['../imagenesGeneralPrendaInf/faldas mujer modelar.jpg', '../imagenesGeneralPrendaInf/faldas mujer modelar.jpg'] , descripcion: 'Combinación práctica de calza y short deportivo.' },
    { id: 'A1026', nombre: 'Calza Estandar', precio: 5000, stock: 6, imagen: '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg', miniaturas: ['../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg', '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg'] , descripcion: 'Calza ajustada, cómoda y de uso diario.' },
    { id: 'A1027', nombre: 'Calza Extra-Linda', precio: 5900, stock: 5, imagen: '../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg' , miniaturas: ['../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg', '../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg'] , descripcion: 'Calza con detalles decorativos y estilo femenino.' },
    { id: 'A1028', nombre: 'Calza Dupont', precio: 5000, stock: 3, imagen: '../imagenesGeneralPrendaInf/faldas mujer modelar.jpg', miniaturas: ['../imagenesGeneralPrendaInf/faldas mujer modelar.jpg', '../imagenesGeneralPrendaInf/faldas mujer modelar.jpg'] , descripcion: 'Calza resistente, de material durable y cómodo.' },
    { id: 'A1029', nombre: 'Pantys Extra-Linda', precio: 2000, stock: 2, imagen: '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg' , miniaturas: ['../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg', '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg'] , descripcion: 'Pantys diseñados para tallas grandes, realzan la figura.' },
    { id: 'A1030', nombre: 'Pantys Medio-Pantalón', precio: 1500, stock: 7, imagen: '../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg', miniaturas: ['../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg', '../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg'] , descripcion: 'Pantys que cubren media pierna, cómodos y prácticos.' },
];*/

const productos = [
    { 
        id: 'A1023', 
        nombre: 'Falda Short Tela Sofia', 
        precio: 6000, 
        stock: 10, 
        imagen: '../imagenesGeneralPrendaInf/faldas mujer modelar.jpg', 
        miniaturas: ['../imagenesGeneralPrendaInf/faldas mujer modelar.jpg', '../imagenesGeneralPrendaInf/faldas mujer modelar.jpg'], 
        descripcion: 'Falda corta y ligera, ideal para el verano.', 
        tallas: ['M', 'L', 'XL', 'XXL'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A10288', 
        nombre: 'Falda Señora', 
        precio: 8000, 
        stock: 10, 
        imagen: '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg', 
        miniaturas: ['../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg', '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg'], 
        descripcion: 'Falda elegante y clásica, para ocasiones formales.', 
        tallas: ['L', 'XL'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1024', 
        nombre: 'Falda Short Gamusa', 
        precio: 8000, 
        stock: 10, 
        imagen: '../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg', 
        miniaturas: ['../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg', '../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg'], 
        descripcion: 'Falda corta de gamuza suave y moderna.', 
        tallas: ['M', 'L', 'XL', 'XXL'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1025', 
        nombre: 'Calza-Short', 
        precio: 3500, 
        stock: 10, 
        imagen: '../imagenesGeneralPrendaInf/faldas mujer modelar.jpg', 
        miniaturas: ['../imagenesGeneralPrendaInf/faldas mujer modelar.jpg', '../imagenesGeneralPrendaInf/faldas mujer modelar.jpg'], 
        descripcion: 'Combinación práctica de calza y short deportivo.', 
        tallas: ['L', 'XL', 'XXL'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1026', 
        nombre: 'Calza Estandar', 
        precio: 5000, 
        stock: 10, 
        imagen: '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg', 
        miniaturas: ['../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg', '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg'], 
        descripcion: 'Calza ajustada, cómoda y de uso diario.', 
        tallas: ['L'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1027', 
        nombre: 'Calza Extra-Linda', 
        precio: 5900, 
        stock: 10, 
        imagen: '../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg', 
        miniaturas: ['../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg', '../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg'], 
        descripcion: 'Calza con detalles decorativos y estilo femenino.', 
        tallas: ['XL', 'XXL'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1028', 
        nombre: 'Calza Dupont', 
        precio: 5000, 
        stock: 10, 
        imagen: '../imagenesGeneralPrendaInf/faldas mujer modelar.jpg', 
        miniaturas: ['../imagenesGeneralPrendaInf/faldas mujer modelar.jpg', '../imagenesGeneralPrendaInf/faldas mujer modelar.jpg'], 
        descripcion: 'Calza resistente, de material durable y cómodo.', 
        tallas: ['L', 'XL', 'XXL'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1029', 
        nombre: 'Pantys Extra-Linda', 
        precio: 2000, 
        stock: 10, 
        imagen: '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg', 
        miniaturas: ['../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg', '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg'], 
        descripcion: 'Pantys diseñados para tallas grandes, realzan la figura.', 
        tallas: ['XXL'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1030', 
        nombre: 'Pantys Medio-Pantalón', 
        precio: 1500, 
        stock: 10, 
        imagen: '../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg', 
        miniaturas: ['../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg', '../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg'], 
        descripcion: 'Pantys que cubren media pierna, cómodos y prácticos.', 
        tallas: ['M'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
];



// Agrega evento de clic a cada producto del catálogo
document.querySelectorAll('.producto-link').forEach(link => {
    link.addEventListener('click', function() {
        const index = parseInt(link.getAttribute('data-index'), 10);
        const productoSeleccionado = productos[index - 1]; // Ajusta el índice según el arreglo (si empieza en 0)

        if (productoSeleccionado) {
            localStorage.setItem('productoSeleccionado', JSON.stringify(productoSeleccionado));
        } else {
            console.error(`Producto no encontrado en el índice: ${index}`);
        }
    });
});


//FUNCION ADICIONAAAAAAAAAAAAAAAAAAAAAAAL
//------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
        cartItems = JSON.parse(savedCart); // Restaura el carrito guardado
        renderCartItems(); // Renderiza el carrito en la interfaz
        updateCartQuantity(cartItems.length);
    }
});

//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------


// Función para obtener el stock de un producto desde el backend
async function fetchStock(codigo) {
    try {
        const response = await fetch(`https://tiendapyme-production.up.railway.app/api/productos/${codigo}`);
        if (!response.ok) {
            throw new Error('Error al obtener el stock del producto');
        }
        const data = await response.json();
        return data.stock; // Devuelve el stock obtenido
    } catch (error) {
        console.error(`Error al obtener el stock para el código ${codigo}:`, error.message);
        return 'Error'; // Retorna "Error" si ocurre algún problema
    }
}

// Función para obtener el precio de un producto desde el backend
async function fetchPrecio(codigo) {
    try {
        const response = await fetch(`https://tiendapyme-production.up.railway.app/api/precio/${codigo}`);
        if (!response.ok) {
            throw new Error('Error al obtener el precio del producto');
        }
        const data = await response.json();
        return data.precio; // Devuelve el precio obtenido
    } catch (error) {
        console.error(`Error al obtener el precio para el código ${codigo}:`, error.message);
        return 'Error'; // Retorna "Error" si ocurre algún problema
    }
}


// Función para actualizar el stock y precio en los elementos del catálogo
async function updateCatalogData() {
    const productos = document.querySelectorAll('.producto'); // Encuentra todos los productos en el catálogo

    productos.forEach(async (producto) => {
        const codigo = producto.getAttribute('data-codigo'); // Obtiene el código del producto
        const stockElement = producto.querySelector('.stock'); // Elemento donde se muestra el stock
        const precioElement = producto.querySelector('.price'); // Elemento donde se muestra el precio

        // Asegúrate de que el elemento exista antes de actualizar
        if (codigo) {
            if (stockElement) {
                const stock = await fetchStock(codigo);
                stockElement.textContent = stock !== 'Error' ? stock : 'Error';
            } else {
                console.warn(`Elemento '.stock' no encontrado para el producto con código: ${codigo}`);
            }

            if (precioElement) {
                const precio = await fetchPrecio(codigo);
                precioElement.textContent = precio !== 'Error' ? `$${precio}` : 'Error';
            } else {
                console.warn(`Elemento '.price' no encontrado para el producto con código: ${codigo}`);
            }
        } else {
            console.warn(`Código no encontrado para un producto en el catálogo.`);
        }
    });
}

// Llama a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', updateCatalogData);

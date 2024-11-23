    // Función para alternar el menú lateral
    function toggleMenu() {
        var sidebar = document.getElementById("sidebar");
        if (sidebar.style.width === "250px") {
            sidebar.style.width = "0";
        } else {
            sidebar.style.width = "250px";
        }
    }
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


document.addEventListener('DOMContentLoaded', function() {
    // **Carrusel de la galería principal**
    var images = [
        '../imagenesGeneral/Moda Mujer Modelar (1).jpg',
        '../imagenesGeneral/Moda Mujer Modelar (1).jpg',
        '../imagenesGeneral/Moda Mujer Modelar (2).jpg',
        '../imagenesGeneral/Moda Mujer Modelar.jpg',
    ];

    var mainImage = document.getElementById('imagen-principal');
    var prevButtonGallery = document.getElementById('prev'); 
    var nextButtonGallery = document.getElementById('next'); 
    var thumbnails = document.querySelectorAll('.product-thumbnails img');
    var tallaButtons = document.querySelectorAll('.talla');
    var colorButtons = document.querySelectorAll('.color');

    var currentIndexGallery = 0;

    function updateImage(index) {
        mainImage.style.opacity = 0;
        setTimeout(() => {
            mainImage.src = images[index];
            mainImage.style.opacity = 1;
        }, 200);
    }

    function prevImage() {
        currentIndexGallery = (currentIndexGallery === 0) ? images.length - 1 : currentIndexGallery - 1;
        updateImage(currentIndexGallery);
    }

    function nextImage() {
        currentIndexGallery = (currentIndexGallery === images.length - 1) ? 0 : currentIndexGallery + 1;
        updateImage(currentIndexGallery);
    }

    prevButtonGallery.addEventListener('click', prevImage);
    nextButtonGallery.addEventListener('click', nextImage);

    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function() {
            currentIndexGallery = index;
            updateImage(currentIndexGallery);
        });
    });

    tallaButtons.forEach(button => {
        button.addEventListener('click', function() {
            tallaButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            colorButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    const decreaseButton = document.getElementById('decrease');
    const increaseButton = document.getElementById('increase');
    const cantidadInput = document.getElementById('cantidad');

    decreaseButton.addEventListener('click', () => {
        let currentValue = parseInt(cantidadInput.value, 10);
        if (currentValue > 1) {
            cantidadInput.value = currentValue - 1;
        }
    });

    increaseButton.addEventListener('click', () => {
        let currentValue = parseInt(cantidadInput.value, 10);
        cantidadInput.value = currentValue + 1;
    });

    //----------------------------------------------------------------------
    // **Carrusel de Productos Destacados**
    const carouselPrevButton = document.querySelector('.carousel-prev');
    const carouselNextButton = document.querySelector('.carousel-next');
    const carousel = document.querySelector('.carousel');
    let carouselIndex = 0;

    // Número máximo de productos visibles antes de que se detenga el carrusel
    const maxCarouselIndex = Math.ceil((carousel.children.length / 3) - 1); // Ajusta el 3 si cambia el número de productos visibles

    if (carouselPrevButton && carouselNextButton && carousel) {
        carouselPrevButton.addEventListener('click', () => {
            if (carouselIndex > 0) {
                carouselIndex--;
                updateCarousel();
            }
        });

        carouselNextButton.addEventListener('click', () => {
            if (carouselIndex < maxCarouselIndex) { // Se detiene en el último grupo de productos
                carouselIndex++;
                updateCarousel();
            }
        });

        function updateCarousel() {
            const offset = carouselIndex * -100;
            carousel.style.transform = `translateX(${offset}%)`;
        }
    } else {
        console.warn('Elementos del carrusel no encontrados. Revisa los selectores de clase.');
    }
    //----------------------------------------------------------------------
    
});
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
// Solo añade el evento si el botón "Agregar al carrito" existe en la página
const addToCartButton = document.querySelector('.add-to-cart');
if (addToCartButton) {
    addToCartButton.addEventListener('click', addToCart);
}


// Función para alternar el menú lateral del carrito
function toggleCartMenu() {
    var cartSidebar = document.getElementById("cart-sidebar");
    if (cartSidebar.style.width === "300px") {
        cartSidebar.style.width = "0";
    } else {
        cartSidebar.style.width = "300px";
    }
}

// Ejemplo de cómo actualizar el número de productos
function updateCartQuantity(quantity) {
    const cartButton = document.querySelector(".btn-cart");
    cartButton.setAttribute("data-quantity", quantity);
    cartButton.querySelector(".quantity").textContent = quantity;
}
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
// Arreglo para almacenar los productos del carrito
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let selectedTalla = ''; // Variable global para almacenar la talla seleccionada

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

    // Crea un objeto para el producto con la talla seleccionada
    const product = {
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: productQuantity,
        talla: selectedTalla || 'Sin talla'
    };

    // Añade el producto al arreglo cartItems
    cartItems.push(product);

    // Guarda el carrito en localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Actualiza el carrito en la interfaz
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
    cartButton.setAttribute("data-quantity", quantity);
    cartButton.querySelector(".quantity").textContent = quantity;
}

// Función para actualizar el total del carrito
function updateCartTotal() {
    const cartTotalElement = document.getElementById('cart-total');
    const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.price.replace('$', '')) * item.quantity), 0);
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

// Función para eliminar un producto del carrito
function removeCartItem(index) {
    cartItems.splice(index, 1); // Elimina el producto del arreglo
    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Actualiza el localStorage
    renderCartItems(); // Vuelve a renderizar los productos
    updateCartQuantity(cartItems.length); // Actualiza el número de productos en el icono del carrito
}

// Función para ir a la página de pago
function goToCheckout() {
    window.location.href = "../CompraOficial/Compra1/compra1.html"; // <<-- Página de pago
}



// Escucha para el botón "Agregar Al Carrito"
document.querySelector('.add-to-cart').addEventListener('click', addToCart);


//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------
// Recupera el producto seleccionado desde localStorage
const productoSeleccionadoJSON = localStorage.getItem('productoSeleccionado');
const productoSeleccionado = productoSeleccionadoJSON ? JSON.parse(productoSeleccionadoJSON) : null;

if (productoSeleccionado) {
    // Asigna los detalles del producto seleccionado
    document.querySelector('.product-details h1').textContent = productoSeleccionado.nombre;
    document.querySelector('.price').textContent = `$${productoSeleccionado.precio}`;
    document.getElementById('imagen-principal').src = productoSeleccionado.imagen;
    document.getElementById('product-stock').textContent = productoSeleccionado.stock;
    document.getElementById('product-code').textContent = productoSeleccionado.id;
    document.querySelector('.description p').textContent = productoSeleccionado.descripcion || "Descripción no disponible"; // Añadir aquí la descripción

    // Limpiar las miniaturas anteriores
    const miniaturasContainer = document.querySelector('.product-thumbnails');
    miniaturasContainer.innerHTML = ''; // Limpia cualquier contenido anterior en las miniaturas

    // Crear un arreglo de imágenes para el carrusel, incluyendo la imagen principal y miniaturas
    const images = [productoSeleccionado.imagen, ...productoSeleccionado.miniaturas];
    let currentIndexGallery = 0;

    // Cargar y mostrar las miniaturas del producto seleccionado
    images.forEach((miniatura, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = miniatura;
        imgElement.alt = `Miniatura de ${productoSeleccionado.nombre}`;
        
        // Evento para cambiar la imagen principal al hacer clic en la miniatura
        imgElement.addEventListener('click', () => {
            document.getElementById('imagen-principal').src = miniatura;
            currentIndexGallery = index; // Actualiza el índice actual
        });
        
        miniaturasContainer.appendChild(imgElement);
    });

    // Función para actualizar la imagen principal con transición
    function updateImage(index) {
        document.getElementById('imagen-principal').style.opacity = 0;
        setTimeout(() => {
            document.getElementById('imagen-principal').src = images[index];
            document.getElementById('imagen-principal').style.opacity = 1;
        }, 200);
    }

    // Funciones para cambiar la imagen principal con los botones de navegación
    document.getElementById('prev').addEventListener('click', () => {
        currentIndexGallery = (currentIndexGallery === 0) ? images.length - 1 : currentIndexGallery - 1;
        updateImage(currentIndexGallery);
    });

    document.getElementById('next').addEventListener('click', () => {
        currentIndexGallery = (currentIndexGallery === images.length - 1) ? 0 : currentIndexGallery + 1;
        updateImage(currentIndexGallery);
    });
    
} else {
    console.warn("No se ha seleccionado ningún producto para mostrar en la página de compra.");
}
// Actualiza el stock en tiempo real cuando el usuario agrega productos al carrito
document.querySelector('.add-to-cart').addEventListener('click', function () {
    if (productoSeleccionado) {
        const cantidadSeleccionada = parseInt(document.getElementById('cantidad').value, 10);

        if (productoSeleccionado.stock >= cantidadSeleccionada) {
            productoSeleccionado.stock -= cantidadSeleccionada;
            localStorage.setItem('productoSeleccionado', JSON.stringify(productoSeleccionado));
            document.getElementById('product-stock').textContent = `Stock disponible: ${productoSeleccionado.stock}`;
        } else {
            alert('No hay suficiente stock para la cantidad seleccionada');
        }
    } else {
        alert("No se ha seleccionado un producto válido.");
    }
});

// Función adicional para restaurar el carrito
document.addEventListener('DOMContentLoaded', function() {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
        cartItems = JSON.parse(savedCart) || []; // Restaura el carrito guardado o inicia con un array vacío
        if (typeof renderCartItems === 'function') renderCartItems(); // Asegura que renderCartItems existe
        if (typeof updateCartQuantity === 'function') updateCartQuantity(cartItems.length); // Asegura que updateCartQuantity existe
    }
});

//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------


if (productoSeleccionado) {
    // Asigna los detalles del producto seleccionado
    document.querySelector('.product-details h1').textContent = productoSeleccionado.nombre;
    document.querySelector('.price').textContent = `$${productoSeleccionado.precio}`;
    document.getElementById('imagen-principal').src = productoSeleccionado.imagen;
    document.getElementById('product-stock').textContent = productoSeleccionado.stock;
    document.getElementById('product-code').textContent = productoSeleccionado.id;
    document.querySelector('.description p').textContent = productoSeleccionado.descripcion || "Descripción no disponible";

    // Habilitar solo las tallas específicas del producto seleccionado
    const tallaButtons = document.querySelectorAll('.talla');
    tallaButtons.forEach(button => {
        button.disabled = !productoSeleccionado.tallas.includes(button.textContent); // Habilitar/deshabilitar según disponibilidad
        button.style.opacity = productoSeleccionado.tallas.includes(button.textContent) ? '1' : '0.5'; // Visualmente bloqueado
    });

    // Habilitar solo los colores específicos del producto seleccionado
    const colorButtons = document.querySelectorAll('.color');
    colorButtons.forEach(button => {
        const colorValue = button.getAttribute('data-color'); // Obtener el color desde el atributo data-color
        const isAvailable = productoSeleccionado.colores.includes(colorValue);
        button.style.opacity = isAvailable ? '1' : '0.5'; // Visualmente bloqueado si no está disponible
        button.style.pointerEvents = isAvailable ? 'auto' : 'none'; // Deshabilitar interacción si no está disponible
    });

    // Limpiar las miniaturas anteriores
    const miniaturasContainer = document.querySelector('.product-thumbnails');
    miniaturasContainer.innerHTML = ''; // Limpia cualquier contenido anterior en las miniaturas

    // Crear un arreglo de imágenes para el carrusel, incluyendo la imagen principal y miniaturas
    const images = [productoSeleccionado.imagen, ...productoSeleccionado.miniaturas];
    let currentIndexGallery = 0;

    // Cargar y mostrar las miniaturas del producto seleccionado
    images.forEach((miniatura, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = miniatura;
        imgElement.alt = `Miniatura de ${productoSeleccionado.nombre}`;
        
        // Evento para cambiar la imagen principal al hacer clic en la miniatura
        imgElement.addEventListener('click', () => {
            document.getElementById('imagen-principal').src = miniatura;
            currentIndexGallery = index; // Actualiza el índice actual
        });
        
        miniaturasContainer.appendChild(imgElement);
    });

    // Función para actualizar la imagen principal con transición
    function updateImage(index) {
        document.getElementById('imagen-principal').style.opacity = 0;
        setTimeout(() => {
            document.getElementById('imagen-principal').src = images[index];
            document.getElementById('imagen-principal').style.opacity = 1;
        }, 200);
    }

    // Funciones para cambiar la imagen principal con los botones de navegación
    document.getElementById('prev').addEventListener('click', () => {
        currentIndexGallery = (currentIndexGallery === 0) ? images.length - 1 : currentIndexGallery - 1;
        updateImage(currentIndexGallery);
    });

    document.getElementById('next').addEventListener('click', () => {
        currentIndexGallery = (currentIndexGallery === images.length - 1) ? 0 : currentIndexGallery + 1;
        updateImage(currentIndexGallery);
    });

} else {
    console.warn("No se ha seleccionado ningún producto para mostrar en la página de compra.");
}


















const productosDestacados = [
    { 
        id: 'A1038', 
        nombre: 'Poleras Mujer', 
        precio: 5900, 
        stock: 15, 
        imagen: '../imagenesGeneralSuperior/poleras holgada mujer ancha modelar (2).jpg', 
        miniaturas: ['../imagenesGeneralSuperior/poleras holgada mujer ancha modelar (2).jpg', '../imagenesGeneralSuperior/poleras holgada mujer ancha modelar (2).jpg'], 
        descripcion: 'Camisetas de diversos estilos, cómodas y versátiles para el uso diario de mujeres.', 
        tallas: ['L', 'XL'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1036', 
        nombre: 'Peto De Pavílo', 
        precio: 2000, 
        stock: 20, 
        imagen: '../imagenesGeneralSuperior/faldas mujer modelar (1).jpg', 
        miniaturas: ['../imagenesGeneralSuperior/faldas mujer modelar (1).jpg', '../imagenesGeneralSuperior/faldas mujer modelar (1).jpg'], 
        descripcion: 'Prenda sin mangas, ideal para actividades informales o deportivas, cómoda y resistente.', 
        tallas: ['M'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1031', 
        nombre: 'Calcetas Normales', 
        precio: 1500, 
        stock: 20, 
        imagen: '../imagenesGeneralCalcetas/oferta ropa mujer (1).jpg', 
        miniaturas: ['../imagenesGeneralCalcetas/oferta ropa mujer (1).jpg', '../imagenesGeneralCalcetas/oferta ropa mujer (1).jpg'], 
        descripcion: 'Son calcetines que cubren el pie hasta la mitad de la pantorrilla.', 
        tallas: ['M'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1017', 
        nombre: 'Calzón Nora', 
        precio: 2000, 
        stock: 20, 
        imagen: '../imagenesGeneral/Moda Mujer Modelar (2).jpg', 
        miniaturas: ['../imagenesGeneral/Moda Mujer Modelar (2).jpg', '../imagenesGeneral/Moda Mujer Modelar (2).jpg'], 
        descripcion: 'Calzón cómodo y sencillo.', 
        tallas: ['M', 'L', 'XL'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1005', 
        nombre: 'Calzon Extra Linda', 
        precio: 2500, 
        stock: 6, 
        imagen: '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg', 
        miniaturas: ['../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg', '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg'], 
        descripcion: 'Calzón diseñado para tallas grandes, con detalles que realzan la figura.', 
        tallas: ['XXXL', 'XXXXL', 'XXXXXL', 'XXXXXXL'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1018', 
        nombre: 'Calzón Con Encaje', 
        precio: 2000, 
        stock: 5, 
        imagen: '../imagenesGeneral/Moda Mujer Modelar (2).jpg', 
        miniaturas: ['../imagenesGeneral/Moda Mujer Modelar (2).jpg', '../imagenesGeneral/Moda Mujer Modelar (2).jpg'], 
        descripcion: 'Calzón decorado con encaje, ideal para ocasiones especiales.', 
        tallas: ['XXL', 'XXXL', 'XXXXL'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1002', 
        nombre: 'Calzon Cuadro', 
        precio: 2000, 
        stock: 10, 
        imagen: '../imagenesGeneral/Moda Mujer Modelar.jpg', 
        miniaturas: ['../imagenesGeneral/Moda Mujer Modelar.jpg', '../imagenesGeneral/Moda Mujer Modelar.jpg'], 
        descripcion: 'Calzón de corte recto y cómodo, ideal para el día a día.', 
        tallas: ['L', 'XL'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1033', 
        nombre: 'Calceta Corta', 
        precio: 2000, 
        stock: 20, 
        imagen: '../imagenesGeneralCalcetas/oferta ropa mujer (3).jpg', 
        miniaturas: ['../imagenesGeneralCalcetas/oferta ropa mujer (3).jpg', '../imagenesGeneralCalcetas/oferta ropa mujer (3).jpg'], 
        descripcion: 'Calcetines que llegan justo debajo del tobillo.', 
        tallas: ['M'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
];


//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------



// **Eventos de clic para productos en "Lo más destacado"**
document.querySelectorAll('.productos-destacados .producto-link').forEach((link, index) => {
    link.addEventListener('click', function() {
        const productoSeleccionado = productosDestacados[index]; // Asegúrate de tener un array `productosDestacados`

        if (productoSeleccionado) {
            localStorage.setItem('productoSeleccionado', JSON.stringify(productoSeleccionado));
        } else {
            console.error(`Producto no encontrado en el índice destacado: ${index}`);
        }
    });
});



document.addEventListener('DOMContentLoaded', async () => {
    // Recupera el producto seleccionado desde el localStorage
    const productoSeleccionadoJSON = localStorage.getItem('productoSeleccionado');
    const productoSeleccionado = productoSeleccionadoJSON ? JSON.parse(productoSeleccionadoJSON) : null;

    if (productoSeleccionado && productoSeleccionado.id) {
        try {
            // Solicita el stock del producto al backend
            const stockResponse = await fetch(`https://tiendapyme-production.up.railway.app/api/productos/${productoSeleccionado.id}`);
            if (!stockResponse.ok) {
                throw new Error('Error al obtener el stock del producto desde la base de datos');
            }
            const stockData = await stockResponse.json();

            // Solicita el precio del producto al backend
            const precioResponse = await fetch(`https://tiendapyme-production.up.railway.app/api/precio/${productoSeleccionado.id}`);
            if (!precioResponse.ok) {
                throw new Error('Error al obtener el precio del producto desde la base de datos');
            }
            const precioData = await precioResponse.json();

            // Solicita el nombre del producto al backend
            const nombreResponse = await fetch(`https://tiendapyme-production.up.railway.app/api/nombre/${productoSeleccionado.id}`);
            if (!nombreResponse.ok) {
                throw new Error('Error al obtener el nombre del producto desde la base de datos');
            }
            const nombreData = await nombreResponse.json();

            // Actualiza el stock, el precio y el nombre en la página
            document.getElementById('product-stock').textContent = stockData.stock;
            document.querySelector('.price').textContent = `$${precioData.precio}`;
            document.querySelector('.product-details h1').textContent = nombreData.nombre;

        } catch (error) {
            console.error('Error al cargar los datos del producto:', error.message);

            // Si hay un error, muestra "Error" en lugar de los datos
            document.getElementById('product-stock').textContent = 'Error';
            document.querySelector('.price').textContent = 'Error';
            document.querySelector('.product-details h1').textContent = 'Error';
        }
    } else {
        console.warn('No se encontró un producto seleccionado o un código válido.');
    }
});


//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------


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

// **Nueva función para obtener el nombre de un producto desde el backend**
async function fetchNombre(codigo) {
    try {
        const response = await fetch(`https://tiendapyme-production.up.railway.app/api/nombre/${codigo}`);
        if (!response.ok) {
            throw new Error('Error al obtener el nombre del producto');
        }
        const data = await response.json();
        return data.nombre; // Devuelve el nombre obtenido
    } catch (error) {
        console.error(`Error al obtener el nombre para el código ${codigo}:`, error.message);
        return 'Error'; // Retorna "Error" si ocurre algún problema
    }
}

// Función para actualizar el stock, precio y nombre en los elementos del catálogo
async function updateCatalogData() {
    const productos = document.querySelectorAll('.producto'); // Encuentra todos los productos en el catálogo

    productos.forEach(async (producto) => {
        const codigo = producto.getAttribute('data-codigo'); // Obtiene el código del producto
        const stockElement = producto.querySelector('.stock'); // Elemento donde se muestra el stock
        const precioElement = producto.querySelector('.price'); // Elemento donde se muestra el precio
        const nombreElement = producto.querySelector('.nombre'); // Elemento donde se muestra el nombre

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

            if (nombreElement) {
                const nombre = await fetchNombre(codigo);
                nombreElement.textContent = nombre !== 'Error' ? nombre : 'Error';
            } else {
                console.warn(`Elemento '.nombre' no encontrado para el producto con código: ${codigo}`);
            }
        } else {
            console.warn(`Código no encontrado para un producto en el catálogo.`);
        }
    });
}

// Llama a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', updateCatalogData);

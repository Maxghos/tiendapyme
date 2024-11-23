// **Función para alternar el menú lateral**
function toggleMenu() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar && sidebar.style.width === "250px") {
        sidebar.style.width = "0";
    } else if (sidebar) {
        sidebar.style.width = "250px";
    }
}

//--------------------------------------------------------------------------------------------------------------------------------------

// **Controles de Carrusel - Sección Original**
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const carousel = document.querySelector('.carousel');
let currentIndex = 0;

if (prevButton && nextButton && carousel) {
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < 2) {
            currentIndex++;
            updateCarousel();
        }
    });
}

//--------------------------------------------------------------------------------------------------------------------------------------

// **Función para actualizar el carrusel de la sección original**
function updateCarousel() {
    const offset = currentIndex * -100;
    if (carousel) {
        carousel.style.transform = `translateX(${offset}%)`;
    }
}

//--------------------------------------------------------------------------------------------------------------------------------------

// **Controles de Carrusel - Sección "Lo Más Visto"**
const prevButtonVisto = document.querySelector('.prev-visto');
const nextButtonVisto = document.querySelector('.next-visto');
const carouselVisto = document.querySelector('.carousel-visto');
let currentIndexVisto = 0;

if (prevButtonVisto && nextButtonVisto && carouselVisto) {
    prevButtonVisto.addEventListener('click', () => {
        if (currentIndexVisto > 0) {
            currentIndexVisto--;
            updateCarouselVisto();
        }
    });

    nextButtonVisto.addEventListener('click', () => {
        if (currentIndexVisto < 2) {
            currentIndexVisto++;
            updateCarouselVisto();
        }
    });
}

//--------------------------------------------------------------------------------------------------------------------------------------

function updateCarouselVisto() {
    const offsetVisto = currentIndexVisto * -100;
    if (carouselVisto) {
        carouselVisto.style.transform = `translateX(${offsetVisto}%)`;
    }
}

//--------------------------------------------------------------------------------------------------------------------------------------

// JavaScript para manejar el cambio de imágenes al pasar el mouse
document.querySelectorAll('.imagen-con-texto').forEach(container => {
    let images = container.getAttribute('data-images').split(',');
    let imgElement = container.querySelector('img');
    let currentImageIndex = 0;
    let intervalId;

    function changeImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        imgElement.src = images[currentImageIndex];
    }

    container.addEventListener('mouseenter', () => {
        intervalId = setInterval(changeImage, 1200);
    });

    container.addEventListener('mouseleave', () => {
        clearInterval(intervalId);
        currentImageIndex = 0;
    });
});

//--------------------------------------------------------------------------------------------------------------------------------------

//Roll para bajar a seccion
function scrollToSection() {
    const destino = document.getElementById('productos-destacados');
    if (destino) {
        destino.scrollIntoView({ behavior: 'smooth' });
    }
}

//--------------------------------------------------------------------------------------------------------------------------------------
// **FUNCIÓN PARA VENTANA EMERGENTE DE SESIÓN**
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('user-modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const authBtn = document.getElementById('auth-btn');
    const accountConfigBtn = document.getElementById('account-config-btn');
    
    let isAuthenticated = false;

    function updateAuthButton() {
        if (authBtn) {
            if (isAuthenticated) {
                authBtn.textContent = 'Cerrar Sesión';
                authBtn.onclick = () => {
                    isAuthenticated = false;
                    updateAuthButton();
                    alert('Sesión cerrada');
                };

                if (accountConfigBtn) {
                    accountConfigBtn.disabled = false;
                    accountConfigBtn.onclick = () => {
                        window.location.href = 'config_cuenta.html';
                    };
                }
            } else {
                authBtn.textContent = 'Iniciar Sesión';
                authBtn.onclick = () => {
                    window.location.href = '../Cuenta InicioSesion/IniciarSes.html';
                    isAuthenticated = true;
                    updateAuthButton();
                };

                if (accountConfigBtn) {
                    accountConfigBtn.disabled = true;
                    accountConfigBtn.onclick = null;
                }
            }
        }
    }

    if (openModalBtn) {
        openModalBtn.onclick = function() {
            if (modal) {
                modal.style.display = 'flex';
            }
            updateAuthButton();
        };
    }

    if (closeModalBtn) {
        closeModalBtn.onclick = function() {
            if (modal) {
                modal.style.display = 'none';
            }
        };
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    updateAuthButton();
});

//--------------------------------------------------------------------------------------------------------------------------------------

// Función para alternar el menú lateral del carrito
function toggleCartMenu() {
    const cartSidebar = document.getElementById("cart-sidebar");
    if (cartSidebar) {
        cartSidebar.style.width = cartSidebar.style.width === "300px" ? "0" : "300px";
    }
}

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


//--------------------------------------------------------------------------------------------------------------------------------------------------
//IMPORTANTE ESTO ES PARA CONSERVAR LO DEL CARRO EN TODAS LAS PAGS
// Recupera el producto seleccionado desde localStorage
const productoSeleccionadoJSON = localStorage.getItem('productoSeleccionado');
const productoSeleccionado = productoSeleccionadoJSON ? JSON.parse(productoSeleccionadoJSON) : null;

if (productoSeleccionado) {
    const productNameElement = document.querySelector('.product-details h1');
    const priceElement = document.querySelector('.price');
    const mainImageElement = document.getElementById('imagen-principal');
    const stockElement = document.getElementById('product-stock');
    const codeElement = document.getElementById('product-code');
    const descriptionElement = document.querySelector('.description p');
    const miniaturasContainer = document.querySelector('.product-thumbnails');

    // Asigna valores solo si los elementos existen
    if (productNameElement) productNameElement.textContent = productoSeleccionado.nombre;
    if (priceElement) priceElement.textContent = `$${productoSeleccionado.precio}`;
    if (mainImageElement) mainImageElement.src = productoSeleccionado.imagen;
    if (stockElement) stockElement.textContent = productoSeleccionado.stock;
    if (codeElement) codeElement.textContent = productoSeleccionado.id;
    if (descriptionElement) descriptionElement.textContent = productoSeleccionado.descripcion || "Descripción no disponible";

    // Configuración del carrusel de imágenes
    if (miniaturasContainer) {
        miniaturasContainer.innerHTML = ''; // Limpia miniaturas previas
        const images = [productoSeleccionado.imagen, ...productoSeleccionado.miniaturas];
        images.forEach((miniatura, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = miniatura;
            imgElement.alt = `Miniatura de ${productoSeleccionado.nombre}`;
            imgElement.addEventListener('click', () => {
                if (mainImageElement) mainImageElement.src = miniatura;
            });
            miniaturasContainer.appendChild(imgElement);
        });
    }
} else {
    console.warn("No se ha seleccionado ningún producto para mostrar en la página de compra.");
}

// Función adicional para restaurar el carrito
document.addEventListener('DOMContentLoaded', function() {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
        cartItems = JSON.parse(savedCart) || []; // Restaura el carrito guardado o inicia con un array vacío
        if (typeof renderCartItems === 'function') renderCartItems(); // Asegura que renderCartItems existe
        if (typeof updateCartQuantity === 'function') updateCartQuantity(cartItems.length); // Asegura que updateCartQuantity existe
    }
});

// Función para actualizar la cantidad total de productos en el icono del carrito
function updateCartQuantity(quantity) {
    const cartButton = document.querySelector(".btn-cart");
    if (cartButton) {
        cartButton.setAttribute("data-quantity", quantity);
        cartButton.querySelector(".quantity").textContent = quantity;
    }
}

//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//COSA DE PRODUCTOS SELECCIONADOOOOOOOOOOOOOOOOOOOOOOOS

/*
const productosDestacados = [
    { id: 'A1038', nombre: 'Poleras Mujer', precio: 5900, stock: 6, imagen: '../imagenesGeneralSuperior/poleras holgada mujer ancha modelar (2).jpg', miniaturas: ['../imagenesGeneralSuperior/poleras holgada mujer ancha modelar (2).jpg', '../imagenesGeneralSuperior/poleras holgada mujer ancha modelar (2).jpg'] , descripcion: 'Camisetas de diversos estilos, cómodas y versátiles para el uso diario de mujeres.' },
    { id: 'A1036', nombre: 'Peto De Pavílo', precio: 2000, stock: 6, imagen: '../imagenesGeneralSuperior/faldas mujer modelar (1).jpg', miniaturas: ['../imagenesGeneralSuperior/faldas mujer modelar (1).jpg', '../imagenesGeneralSuperior/faldas mujer modelar (1).jpg'] , descripcion: 'Prenda sin mangas, ideal para actividades informales o deportivas, cómoda y resistente.' },
    { id: 'A1031', nombre: 'Calcetas Normales', precio: 1500, stock: 7, imagen: '../imagenesGeneralCalcetas/oferta ropa mujer (1).jpg', miniaturas: ['../imagenesGeneralCalcetas/oferta ropa mujer (1).jpg', '../imagenesGeneralCalcetas/oferta ropa mujer (1).jpg'] , descripcion: 'Son calcetines que cubren el pie hasta la mitad de la pantorrilla.' },
    { id: 'A1017', nombre: 'Calzón Nora', precio: 2000, stock: 20, imagen: '../imagenesGeneral/Moda Mujer Modelar (2).jpg' , miniaturas: ['../imagenesGeneral/Moda Mujer Modelar.jpg', '../imagenesGeneral/Moda Mujer Modelar.jpg'] , descripcion: 'Calzón cómodo y sencillo' },
    { id: 'A1005', nombre: 'Calzon Extra Linda', precio: 2500, stock: 20, imagen: '../imagenesGeneral/Moda Mujer Modelar (2).jpg', miniaturas: ['../imagenesGeneral/Moda Mujer Modelar.jpg', '../imagenesGeneral/Moda Mujer Modelar.jpg'] , descripcion: 'Calzón diseñado para tallas grandes, con detalles que realzan la figura.' },
    { id: 'A1018', nombre: 'Calzón Con Encaje', precio: 2000, stock: 20, imagen: '../imagenesGeneral/Moda Mujer Modelar.jpg' , miniaturas: ['../imagenesGeneral/Moda Mujer Modelar (1).jpg', '../imagenesGeneral/Moda Mujer Modelar (1).jpg'] , descripcion: 'Calzón decorado con encaje, ideal para ocasiones especiales.' },
    { id: 'A1002', nombre: 'Calzon Cuadro', precio: 2000, stock: 20, imagen: '../imagenesGeneral/Moda Mujer Modelar (2).jpg', miniaturas: ['../imagenesGeneral/Moda Mujer Modelar.jpg', '../imagenesGeneral/Moda Mujer Modelar.jpg'] , descripcion: 'Calzón de corte recto y cómodo, ideal para el día a día.' },
    { id: 'A1033', nombre: 'Calceta Corta', precio: 2000, stock: 8, imagen: '../imagenesGeneralCalcetas/oferta ropa mujer (3).jpg', miniaturas: ['../imagenesGeneralCalcetas/oferta ropa mujer (3).jpg', '../imagenesGeneralCalcetas/oferta ropa mujer (3).jpg'] , descripcion: 'Calcetines que llegan justo debajo del tobillo.' },
];*/

const productosDestacados = [
    { 
        id: 'A1038', 
        nombre: 'Poleras Mujer', 
        precio: 5900, 
        stock: 10, 
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
        stock: 10, 
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
        stock: 10, 
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
        stock: 10, 
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
        stock: 10, 
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
        stock: 10, 
        imagen: '../imagenesGeneralCalcetas/oferta ropa mujer (3).jpg', 
        miniaturas: ['../imagenesGeneralCalcetas/oferta ropa mujer (3).jpg', '../imagenesGeneralCalcetas/oferta ropa mujer (3).jpg'], 
        descripcion: 'Calcetines que llegan justo debajo del tobillo.', 
        tallas: ['M'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
];




/*
const productosVistos = [
    { id: 'A1014', nombre: 'Calzón Elasticado', precio: 2500, stock: 20, imagen: '../imagenesGeneral/Moda Mujer Modelar (1).jpg', miniaturas: ['../imagenesGeneral/Moda Mujer Modelar (2).jpg', '../imagenesGeneral/Moda Mujer Modelar (2).jpg'] , descripcion: 'Calzón con banda elástica que se adapta al cuerpo sin apretar.' },
    { id: 'A1027', nombre: 'Calza Extra-Linda', precio: 5900, stock: 5, imagen: '../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg' , miniaturas: ['../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg', '../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg'] , descripcion: 'Calza con detalles decorativos y estilo femenino.' },
    { id: 'A1001', nombre: 'Colale Con Algodón', precio: 2000, stock: 15, imagen: '../imagenesGeneral/Moda Mujer Modelar (1).jpg', miniaturas: ['../imagenesGeneral/Moda Mujer Modelar (2).jpg', '../imagenesGeneral/Moda Mujer Modelar (2).jpg'] , descripcion: 'Prenda íntima de corte brasileño, hecha de algodón para comodidad y frescura.' },
    { id: 'A10288', nombre: 'Falda Señora', precio: 8000, stock: 5, imagen: '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg', miniaturas: ['../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg', '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg'] , descripcion: 'Falda elegante y clásica, para ocasiones formales.' },
    { id: 'A1011', nombre: 'Pantaleta (Calzón)', precio: 2000, stock: 20, imagen: '../imagenesGeneral/Moda Mujer Modelar.jpg', miniaturas: ['../imagenesGeneral/Moda Mujer Modelar (1).jpg', '../imagenesGeneral/Moda Mujer Modelar (1).jpg'] , descripcion: 'Calzón de corte completo, cubre más área y ofrece soporte.' },
    { id: 'A1030', nombre: 'Pantys Medio-Pantalón', precio: 1500, stock: 7, imagen: '../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg', miniaturas: ['../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg', '../imagenesGeneralPrendaInf/Moda Mujer Verano.jpg'] , descripcion: 'Pantys que cubren media pierna, cómodos y prácticos.' },
    { id: 'A1019', nombre: 'Colale Con Encaje', precio: 2000, stock: 20, imagen: '../imagenesGeneral/Moda Mujer Modelar (1).jpg' , miniaturas: ['../imagenesGeneral/Moda Mujer Modelar (2).jpg', '../imagenesGeneral/Moda Mujer Modelar (2).jpg'] , descripcion: 'Colale brasileño con detalles de encaje, femenino y cómodo.' },
    { id: 'A1031', nombre: 'Calcetas Normales', precio: 1500, stock: 7, imagen: '../imagenesGeneralCalcetas/oferta ropa mujer (1).jpg', miniaturas: ['../imagenesGeneralCalcetas/oferta ropa mujer (1).jpg', '../imagenesGeneralCalcetas/oferta ropa mujer (1).jpg'] , descripcion: 'Son calcetines que cubren el pie hasta la mitad de la pantorrilla.' },

];*/

const productosVistos = [
    { 
        id: 'A1014', 
        nombre: 'Calzón Elasticado', 
        precio: 2500, 
        stock: 10, 
        imagen: '../imagenesGeneralSuperior/poleras holgada mujer ancha modelar (2).jpg', 
        miniaturas: ['../imagenesGeneralSuperior/poleras holgada mujer ancha modelar (2).jpg', '../imagenesGeneralSuperior/poleras holgada mujer ancha modelar (2).jpg'], 
        descripcion: 'Calzón con banda elástica que se adapta al cuerpo sin apretar.', 
        tallas: ['S', 'M', 'L', 'XL', 'XXL'], // Tallas específicas para este producto
        colores: ['#ffffff', '#000000', '#483cf1'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1027', 
        nombre: 'Calza Extra-Linda', 
        precio: 5900, 
        stock: 10, 
        imagen: '../imagenesGeneralSuperior/faldas mujer modelar (1).jpg', 
        miniaturas: ['../imagenesGeneralSuperior/faldas mujer modelar (1).jpg', '../imagenesGeneralSuperior/faldas mujer modelar (1).jpg'], 
        descripcion: 'Calza con detalles decorativos y estilo femenino.', 
        tallas: ['XL', 'XXL'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1001', 
        nombre: 'Colale Con Algodón', 
        precio: 2000, 
        stock: 10, 
        imagen: '../imagenesGeneralCalcetas/oferta ropa mujer (1).jpg', 
        miniaturas: ['../imagenesGeneralCalcetas/oferta ropa mujer (1).jpg', '../imagenesGeneralCalcetas/oferta ropa mujer (1).jpg'], 
        descripcion: 'Prenda íntima de corte brasileño, hecha de algodón para comodidad y frescura.', 
        tallas: ['M', 'L', 'XL'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A10288', 
        nombre: 'Falda Señora', 
        precio: 8000, 
        stock: 10, 
        imagen: '../imagenesGeneral/Moda Mujer Modelar (2).jpg', 
        miniaturas: ['../imagenesGeneral/Moda Mujer Modelar (2).jpg', '../imagenesGeneral/Moda Mujer Modelar (2).jpg'], 
        descripcion: 'Falda elegante y clásica, para ocasiones formales.', 
        tallas: ['L', 'XL'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1011', 
        nombre: 'Pantaleta (Calzón)', 
        precio: 2000, 
        stock: 10, 
        imagen: '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg', 
        miniaturas: ['../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg', '../imagenesGeneralPrendaInf/Moda Mujer Invierno Abrigada.jpg'], 
        descripcion: 'Calzón de corte completo, cubre más área y ofrece soporte.', 
        tallas: ['L', 'XL'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1030', 
        nombre: 'Pantys Medio-Pantalón', 
        precio: 1500, 
        stock: 10, 
        imagen: '../imagenesGeneral/Moda Mujer Modelar (2).jpg', 
        miniaturas: ['../imagenesGeneral/Moda Mujer Modelar (2).jpg', '../imagenesGeneral/Moda Mujer Modelar (2).jpg'], 
        descripcion: 'Pantys que cubren media pierna, cómodos y prácticos.', 
        tallas: ['M'], // Tallas específicas para este producto
        colores: ['#be8f57', '#ffffff', '#979797'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1019', 
        nombre: 'Colale Con Encaje', 
        precio: 2000, 
        stock: 10, 
        imagen: '../imagenesGeneral/Moda Mujer Modelar.jpg', 
        miniaturas: ['../imagenesGeneral/Moda Mujer Modelar.jpg', '../imagenesGeneral/Moda Mujer Modelar.jpg'], 
        descripcion: 'Colale brasileño con detalles de encaje, femenino y cómodo.', 
        tallas: ['XXL', 'XXXL', 'XXXXL'], // Tallas específicas para este producto
        colores: ['#ffffff', '#000000', '#483cf1'] // Colores específicos (usando códigos hexadecimales)
    },
    { 
        id: 'A1031', 
        nombre: 'Calcetas Normales', 
        precio: 1500, 
        stock: 10, 
        imagen: '../imagenesGeneralCalcetas/oferta ropa mujer (3).jpg', 
        miniaturas: ['../imagenesGeneralCalcetas/oferta ropa mujer (3).jpg', '../imagenesGeneralCalcetas/oferta ropa mujer (3).jpg'], 
        descripcion: 'Son calcetines que cubren el pie hasta la mitad de la pantorrilla.', 
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

// **Eventos de clic para productos en "Lo más visto por los clientes"**
document.querySelectorAll('.mas-visto .producto-link').forEach((link, index) => {
    link.addEventListener('click', function() {
        const productoSeleccionado = productosVistos[index]; // Asegúrate de tener un array `productosMasVisto`

        if (productoSeleccionado) {
            localStorage.setItem('productoSeleccionado', JSON.stringify(productoSeleccionado));
        } else {
            console.error(`Producto no encontrado en el índice más visto: ${index}`);
        }
    });
});



//------------------------------------------------------------------------------------------------------------
//FUNCION ADICIONAAAAAAAAAAAAAAAAAAAAAAAL (RECUPERAR CARRITO)
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

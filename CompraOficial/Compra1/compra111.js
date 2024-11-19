/*
// Recupera los datos del carrito desde localStorage
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');

// Función para renderizar los productos en la página de resumen
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío. Agrega productos para continuar con la compra.</p>';
        cartTotalElement.textContent = '$0.00';
        return;
    }

    cartItems.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <p><strong>${item.name}</strong></p>
                <p>Talla: ${item.talla}</p>
                <p>Cantidad: ${item.quantity}</p>
            </div>
            <button class="remove-btn" onclick="removeCartItem(${index})">Eliminar</button>
        `;

        cartItemsContainer.appendChild(cartItem);
        total += parseFloat(item.price.replace('$', '')) * item.quantity;
    });

    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

// Función para eliminar un producto del carrito
function removeCartItem(index) {
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCartItems();
}

// Redirige a la siguiente página de datos
document.getElementById('continue-btn').addEventListener('click', () => {
    if (cartItems.length === 0) {
        alert("Tu carrito está vacío. Por favor, agrega productos antes de continuar.");
        return;
    }
    window.location.href = "../Compra2/compra2.html"; // Redirige a la siguiente página de datos
});

// Inicializa el carrito en la página
renderCartItems();*/
// Recupera los datos del carrito desde localStorage
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');

// Función para renderizar los productos en la página de resumen
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío. Agrega productos para continuar con la compra.</p>';
        cartTotalElement.textContent = '$0.00';
        return;
    }

    cartItems.forEach((item, index) => {
        // Limpia el precio eliminando el símbolo "$" y convierte a número
        const price = parseFloat(item.price.replace('$', '').trim());
        const quantity = parseInt(item.quantity, 10); // Convertir cantidad a entero

        // Verifica si los datos son válidos
        if (isNaN(price) || isNaN(quantity)) {
            console.error('Datos inválidos en el producto:', item);
            return;
        }

        const itemTotal = price * quantity; // Cálculo correcto del total por producto
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <p><strong>${item.name}</strong></p>
                <p>Talla: ${item.talla}</p>
                <p>Cantidad: ${quantity}</p>
                <p>Precio Unitario: $${price.toFixed(2)}</p>
                <p>Total: $${itemTotal.toFixed(2)}</p>
            </div>
            <button class="remove-btn" onclick="removeCartItem(${index})">Eliminar</button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalElement.textContent = `$${total.toFixed(2)}`;
    return total; // Devuelve el total para usarlo en el envío al backend
}



// Función para eliminar un producto del carrito
function removeCartItem(index) {
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCartItems();
}

// Redirige a la siguiente página de datos y envía los datos esenciales al backend
document.getElementById('continue-btn').addEventListener('click', async () => {
    if (cartItems.length === 0) {
        alert("Tu carrito está vacío. Por favor, agrega productos antes de continuar.");
        return;
    }

    const total = renderCartItems(); // Calcula el total antes de enviar

    try {
        // Filtrar los datos necesarios para el backend
        const dataToSend = {
            carrito: cartItems.map(item => ({
                nombre: item.name || 'Sin nombre', // Nombre del producto
                cantidad: item.quantity || 1      // Cantidad del producto
            })),
            total // Incluye el total calculado
        };

        console.log("Datos a enviar al backend:", dataToSend);

        // Enviar los datos al backend
        const response = await fetch("https://tiendapyme-production.up.railway.app/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            throw new Error("Error al procesar el carrito.");
        }

        const result = await response.json();

        // Confirmar éxito y redirigir
        alert("Tu carrito ha sido procesado correctamente.");
        window.location.href = "../Compra2/compra2.html";
    } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un problema al procesar tu carrito.");
    }
});


// Inicializa el carrito en la página
renderCartItems();

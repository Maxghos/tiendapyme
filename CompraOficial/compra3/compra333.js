// Obtener elementos del DOM
const nextBtn = document.getElementById('next-btn');
const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
const transferDetails = document.getElementById('transfer-details');

// Mostrar u ocultar detalles de transferencia bancaria según la selección del método de pago
paymentOptions.forEach(option => {
    option.addEventListener('change', () => {
        if (option.value === "transfer" && option.checked) {
            // Mostrar detalles de transferencia bancaria
            transferDetails.classList.remove('hidden');
        } else {
            // Ocultar detalles de transferencia bancaria
            transferDetails.classList.add('hidden');
        }
    });
});

// Manejar el botón "Siguiente"
nextBtn.addEventListener('click', async () => {
    // Detectar el método de pago seleccionado
    let selectedMethod = "";
    paymentOptions.forEach(option => {
        if (option.checked) {
            selectedMethod = option.value;
        }
    });

    if (!selectedMethod) {
        alert("Por favor, selecciona un método de pago.");
        return;
    }

    // Datos necesarios
    const email = localStorage.getItem('userEmail'); // Recupera el correo del usuario almacenado en localStorage
    const carrito = JSON.parse(localStorage.getItem('cartItems')); // Recupera el carrito desde localStorage
    const total = carrito
        ? carrito.reduce((acc, item) => {
            const precio = parseFloat(item.price.replace('$', '').trim()); // Convertir el precio a número
            return acc + (precio * item.quantity);
        }, 0)
        : 0; // Calcula el total
    const direccionEnvio = localStorage.getItem('direccionEnvio') || 'Calle Falsa 123, Ciudad'; // Recupera la dirección o usa una fija

    // Validación de datos antes de enviar
    console.log("Datos validados antes de enviar:");
    console.log("Email:", email);
    console.log("Carrito:", carrito);
    console.log("Total:", total);
    console.log("Dirección de Envío:", direccionEnvio);

    // Validación para evitar datos incompletos
    if (!email || !carrito || carrito.length === 0 || total <= 0 || !direccionEnvio) {
        alert('Faltan datos necesarios para completar la compra.');
        return;
    }

    try {
        // Enviar datos al backend
        const response = await fetch('https://tiendapyme-production.up.railway.app/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                carrito,
                total,
                direccion_envio: direccionEnvio
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Error del backend:", errorData);
            throw new Error('Error al procesar la compra');
        }

        const result = await response.json();
        alert(result.message); // Muestra un mensaje de éxito

        // Guardar resumen en localStorage para mostrarlo en compra4
        localStorage.setItem('purchaseSummary', JSON.stringify({
            email,
            carrito,
            total,
            direccionEnvio
        }));

        // Redirigir según el método seleccionado
        if (selectedMethod === "transfer") {
            alert("Recuerda realizar la transferencia y guarda los datos.");
        }

        // Redirigir a la página de "Gracias"
        window.location.href = '../compra4/compra4.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un problema al procesar tu compra.');
    }
});

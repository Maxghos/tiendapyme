document.addEventListener('DOMContentLoaded', () => {
    const purchaseSummary = JSON.parse(localStorage.getItem('purchaseSummary'));

    if (purchaseSummary) {
        const resumenContainer = document.getElementById('resumen-compra');

        if (!resumenContainer) {
            console.error('Elemento con id "resumen-compra" no encontrado.');
            return;
        }

        // Validar y obtener la dirección de envío
        const direccionEnvio = purchaseSummary.direccionEnvio || localStorage.getItem('direccionEnvio');
        if (!direccionEnvio) {
            alert('No se encontró la dirección de envío. Por favor, completa tus datos.');
            window.location.href = '../compra2/compra2.html'; // Redirigir a la página de datos
            return;
        }

        let resumenHtml = `
            <p><strong>Correo:</strong> ${purchaseSummary.email}</p>
            <p><strong>Dirección de envío:</strong> ${direccionEnvio}</p>
            <h2>Productos</h2>
            <ul>
        `;

        purchaseSummary.carrito.forEach(item => {
            resumenHtml += `
                <li>${item.name} - Cantidad: ${item.quantity} - Precio: ${item.price}</li>
            `;
        });

        resumenHtml += `
            </ul>
            <p><strong>Total:</strong> $${purchaseSummary.total}</p>
        `;

        resumenContainer.innerHTML = resumenHtml;

        // Función para descargar el resumen en PDF
        const downloadButton = document.querySelector('.download-btn');
        if (downloadButton) {
            downloadButton.addEventListener('click', () => {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();

                doc.setFontSize(16);
                doc.text('Resumen de tu Compra', 10, 10);
                doc.setFontSize(12);
                doc.text(`Correo: ${purchaseSummary.email}`, 10, 20);
                doc.text(`Dirección de envío: ${direccionEnvio}`, 10, 30);

                let y = 40;
                purchaseSummary.carrito.forEach(item => {
                    doc.text(`${item.name} - Cantidad: ${item.quantity} - Precio: ${item.price}`, 10, y);
                    y += 10;
                });

                doc.text(`Total: $${purchaseSummary.total}`, 10, y + 10);
                doc.save('resumen-compra.pdf');
            });
        } else {
            console.error('Botón para descargar PDF no encontrado.');
        }

        // Redirigir a la tienda al hacer clic en "Volver a la tienda"
        const backButton = document.querySelector('.back-btn');
        if (backButton) {
            backButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = backButton.href;
            });
        } else {
            console.error('Botón "Volver a la tienda" no encontrado.');
        }
    } else {
        alert('No hay datos de compra para mostrar.');
        window.location.href = '../../index.html';
    }
});

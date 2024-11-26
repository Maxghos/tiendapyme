function toggleMenu() {
    var sidebar = document.getElementById("sidebar");
    sidebar.style.width = (sidebar.style.width === "250px") ? "0" : "250px";
}

document.addEventListener("DOMContentLoaded", () => {
    const ordenesContainer = document.getElementById("ordenes-container");

    // Función para cargar las órdenes desde el backend
    async function cargarOrdenes() {
        try {
            const response = await fetch('http://localhost:3000/api/ordenes');
            const ordenes = await response.json();

            ordenesContainer.innerHTML = ''; // Limpiar las notificaciones previas

            ordenes.forEach(orden => {
                const ordenDiv = document.createElement('div');
                ordenDiv.classList.add('orden');

                ordenDiv.innerHTML = `
                    <p><strong>ID Orden:</strong> ${orden.id_orden}</p>
                    <p><strong>ID Usuario:</strong> ${orden.id_usuario}</p>
                    <p><strong>Fecha Aprobación:</strong> ${orden.fecha_aprobacion || 'Pendiente'}</p>
                    <p><strong>Estado Envío:</strong> ${orden.estado_envio}</p>
                    <button class="aceptar-btn" data-id="${orden.id_orden}">Aceptar</button>
                    <button class="rechazar-btn" data-id="${orden.id_orden}">Rechazar</button>
                `;

                ordenesContainer.appendChild(ordenDiv);
            });

            agregarEventosBotones();
        } catch (error) {
            console.error("Error al cargar las órdenes:", error);
        }
    }

    // Función para manejar los botones de aceptar/rechazar
    function agregarEventosBotones() {
        document.querySelectorAll(".aceptar-btn").forEach(button => {
            button.addEventListener("click", async (e) => {
                const idOrden = e.target.getAttribute("data-id");
                try {
                    const response = await fetch(`http://localhost:3000/api/aceptar-orden/${idOrden}`, { method: "POST" });
                    if (!response.ok) throw new Error('Error al aceptar la orden');
                    cargarOrdenes(); // Recargar las órdenes después de aceptar
                } catch (error) {
                    console.error("Error al aceptar la orden:", error);
                }
            });
        });

        document.querySelectorAll(".rechazar-btn").forEach(button => {
            button.addEventListener("click", async (e) => {
                const idOrden = e.target.getAttribute("data-id");
                try {
                    const response = await fetch(`http://localhost:3000/api/rechazar-orden/${idOrden}`, { method: "POST" });
                    if (!response.ok) throw new Error('Error al rechazar la orden');
                    cargarOrdenes(); // Recargar las órdenes después de rechazar
                } catch (error) {
                    console.error("Error al rechazar la orden:", error);
                }
            });
        });
    }

    // Cargar órdenes al cargar la página
    cargarOrdenes();
});

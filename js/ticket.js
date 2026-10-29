const peliculaGuardada = localStorage.getItem("peliculaSeleccionada");

if (peliculaGuardada) {
  const pelicula = JSON.parse(peliculaGuardada);
  document.getElementById("ticket-movie-title").textContent = pelicula.Title;
}

// Configuración de filas y columnas
const asientos = ["A", "B", "C", "D", "E"];
const asientosVip = ["F", "G", "H"];
const totalColumnas = 10;

// Precios y cargos
const precioEstandar = 30000;
const precioVip = 75000;
const cargoServicio = 4500;

// Estado inicial
const ocupados = ["A3", "A4", "C5", "F2", "F3"];
let seleccionados = [];

// Elementos del DOM
const asientosContenedor = document.getElementById("seatsGrid");
const selectedSeatsList = document.getElementById("selected-seats-list");
const seatCountLabel = document.getElementById("seat-count-label");
const ticketsSubtotal = document.getElementById("tickets-subtotal");
const totalPrice = document.getElementById("total-price");
const btnContinuar = document.querySelector(".btn-checkout")

function pintarAsientos() {
  asientosContenedor.innerHTML = "";
  const totalFilas = [...asientos, ...asientosVip];

  totalFilas.forEach((fila) => {
    const isVip = asientosVip.includes(fila);

    // Contenedor principal de la fila
    const contenedorFila = document.createElement("div");
    contenedorFila.classList.add("seat-row", "d-flex", "align-items-center", "justify-content-center", "mb-2");

    // Etiqueta de fila a la izquierda
    const etiquetaFila = document.createElement("span");
    etiquetaFila.classList.add("row-label", "me-2");
    etiquetaFila.textContent = fila;
    contenedorFila.appendChild(etiquetaFila);

    for (let col = 1; col <= totalColumnas; col++) {
      const asientoId = `${fila}${col}`;
      const estaOcupado = ocupados.includes(asientoId);
      const estaSeleccionado = seleccionados.includes(asientoId);

      const btnAsiento = document.createElement("button");
      btnAsiento.type = "button";
      btnAsiento.classList.add("seat-btn");

      if (isVip) btnAsiento.classList.add("seat-vip");
      if (estaOcupado) {
        btnAsiento.classList.add("seat-occupied");
        btnAsiento.disabled = true;
      } else if (estaSeleccionado) {
        btnAsiento.classList.add("seat-selected");
      }

      btnAsiento.textContent = col;

      if (!estaOcupado) {
        btnAsiento.addEventListener("click", () => toggleAsiento(asientoId));
      }

      contenedorFila.appendChild(btnAsiento);

      if (col === 3 || col === 7) {
        const pasillo = document.createElement("div");
        pasillo.classList.add("seat-aisle");
        contenedorFila.appendChild(pasillo);
      }
    }

    asientosContenedor.appendChild(contenedorFila);
  });
}

function toggleAsiento(id) {
  if (seleccionados.includes(id)) {
    seleccionados = seleccionados.filter((asiento) => asiento !== id);
  } else {
    seleccionados.push(id);
  }

  pintarAsientos();
  actualizarResumen();
}

function actualizarResumen() {
  seatCountLabel.textContent = `${seleccionados.length} ASIENTOS`;
  selectedSeatsList.innerHTML = "";
  let subtotal = 0;

  if (seleccionados.length === 0) {
    selectedSeatsList.innerHTML = `<small class="text-secondary">Ningún asiento seleccionado</small>`;
  }

  seleccionados.forEach((id) => {
    const fila = id.charAt(0);
    const isVip = asientosVip.includes(fila);
    const precio = isVip ? precioVip : precioEstandar;
    subtotal += precio;

    const tag = document.createElement("div");
    tag.classList.add("seat-tag");
    tag.style.cursor = "pointer";
    tag.innerHTML = `${id} ${isVip ? "(VIP)" : ""} <i class="bi bi-x-lg ms-1"></i>`;

    tag.addEventListener("click", () => toggleAsiento(id));
    selectedSeatsList.appendChild(tag);
  });

  const total = subtotal > 0 ? subtotal + cargoServicio : 0;

  ticketsSubtotal.textContent = `$${subtotal.toLocaleString("es-CO")}`;
  totalPrice.textContent = `$${total.toLocaleString("es-CO")}`;
}

btnContinuar.addEventListener("click", () => {
  if (seleccionados.length === 0) {
    alert("Por favor, selecciona la menos un asiento antes de continuar.");
    return;
  }

  let subtotal = 0;
  seleccionados.forEach(id => {
    const fila = id.charAt(0);
    const isVip = asientosVip.includes(fila);
    subtotal += isVip ? precioVip : precioEstandar;
  });
  const totalEntradas = subtotal > 0 ? subtotal + cargoServicio : 0;

  const datosReserva = {
    asientos: seleccionados,
    cantidadAsientos: seleccionados.length,
    subtotalEntradas: subtotal,
    cargoServicio: cargoServicio,
    totalEntradas: totalEntradas,
    pelicula: JSON.parse(localStorage.getItem("peliculaSeleccionada") || "{}")
  };

  localStorage.setItem("reservaTicket", JSON.stringify(datosReserva));
  window.location.href = "./snacks.html";
});

// Inicializar vista
pintarAsientos();
actualizarResumen();
const reservaGuardada = localStorage.getItem("reservaTicket");
if (!reservaGuardada) {
  // solo si no hay reserva, se redirige al selector de asientos
  window.location = "./ticket.html";
}

const datosReserva = JSON.parse(reservaGuardada);

const catalogoSnacks = [
  { id: "promo1", nombre: "Combo Pareja Omaiga", precio: 55000 },
  { id: "snack1", nombre: "Combo Dúo Mega", precio: 14500 },
  { id: "snack2", nombre: "Palomitas Clásicas Mantequilladas", precio: 14500 },
  { id: "snack3", nombre: "Palomitas Caramelo", precio: 14500 },
  { id: "snack4", nombre: "Refresco ICEE", precio: 14500 },
  { id: "snack5", nombre: "Nachos Supremos con Cheddar", precio: 14500 },
  { id: "snack6", nombre: "M&M's Chocolate Grande", precio: 14500 }
]

let carritoSnacks = {}

const summaryPoster = document.getElementById("summary-poster");
const summaryMovieTitle = document.getElementById("summary-movie-title");
const summarySeats = document.getElementById("summary-seats");
const summaryTicketsCount = document.getElementById("summary-tickets-count");
const summaryTicketsSubtotal = document.getElementById("summary-tickets-subtotal");
const summarySnacksList = document.getElementById("summary-snacks-list");
const summarySnacksCountBadge = document.getElementById("summary-snacks-count-badge");
const summarySnacksSubtotal = document.getElementById("summary-snacks-subtotal");
const totalPrice = document.getElementById("total-price");
const btnFinalizarPago = document.getElementById("btn-finalizar-pago");

function cargarDatosBoleta() {
  if (datosReserva.pelicula) {
    summaryMovieTitle.textContent = datosReserva.pelicula.Title;
  }
  if (datosReserva.pelicula.Poster && datosReserva.pelicula.Poster !== "N/A") {
    summaryPoster.src = datosReserva.pelicula.Poster;
  }

  summarySeats.innerHTML = `<i class="bi bi-person-fill me-1"></i> Butacas: ${datosReserva.asientos.join(", ")}`;
  summaryTicketsCount.textContent = `Entradas Seleccionadas (x${datosReserva.cantidadAsientos})`;
  summaryTicketsSubtotal.textContent = `$${datosReserva.totalEntradas.toLocaleString("es-CO")}`;
}

function cambiarCantidad(snackId, cambio) {
  const cantidadActual = carritoSnacks[snackId] || 0;
  const nuevaCantidad = cantidadActual + cambio;
  if (nuevaCantidad <= 0) {
    delete carritoSnacks[snackId];
  } else {
    carritoSnacks[snackId] = nuevaCantidad;
  }
  // cada cambio que hagamos debe actualizace el resumen a pagar
  actualizarResumen()
}

function actualizarResumen() {
  summarySnacksList.innerHTML = "";
  let subtotalSnacks = 0;
  let totalItemsSnacks = 0;

  const idsSeleccionados = Object.keys(carritoSnacks);

  if(idsSeleccionados.length === 0) {
    summarySnacksList.innerHTML = `<small class="text-secondary d-block">Sin snacks seleccionados</small>`;
  } else {
    idsSeleccionados.forEach(id => {
      const snack = catalogoSnacks.find((item) => item.id === id);
      const cantidad = carritoSnacks[id];
      const costoTotalSnack = snack.precio * cantidad;

      subtotalSnacks += costoTotalSnack;
      totalItemsSnacks += cantidad;

      const itemDiv = document.createElement("div");
      itemDiv.classList.add("d-flex", "justify-content-between", "mb-2", "align-items-center");
      itemDiv.innerHTML = `
        <div>
          <span class="d-block text-white small fw-semibold">${snack.nombre}</span>
          <span class="text-secondary" style="font-size: 0.75rem;">${cantidad} x $${snack.precio.toLocaleString("es-CO")}</span>
        </div>
        <div class="d-flex gap-2 align-items-center">
          <span class="text-white small fw-bold">$${costoTotalSnack.toLocaleString("es-CO")}</span>
          <i class="bi bi-trash3 text-danger btn-eliminar" style="cursor:pointer; font-size: 0.85rem;" title="Eliminar"></i>
        </div>
      `;

      itemDiv.querySelector(".btn-eliminar").addEventListener("click", () => {
        delete carritoSnacks[id];
        actualizarResumen();
      });

      summarySnacksList.appendChild(itemDiv);
    });
  }

  // actualizamos el resumen de pago
  summarySnacksCountBadge.textContent = `${totalItemsSnacks} Ítems`;
  summarySnacksSubtotal.textContent = `$${subtotalSnacks.toLocaleString("es-CO")}`;

  const Total = datosReserva.totalEntradas + subtotalSnacks;
  totalPrice.textContent = `$${Total.toLocaleString("es-CO")}`;

  actualizarContadoresVista();
}

function actualizarContadoresVista() {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card, index) => {
    const input = card.querySelector("input");
    const snackId = `snack${index + 1}`;
    if (input) {
      input.value = carritoSnacks[snackId] || 0;
    }
  });
}

function vincularEventos() {
  // boton de promo
  const btnPromo = document.querySelector(".info-container button");
  if (btnPromo) {
    btnPromo.addEventListener("click", () => cambiarCantidad("promo1", 1));
  }

  // demas btones con lo de +/-
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    const btnRestar = card.querySelector(".btn-outline-secondary");
    const btnSumar = card.querySelector(".btn-warning");
    const snackId = `snack${index + 1}`;

    if(btnRestar) {
      btnRestar.addEventListener("click", () => cambiarCantidad(snackId, -1));
    }
    if (btnSumar) {
      btnSumar.addEventListener("click", () => cambiarCantidad(snackId, 1));
    }
  });

  btnFinalizarPago.addEventListener("click", () => {
    const ordenCompleta = {
      ...datosReserva,
      snacks: Object.keys(carritoSnacks).map(id => {
        const snack = catalogoSnacks.find(item => item.id === id);
        return {
          id: id,
          nombre: snack.nombre,
          precioUnitario: snack.precio,
          cantidad: carritoSnacks[id],
          subtotal: snack.precio * carritoSnacks[id],
        };
      }),
      totalFinal: datosReserva.totalEntradas + Object.keys(carritoSnacks).reduce((sum, id) => {
        const snack = catalogoSnacks.find(item => item.id === id);
        return sum + (snack ? snack.precio * carritoSnacks[id] : 0)
      }, 0)
    };

    // guardamos en el localstorage para la otra pantalla la cual es check.html
    localStorage.setItem("ordenCompleta", JSON.stringify(ordenCompleta));
    window.location.href = "./check.html"
  })
}

cargarDatosBoleta();
vincularEventos();
actualizarResumen();
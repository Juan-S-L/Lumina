// Cargar lo que hay en localStorage
const ordenGuardada =
  localStorage.getItem("ordenCompleta") ||
  localStorage.getItem("reservaTicket");

if (!ordenGuardada) {
  window.location.href = "../index.html";
}

const datosOrden = JSON.parse(ordenGuardada);

// Elementos del HTML
const mainMoviePoster = document.getElementById("main-movie-poster");
const mainMovieTitle = document.getElementById("main-movie-title");
const mainSeatsTags = document.getElementById("main-seats-tags");
const summaryMovieTitle = document.getElementById("summary-movie-title");
const summaryTicketsList = document.getElementById("summary-tickets-list");
const summarySnacksList = document.getElementById("summary-snacks-list");
const summarySubtotalTickets = document.getElementById("summary-subtotal-tickets");
const summarySubtotalSnacks = document.getElementById("summary-subtotal-snacks");
const totalPriceDisplay = document.getElementById("total-price-display");
const btnText = document.getElementById("btn-text");
const btnPagar = document.getElementById("btn-pagar");

function renderizarResumen() {
  const pelicula = datosOrden.pelicula || {};
  const totalPagar = datosOrden.totalFinal || datosOrden.totalEntradas || 0;

  if (pelicula.Title) {
    mainMovieTitle.textContent = pelicula.Title;
    summaryMovieTitle.textContent = pelicula.Title;
  }
  if (pelicula.Poster && pelicula.Poster !== "N/A") {
    mainMoviePoster.src = pelicula.Poster;
  }

  mainSeatsTags.innerHTML = "";
  if (datosOrden.asientos) {
    datosOrden.asientos.forEach((asiento) => {
      const etiqueta = document.createElement("p");
      etiqueta.classList.add("bg-subtle-warning","py-1","px-3","rounded","mb-0","text-warning","fw-bold","small");
      etiqueta.innerHTML = `<i class="bi bi-ticket-perforated me-1"></i> Asiento ${asiento}`;
      mainSeatsTags.appendChild(etiqueta);
    });
  }

  summaryTicketsList.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-1">
      <span class="text-white small"><span class="text-warning fw-bold me-1">${datosOrden.cantidadAsientos}x</span> Entrada(s) (${datosOrden.asientos.join(", ")})</span>
      <span class="text-white fw-bold small">$${datosOrden.totalEntradas.toLocaleString("es-CO")}</span>
    </div>
  `;
  summarySubtotalTickets.textContent = `$${datosOrden.totalEntradas.toLocaleString("es-CO")}`;

  let subtotalSnacks = 0;
  summarySnacksList.innerHTML = "";

  if (datosOrden.snacks && datosOrden.snacks.length > 0) {
    datosOrden.snacks.forEach((snack) => {
      subtotalSnacks += snack.subtotal;
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-1");
      itemDiv.innerHTML = `
        <span class="text-white small"><span class="text-warning fw-bold me-1">${snack.cantidad}x</span> ${snack.nombre}</span>
        <span class="text-white fw-bold small">$${snack.subtotal.toLocaleString("es-CO")}</span>
      `;
      summarySnacksList.appendChild(itemDiv);
    });
  } else {
    summarySnacksList.innerHTML = `<small class="text-secondary">Sin snacks incluidos</small>`;
  }

  summarySubtotalSnacks.textContent = `$${subtotalSnacks.toLocaleString("es-CO")}`;

  const totalFormateado = `$${totalPagar.toLocaleString("es-CO")}`;
  totalPriceDisplay.textContent = totalFormateado;
  btnText.textContent = `PAGAR ${totalFormateado}`;
}

function vincularEventos() {
  const dialogElement = document.getElementById("successModal");

  btnPagar.addEventListener("click", () => {
    const totalPagar = datosOrden.totalFinal || datosOrden.totalEntradas || 0;

    document.getElementById("modal-movie-title").textContent =
      datosOrden.pelicula?.Title || "Película";
    document.getElementById("modal-seats").textContent = datosOrden.asientos
      ? datosOrden.asientos.join(", ")
      : "-";
    document.getElementById("modal-total").textContent =
      `$${totalPagar.toLocaleString("es-CO")}`;

    // Abre el elemento dialog usando el API nativo de HTML5
    if (dialogElement && typeof dialogElement.showModal === "function") {
      dialogElement.showModal();
    }
  });

  document.getElementById("btn-finalizar-todo").addEventListener("click", () => {
      if (dialogElement && typeof dialogElement.close === "function") {
        dialogElement.close();
      }

      localStorage.removeItem("peliculaSeleccionada");
      localStorage.removeItem("reservaTicket");
      localStorage.removeItem("ordenCompleta");
      window.location.href = "../index.html";
    });
}

renderizarResumen();
vincularEventos();
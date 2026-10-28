// tomar las peliculas de la busqueda de marvel:
// api de peliculas: https://www.omdbapi.com/?apikey=261a5728&s=marvel&page=1
// ver detalle de una peli: https://www.omdbapi.com/?apikey=261a5728&i=tt3896198

const header_contenedor = document.getElementById("header-container-carrusel");
const catalogo_contenedor = document.getElementById("catalogo-container");

let carrusel = [];
let catalogo = []

async function peliculas() {
  try {
    const respuestaPeliculas = await fetch(
      "https://www.omdbapi.com/?apikey=261a5728&s=marvel&page=1",
    );
    const datosRespuestaPeliculas = await respuestaPeliculas.json();    
    return datosRespuestaPeliculas
  } catch (error) {
    console.log(f`hubo un error: ${error}`);
  }
}

const obtenerPelicula = async () => {
  try {
    const pelicula = await peliculas()
    const catalogoPeliculas = pelicula.Search;
    // console.log(catalogoPeliculas);

    const datosLimitadosCarrusel = catalogoPeliculas.slice(0, 4);

    for (let datos of datosLimitadosCarrusel) {
      // console.log(datos.imdbID);
      let respuestaDetallada = await fetch(
        `https://www.omdbapi.com/?apikey=261a5728&i=${datos.imdbID}`,
      );
      let datosRespuestaLimitada = await respuestaDetallada.json();
      carrusel.push(datosRespuestaLimitada);
    }

    for (let datos of catalogoPeliculas) {
      let respuestaDetallada = await fetch(
        `https://www.omdbapi.com/?apikey=261a5728&i=${datos.imdbID}`,
      );
      let datosRespuestaDetallada = await respuestaDetallada.json();
      catalogo.push(datosRespuestaDetallada);
    }
    console.log(catalogo);
    // console.log(carrusel);

    header_contenedor.innerHTML = "";
    catalogo_contenedor.innerHTML = "";

    carrusel.forEach((pelicula, posicion) => {
      const isActive = posicion === 0 ? "active" : "";

      header_contenedor.innerHTML += `
        <div class="carousel-item ${isActive} row align-items-center g-0">
            <div class="lg:col-6 sm:col-12">
                <p class="text-uppercase text-warning fw-bold">Estreno mundial de la semana</p>
                <h4>Sala Macro Super Cool</h4>
                <!-- esto es dinamico -->
                <h1>${pelicula.Title}</h1>
                <div class="contains-inline mb-3">
                    <ul class="list-group list-group-horizontal list-unstyled gap-2">
                        <!-- esto es dinamico -->
                        <li class="list-group-item rounded bg-dark text-white border-0">${pelicula.Ratings[0].Value}</li>
                        <!-- esto es dinamico -->
                        <li class="list-group-item rounded bg-dark text-white border-0">${pelicula.Genre}</li>
                        <!-- esto es dinamico -->
                        <li class="list-group-item rounded bg-dark text-white border-0">${pelicula.Year}</li>
                    </ul>
                </div>
                <!-- esto es dinamico -->
                <p>${pelicula.Plot}</p>
                <button type="button" class="btn btn-warning mt-4 py-3 px-5 fw-bold seleccionar-pelicula">Reservar Ahora</button>
            </div>
            <div class="lg:col-6 sm:col-12 text-center mt-4 mt-lg-0">
                <!-- esto es dinamico -->
                <img class="rounded-4 shadow-lg img-fluid" src="${pelicula.Poster}" alt="Póster de la película de estreno">
            </div>
        </div>
        `;
    });

    catalogo.forEach(pelicula => {
      catalogo_contenedor.innerHTML += `
      <div class="card bg-dark text-white sm:col-12 md:col-4 lg:col-4 border-0 shadow" style="max-width: 350px">
          <div class="card-img-container rounded-top overflow-hidden">
              <!-- esto es dinamico -->
              <img class="card-img-top w-100" src="${pelicula.Poster}" alt="Póster película" style="height: 300px; object-fit: cover;">
          </div>
          <div class="card-body">
              <!-- esto es dinamico -->
              <h4 class="card-title fw-bold">${pelicula.Title}</h4>
              <p class="card-text text-secondary mb-3">Horarios para hoy</p>
              
              <div class="row text-center justify-content-center g-2 mb-4">
                  <!-- Función finalizada (deshabilitada) -->
                  <div class="col-6">
                      <button class="btn btn-outline-secondary w-100 py-2 disabled" aria-disabled="true">
                          <span class="d-block fw-bold">11:30 AM</span>
                          <small class="d-block" style="font-size: 0.7rem;">Finalizada</small>
                      </button>
                  </div>
                  <!-- Función disponible -->
                  <div class="col-6">
                      <button class="btn btn-warning w-100 py-2 seleccionar-pelicula">
                          <span class="d-block fw-bold text-dark">04:15 PM</span>
                          <small class="d-block text-dark" style="font-size: 0.7rem;">Disponible</small>
                      </button>
                  </div>
                  <div class="col-6">
                      <button class="btn btn-warning w-100 py-2 seleccionar-pelicula">
                          <span class="d-block fw-bold text-dark">07:30 PM</span>
                          <small class="d-block text-dark" style="font-size: 0.7rem;">Disponible</small>
                      </button>
                  </div>
                  <div class="col-6">
                      <button class="btn btn-warning w-100 py-2 seleccionar-pelicula">
                          <span class="d-block fw-bold text-dark">10:00 PM</span>
                          <small class="d-block text-dark" style="font-size: 0.7rem;">Disponible</small>
                      </button>
                  </div>
              </div>
              <button type="button" class="btn btn-outline-light w-100 mt-auto" data-bs-toggle="dialog" data-bs-target="#modal-detalle-${pelicula.imdbID}">
                  Más información
              </button>
              <dialog class="dialog" id="modal-detalle-${pelicula.imdbID}">
                  <div class="dialog-header">
                      <!-- esto es dinamico -->
                      <h1 class="dialog-title">${pelicula.Title}</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="dialog" aria-label="Close"></button>
                  </div>
                  <div class="dialog-body">
                      <div class="row align-items-center justify-content-center fs-xs">
                          <div class="col-3">
                              <!-- esto es dinamico -->
                              <img class="w-100" src="${pelicula.Poster}" alt="" srcset="">
                          </div>
                          <div class="col">
                              <!-- esto es dinamico -->
                              <p>${pelicula.Plot}</p>
                          </div>
                          <div class="dialog-footer">
                            <button type="button" class="btn-solid btn-warning seleccionar-pelicula">Reservar</button>
                        </div>
                      </div>
                  </div>
              </dialog>
          </div>
      </div>
      `
    });

  } catch (error) {
    console.log("Algo está fallando");
  }
};

obtenerPelicula();

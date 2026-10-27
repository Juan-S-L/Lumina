// tomar las peliculas de la busqueda de marvel:
// api de peliculas: https://www.omdbapi.com/?apikey=261a5728&s=marvel&page=1
// ver detalle de una peli: https://www.omdbapi.com/?apikey=261a5728&i=tt3896198

const header_contenedor = document.getElementById("header-container-carrusel")

const obtenerPelicula = async () => {
    let carrusel = []
    try {
        const respuestaPeliculas = await fetch("https://www.omdbapi.com/?apikey=261a5728&s=marvel&page=1")
        const datosRespuestaPeliculas = await respuestaPeliculas.json()
        console.log(datosRespuestaPeliculas.Search);

        const catalogoPeliculas = datosRespuestaPeliculas.Search;
        const datosLimitados = catalogoPeliculas.slice(0,4)
        
        for (let datos of datosLimitados) {
            console.log(datos.imdbID);
            let respuestaDetallada = await fetch(`https://www.omdbapi.com/?apikey=261a5728&i=${datos.imdbID}`)
            let datosRespuestaLimitada = await respuestaDetallada.json()
            carrusel.push(datosRespuestaLimitada)
        }
        console.log(carrusel);

        carrusel.forEach(pelicula => {
            header_contenedor.innerHTML += `
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
                <button type="button" class="btn btn-warning mt-4 py-3 px-5 fw-bold">Reservar Ahora</button>
            </div>
            <div class="lg:col-6 sm:col-12 text-center mt-4 mt-lg-0">
                <!-- esto es dinamico -->
                <img class="rounded-4 shadow-lg img-fluid" src="${pelicula.Poster}" alt="Póster de la película de estreno">
            </div>
            `
        });


    } catch (error) {
        console.log("Algo está fallando");
    }
}

obtenerPelicula()
/**
 * Obtiene un array con los id de las películas en tendencia
 *
 * @returns array
 */
async function getTrendingMovies() {
  let data = [];
  let moviesId = [];

  try {
    // Hacemos una petición a la API de las películas en tendencia
    const response = await fetch(`${API_BASE_URL}/trending/movie/week?api_key=${API_KEY}`);

    // Recogemos los datos del json
    const responseData = await response.json();
    data = responseData?.results;

    // Guardamos los id de las películas en tendencia en un array
    for (let item of data) {
      moviesId.push(item["id"]);
    }

    // Si hay errores en la petición, los mostramos por consola
  } catch (error) {
    console.log(`Error en la petición: ${error}`);
  }

  return moviesId;
}

window.addEventListener("DOMContentLoaded", async () => {
  // Recogemos el array de las películas en tendencia y generamos el html
  moviesId = await getTrendingMovies();
  for (let id of moviesId) {
    generateMovieCard(id);
  }
});

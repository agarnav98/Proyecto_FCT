/**
 * Genera un enlace de la lista de películas buscadas
 *
 * @param {integer} id
 * @param {string} title
 */
function generateListItem(id, title) {
  const listItem = document.createElement("a");
  listItem.className = "list-group-item list-group-item-action border-0";
  listItem.appendChild(document.createTextNode(title));
  document.getElementById("list-group").appendChild(listItem);

  // Al hacer click muestra la película
  listItem.addEventListener("click", () => {
    removeAllChildNodes("movies");
    generateMovieCard(id);
    removeAllChildNodes("list-group");
    document.getElementById("search").value = "";
  });
}

/**
 * Genera una lista con las peliculas buscadas
 *
 * @returns array
 */
async function generateSearchMovies() {
  let data = [];
  let queryString = document.getElementById("search").value;

  try {
    // Hacemos una petición a la API con el valor de búsqueda introducido
    const response = await fetch(`${API_BASE_URL}/search/movie?api_key=${API_KEY}${LANG}&query=${queryString}`);

    // Recogemos los datos del json
    const responseData = await response.json();
    data = responseData?.results;

    // Borramos las sugerencias de la búsqueda anterior
    removeAllChildNodes("list-group");

    // Solo hacemos la lista cuando el término de busqueda tenga al menos 3 caracteres
    if (queryString.length >= 3) {
      // Generamos solo 5 listas de las películas buscadas
      if (data.length > 5) {
        for (let i = 0; i < 5; i++) {
          generateListItem(data[i]["id"], data[i]["title"]);
        }
      }
      // Si no, solo guardamos las que aparezcan
      else {
        for (let item of data) {
          generateListItem(item["id"], item["title"]);
        }
      }
    }

    // Si hay errores en la petición, los mostramos por consola
  } catch (error) {
    console.log(`Error en la petición: ${error}`);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // Cada vez que tecleemos, se hará la búsqueda de películas
  document.getElementById("search").addEventListener("input", () => {
    generateSearchMovies();
  });
});

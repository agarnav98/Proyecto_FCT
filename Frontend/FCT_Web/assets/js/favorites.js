window.addEventListener("DOMContentLoaded", async () => {
  // Obtenemos la lista de favoritos de localStorage
  moviesId = await getFavorites();
  // Si hay datos, limpiamos el div y generamos las tarjetas de películas
  if (moviesId.length > 0) {
    removeAllChildNodes("movies");
    for (let id of moviesId) {
      generateMovieCard(id);
    }
  }
});

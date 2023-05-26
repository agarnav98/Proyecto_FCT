// Constantes con los datos de la API
const API_KEY = "281977b424b9f01cf788fdde30b5dad2";
const LANG = "&language=es-ES";
const API_BASE_URL = "https://api.themoviedb.org/3/";
const API_POSTER_URL = "https://image.tmdb.org/t/p/w500/";

/**
 * Removes all child nodes for the element specified
 *
 * @param {String} elementName
 */
const removeAllChildNodes = (elementName) => {
  let elementNode = document.getElementById(elementName);
  while (elementNode.firstChild) {
    elementNode.removeChild(elementNode.firstChild);
  }
};

/**
 * Obtiene un array con las películas añadidas en favoritos
 *
 * @returns array
 */
const getFavorites = () => {
  let favs = [];
  if (localStorage["favorites"] != undefined) {
    favs = localStorage["favorites"].split(",");
  }
  return favs;
};

/**
 * Guarda el id de la película en localStorage
 *
 * @param {integer} id
 */
const addToFavorites = (id) => {
  let favs = getFavorites();
  if (favs.indexOf(id.toString()) < 0) {
    favs.push(id);
  }
  localStorage["favorites"] = favs.toString();
};

/**
 * Borra el id de la película de localStorage
 *
 * @param {integer} id
 */
const deleteFromFavorites = (id) => {
  let favs = getFavorites();
  favs = favs.filter(function (value) {
    return value != id.toString();
  });
  favs.length === 0
    ? delete localStorage["favorites"]
    : (localStorage["favorites"] = favs.toString());
};

/**
 * Genera una tarjeta con los datos de la película pasada por id
 *
 * @param {integer} id
 */
async function generateMovieCard(id) {
  try {
    // Hacemos una petición a la API con el id de la película
    const response = await fetch(`${API_BASE_URL}/movie/${id}?api_key=${API_KEY}${LANG}`);

    // Recogemos los datos del json
    const responseData = await response.json();
    let title = responseData?.title;
    let overview = responseData?.overview;
    let genres = responseData?.genres;
    let genreName = "";
    let originalLanguage = responseData?.original_language;
    let releaseDate = responseData?.release_date;
    let voteAverage = responseData?.vote_average;
    let posterPath = responseData?.poster_path;

    // Construimos la tarjeta de la película
    const divCard = document.createElement("div");
    divCard.className = "card mb-3 text-white bg-dark border-0";
    document.getElementById("movies").appendChild(divCard);

    const divRowBody = document.createElement("div");
    divRowBody.className = "row g-0";
    divCard.appendChild(divRowBody);

    const divColImg = document.createElement("div");
    divColImg.className = "col-md-4";
    divRowBody.appendChild(divColImg);

    // Generamos la imágen de la película
    const imgPoster = document.createElement("img");
    imgPoster.className = "img-fluid rounded";
    imgPoster.alt = `Poster ${title}`;
    // Si no hay imagen de la película, mostramos una carátula por defecto
    if (posterPath) {
      imgPoster.src = API_POSTER_URL + posterPath;
    } else {
      imgPoster.src = "sources/img/no_image.png";
    }
    divColImg.appendChild(imgPoster);

    const divColBody = document.createElement("div");
    divColBody.className = "col-md-8";
    divRowBody.appendChild(divColBody);

    const divCardBody = document.createElement("div");
    divCardBody.className = "card-body";
    divColBody.appendChild(divCardBody);

    // Generamos el icono de favoritos
    const favIcon = document.createElement("p");
    favIcon.id = "favIcon";
    // Obtenemos la lista de favoritos de localStorage
    let favs = getFavorites();
    // Si no encuentra el id en localStorage, dibujará la estrella vacía
    if (favs.indexOf(id.toString()) == -1) {
      favIcon.appendChild(document.createTextNode("☆"));
    } else {
      favIcon.appendChild(document.createTextNode("★"));
    }
    divCardBody.appendChild(favIcon);
    // Al hacer click, cambiamos el icono y guardamos o borramos de localStorage
    favIcon.addEventListener("click", () => {
      if (favIcon.textContent == "☆") {
        favIcon.textContent = "★";
        addToFavorites(id);
      } else {
        favIcon.textContent = "☆";
        deleteFromFavorites(id);
      }
    });

    // Generamos el título
    const cardTitle = document.createElement("h4");
    cardTitle.className = "card-title";
    cardTitle.appendChild(document.createTextNode(title));
    divCardBody.appendChild(cardTitle);

    // Generamos los géneros
    const cardGenres = document.createElement("p");
    cardGenres.id = "genres";
    for (let [index, genre] of genres.entries()) {
      // Si es el úlimo género de la lista, le quitamos la coma
      if (index == genres.length - 1) {
        genreName += `${genre["name"]}`;
      } else {
        genreName += `${genre["name"]}, `;
      }
    }
    cardGenres.appendChild(document.createTextNode(genreName));
    divCardBody.appendChild(cardGenres);

    // Generamos la descripción
    const cardOverview = document.createElement("p");
    cardOverview.className = "card-text";
    cardOverview.appendChild(document.createTextNode(overview));
    divCardBody.appendChild(cardOverview);

    // Generamos el idioma
    const cardLang = document.createElement("div");
    cardLang.className = "card-special-text";
    divCardBody.appendChild(cardLang);
    const textLang = document.createElement("p");
    textLang.appendChild(document.createTextNode("Idioma original: "));
    cardLang.appendChild(textLang);
    const spanLang = document.createElement("span");
    spanLang.className = "text-uppercase";
    spanLang.appendChild(document.createTextNode(originalLanguage));
    textLang.appendChild(spanLang);

    // Generamos la fecha de estreno
    const cardRelease = document.createElement("div");
    cardRelease.className = "card-special-text";
    divCardBody.appendChild(cardRelease);
    const textRelease = document.createElement("p");
    textRelease.appendChild(document.createTextNode("Fecha de estreno: "));
    cardRelease.appendChild(textRelease);
    const spanRelease = document.createElement("span");
    // Cambiamos el formato de fecha
    spanRelease.appendChild(document.createTextNode(releaseDate.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, "$3/$2/$1")));
    textRelease.appendChild(spanRelease);

    // Generamos la media de votos
    const cardVote = document.createElement("div");
    cardVote.className = "card-special-text";
    divCardBody.appendChild(cardVote);
    const textVote = document.createElement("p");
    textVote.appendChild(document.createTextNode("Puntuación: "));
    cardVote.appendChild(textVote);
    const spanVote = document.createElement("span");
    spanVote.appendChild(document.createTextNode(voteAverage + "/10"));
    textVote.appendChild(spanVote);

    // Si hay errores en la petición, los mostramos por consola
  } catch (error) {
    console.log(`Error en la petición: ${error}`);
  }
}

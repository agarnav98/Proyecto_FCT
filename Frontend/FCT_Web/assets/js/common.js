// API URL
const API_BASE_URL = "http://127.0.0.1:8000/api/";
const LOGIN_PAGE = "index.html"
const DOCENTE_PAGE = "users.html";
const ALUMNO_PAGE = "alumno.html";

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
 * Removes class "is-invalid" for the element specified
 *
 * @param {String} elementName
 */
const removeInputError = (elementName) => {
  let elementNode = document.getElementById(elementName);
  elementNode.className = elementNode.className.replace(/(?:^|\s)is-invalid(?!\S)/g, '');
};

/**
 * Loading animation function
 */
function loading() {
  setTimeout(function() {
    document.getElementById('loading').style.display = 'none';
  }, 2000);
}

/**
 * Short loading animation function
 */
function shortLoading() {
  setTimeout(function() {
    document.getElementById('loading').style.display = 'none';
  }, 500);
}

/**
 * Get user role
 *
 * @return {Promise} roleId
 */
function getRole() {
  // API get user data request
  return new Promise((resolve, reject) =>
  (fetch(`${API_BASE_URL}user`, {
    method: "GET",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  })
    // Get JSON response
    .then(response => response.json())
    .then(data => {
      // If status is true, return role_id
      if (data.status) {
        return resolve(data.user.role_id);
      } else {
        // Show error message
        console.log(data.message)
        return resolve(null);
      }
    })
    // Show API request error
    .catch((error) => {
      console.error('Error:', error);
      return reject(error)
    })))
}

/**
 * Logout user and redirect to index
 *
 */
function logout() {
  if (confirm("¿Quiere cerrar la sesión?")) {
    // API get user data request
    fetch(`${API_BASE_URL}logout`, {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    })
      // Get JSON response and remove item
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        localStorage.removeItem("token");
        window.location.href = LOGIN_PAGE;
      })
      // Show API request error
      .catch((error) => {
        console.log('Error:', error);
      });
  }
}
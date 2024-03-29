// API URL
const API_BASE_URL = "http://127.0.0.1:8000/api/";
const LOGIN_PAGE = "index.html"
const DOCENTE_PAGE = "users.html";
const ALUMNO_PAGE = "alumno.html";
const USER_SHOW_PAGE = "showUser.html";
const NEW_USER_PAGE = "newUser.html";
const COMPANIES_PAGE = "companies.html";
const COMPANY_SHOW_PAGE = "showCompany.html";
const NEW_COMPANY_PAGE = "newCompany.html";
const ALUMNO_COMPANY_PAGE = "alumnoCompany.html";

// SVG Icons
const EMPTY_ICON = `<svg aria-hidden="true" focusable="false" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" width="20px">
    <path fill-rule="evenodd" d="M0 10C0 4.478 4.478 0 10 0c5.523 0 10 4.478 10 10 0 5.523-4.477 10-10 10-5.522 0-10-4.477-10-10zm11.125 2.002H8.989v-.141c.01-1.966.492-2.254 1.374-2.782.093-.056.19-.114.293-.178.73-.459 1.292-1.038 1.292-1.883 0-.948-.743-1.564-1.666-1.564-.851 0-1.657.398-1.712 1.533H6.304C6.364 4.693 8.18 3.5 10.294 3.5c2.306 0 3.894 1.447 3.894 3.488 0 1.382-.695 2.288-1.805 2.952l-.238.144c-.79.475-1.009.607-1.02 1.777V12zm.17 3.012a1.344 1.344 0 01-1.327 1.328 1.32 1.32 0 01-1.328-1.328 1.318 1.318 0 011.328-1.316c.712 0 1.322.592 1.328 1.316z" fill="#5C5F62"/>
</svg>`;
const EDIT_ICON = `<svg aria-hidden="true" focusable="false" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" width="20px">
  <path d="M14.846 1.403l3.752 3.753.625-.626A2.653 2.653 0 0015.471.778l-.625.625zm2.029 5.472l-3.752-3.753L1.218 15.028 0 19.998l4.97-1.217L16.875 6.875z" fill="#164e87"/>
</svg>`;
const DELETE_ICON = `<svg aria-hidden="true" focusable="false" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" width="20px">
  <path fill-rule="evenodd" d="M14 4h3a1 1 0 011 1v1H2V5a1 1 0 011-1h3V1.5A1.5 1.5 0 017.5 0h5A1.5 1.5 0 0114 1.5V4zM8 2v2h4V2H8zM3 8h14v10.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 18.5V8zm4 3H5v6h2v-6zm4 0H9v6h2v-6zm2 0h2v6h-2v-6z" fill="#a2182f"/>
</svg>`;
const ACCEPTED_ICON = `<svg aria-hidden="true" focusable="false" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" width="20px">
  <path fill-rule="evenodd" d="M0 10a10 10 0 1020 0 10 10 0 00-20 0zm15.2-1.8a1 1 0 00-1.4-1.4L9 11.6 6.7 9.3a1 1 0 00-1.4 1.4l3 3c.4.4 1 .4 1.4 0l5.5-5.5z" fill="#066b1b"/>
</svg>`;
const PENDING_ICON = `<svg aria-hidden="true" focusable="false" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" width="20px">
  <path fill-rule="evenodd" d="M0 10C0 4.486 4.486 0 10 0s10 4.486 10 10-4.486 10-10 10S0 15.514 0 10zm10 1a1 1 0 100-2 1 1 0 000 2zm-3-1a1 1 0 11-2 0 1 1 0 012 0zm7 1a1 1 0 100-2 1 1 0 000 2z" fill="#d6630b"/>
</svg>`;
const DENIED_ICON = `<svg aria-hidden="true" focusable="false" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" width="20px">
  <path d="M0 10C0 4.486 4.486 0 10 0s10 4.486 10 10-4.486 10-10 10S0 15.514 0 10zm7.707-3.707a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 101.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293z" fill="#a3190f"/>
</svg>`;
const DOWNLOAD_ICON = `<svg aria-hidden="true" focusable="false" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" width="20px">
  <path d="M13.707 10.707a.999.999 0 10-1.414-1.414L11 10.586V3a1 1 0 10-2 0v7.586L7.707 9.293a.999.999 0 10-1.414 1.414l3 3a.999.999 0 001.414 0l3-3zM3 16a1 1 0 100 2h14a1 1 0 100-2H3z" fill="green"/>
</svg>`;


// Candidacies status icons
const EMPTY_CANDIDACIES = `<span class="with-icon--before me-1">${EMPTY_ICON}</span>Sin candidaturas`;
const ACCEPTED_CANDIDACIES = `<span class="with-icon--before me-1">${ACCEPTED_ICON}</span>Aceptado`;
const PENDING_CANDIDACIES = `<span class="with-icon--before me-1">${PENDING_ICON}</span>En espera`;
const DENIED_CANDIDACIES = `<span class="with-icon--before me-1">${DENIED_ICON}</span>Denegado`;
const EMPTY_HEADQUARTERS = `<span class="with-icon--before me-1">${EMPTY_ICON}</span>Sin sedes`;
const DOWNLOAD_CV = `Descargar CV<span class="with-icon--after ms-1">${DOWNLOAD_ICON}</span>`;

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
 * Removes Loading animation function
 */
function removeLoading() {
  setTimeout(function () {
    document.getElementById('loading').style.display = 'none';
  }, 1000);
}

/**
 * Removes Loading animation function
 */
function loading() {
  document.getElementById('loading').removeAttribute("style");
  removeLoading();
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
        console.log('Error:', data.message)
        return resolve(data.message);
      }
    })
    // Show API request error
    .catch((error) => {
      alert("Error al conectar con el servidor.")
      window.location.replace(LOGIN_PAGE);
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
    // API post Logout request
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
        window.location.replace(LOGIN_PAGE);
      })
      // Show API request error
      .catch((error) => {
        console.log('Error:', error);
      });
  }
}

/**
 * Delete user
 * 
 * @param {Integer} id
 * @param {Boolean} reload  
 */
function deleteUser(id, reload) {
  if (confirm("¿Está seguro de eliminar el usuario?")) {
    // API Delete User request
    fetch(`${API_BASE_URL}users/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    })
      // Get JSON response and remove item
      .then((response) => response.json())
      .then((data) => {
        if (data.status && reload) {
          window.location.reload();
        }
        else if (data.status && !reload) {
          window.location.replace(DOCENTE_PAGE);
        }
        alert(data.message);
      })
      // Show API request error
      .catch((error) => {
        console.log('Error:', error);
      });
  }
}

/**
 * Get roles list
 *
 * @return {Promise} companies
 */
function roles() {
  // API get roles data request
  return new Promise((resolve, reject) =>
    fetch(`${API_BASE_URL}roles`, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      // Get JSON response
      .then((response) => response.json())
      .then((data) => {
        // If status is true, return company information
        if (data.status) {
          return resolve(data.roles);
        } else {
          // Show error message
          console.log("Error:", data.message);
          return resolve(null);
        }
      })
      // Show API request error
      .catch((error) => {
        console.error("Error:", error);
        return reject(error);
      })
  );
}

/**
 * Get company list
 *
 * @return {Promise} companies
 */
function companies() {
  // API get company data request
  return new Promise((resolve, reject) =>
    fetch(`${API_BASE_URL}companies`, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      // Get JSON response
      .then((response) => response.json())
      .then((data) => {
        // If status is true, return company list
        if (data.status) {
          return resolve(data.companies);
        } else {
          // Show error message
          console.log("Error:", data.message);
          return resolve(null);
        }
      })
      // Show API request error
      .catch((error) => {
        console.error("Error:", error);
        return reject(error);
      })
  );
}

/**
 * Get company specified by id
 *
 * @param {Integer} id
 * @return {Promise} company
 */
function getCompany(id) {
  // API get company data request
  return new Promise((resolve, reject) =>
    fetch(`${API_BASE_URL}companies/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      // Get JSON response
      .then((response) => response.json())
      .then((data) => {
        // If status is true, return company information
        if (data.status) {
          return resolve(data.company);
        } else {
          // Show error message
          console.log("Error:", data.message);
          return resolve(data.message);
        }
      })
      // Show API request error
      .catch((error) => {
        console.error("Error:", error);
        return reject(error);
      })
  );
}

/**
 * Delete user
 * 
 * @param {Integer} id
 * @param {Boolean} reload  
 */
function deleteCompany(id, reload) {
  if (confirm("¿Está seguro de eliminar la empresa?")) {
    // API Delete User request
    fetch(`${API_BASE_URL}companies/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    })
      // Get JSON response and remove item
      .then((response) => response.json())
      .then((data) => {
        if (data.status && reload) {
          window.location.reload();
        }
        else if (data.status && !reload) {
          window.location.replace(COMPANIES_PAGE);
        }
        alert(data.message);
      })
      // Show API request error
      .catch((error) => {
        console.log('Error:', error);
      });
  }
}

/**
 * Get logged user information
 *
 * @param {Integer} id
 * @return {Promise} user
 */
function thisUser() {
  // API get user data request
  return new Promise((resolve, reject) =>
    fetch(`${API_BASE_URL}user`, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      // Get JSON response
      .then((response) => response.json())
      .then((data) => {
        // If status is true, return user information
        if (data.status) {
          return resolve(data.user);
        } else {
          // Show error message
          console.log("Error:", data.message);
          return resolve(data.message);
        }
      })
      // Show API request error
      .catch((error) => {
        console.error("Error:", error);
        return reject(error);
      })
  );
}

/**
 * Download user CV
 *
 * @param {Integer} id
 */
function downloadCV(id, name, lastName) {
  // Download CV
  fetch(`${API_BASE_URL}cv/${id}`, {
    method: "GET",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  })
    // Get JSON response and remove item
    .then((response) => response.blob())
    .then(data => {
      var a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.download = `CV_${name}_${lastName}`.split(' ').join('_');
      a.click();
    })
    // Show API request error
    .catch((error) => {
      console.log('Error:', error);
    });
}
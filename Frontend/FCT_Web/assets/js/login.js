// If it is a valid token, it redirects to the corresponding page
getRole().then(role_id => {
    if (role_id == 1) {
        window.location.replace(DOCENTE_PAGE);
    }
    else if (role_id == 2) {
        window.location.replace(ALUMNO_PAGE);
    }
});

/**
 * Send POST Login to the API
 *
 * @param {Object} event
 */
function login(event) {
    event.preventDefault();

    // Form elements
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const errorEmail = document.getElementById("errorEmail");
    const errorPassword = document.getElementById("errorPassword");
    const errorLogin = document.getElementById("errorLogin");
    const btnLogin = document.getElementById("btn-login");

    // Reset form errors
    removeInputError("email");
    removeInputError("password");

    // Disables the button while the request is generated
    btnLogin.disabled = true;
    btnLogin.textContent = "Espere unos segundos..."

    // API Login request
    fetch(`${API_BASE_URL}login`, {
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
        // Serialize JSON body
        body: JSON.stringify({
            "email": email.value,
            "password": password.value,
        }),
    })
        // Get JSON response
        .then((response) => response.json())
        .then((data) => {
            // If status is true, save the token in localStorage
            if (data.status) {
                localStorage.setItem("token", data.token);
                // Redirects to the corresponding page
                getRole().then(role_id => {
                    if (role_id == 1) {
                        window.location.replace(DOCENTE_PAGE);
                    }
                    else if (role_id == 2) {
                        window.location.href = ALUMNO_PAGE;
                    }
                });
            } else {
                // Show validation messages
                removeAllChildNodes("errorEmail");
                if (data.message.email) {
                    email.className += " is-invalid";
                    errorEmail.appendChild(document.createTextNode(data.message.email[0]));
                }
                removeAllChildNodes("errorPassword");
                if (data.message.password) {
                    password.className += " is-invalid";
                    errorPassword.appendChild(document.createTextNode(data.message.password[0]));
                }
                removeAllChildNodes("errorLogin");
                if (data.message.login) {
                    errorLogin.appendChild(document.createTextNode(data.message.login[0]));
                }
            }
            // Enables the button
            btnLogin.disabled = false;
            btnLogin.textContent = "Iniciar sesión"
        })
        // Show API request error
        .catch((error) => {
            console.log('Error:', error);
        });
}

// When loading the html, the script will be executed
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("formLogin").addEventListener("submit", login);
    // Finally, removes loading animation
    removeLoading();
});

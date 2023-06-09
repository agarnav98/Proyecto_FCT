// If the role_id is not 1, redirect to login
getRole().then((role_id) => {
    if (role_id != 1) {
        window.location.replace(LOGIN_PAGE);
    }
});

/**
 * Send POST Create User to the API
 *
 */
function createUser(event) {
    event.preventDefault();

    // Form elements
    const name = document.getElementById("name");
    const lastName = document.getElementById("last-name");
    const dni = document.getElementById("dni");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const passwordRepeat = document.getElementById("password-repeat");
    const mobile = document.getElementById("mobile");
    const role = document.getElementById("role");
    const btnCreate = document.getElementById("btn-create");
    const errorName = document.getElementById("error-name");
    const errorLastName = document.getElementById("error-last-name");
    const errorDni = document.getElementById("error-dni");
    const errorEmail = document.getElementById("error-email");
    const errorPassword = document.getElementById("error-password");
    const errorPasswordRepeat = document.getElementById("error-password-repeat");
    const errorMobile = document.getElementById("error-mobile");
    const errorRole = document.getElementById("error-role");

    // Reset form errors
    removeInputError("name");
    removeInputError("last-name");
    removeInputError("dni");
    removeInputError("email");
    removeInputError("password");
    removeInputError("password-repeat");
    removeInputError("mobile");
    removeInputError("role");

    // Disables the button while the request is generated
    btnCreate.disabled = true;
    btnCreate.textContent = "Espere..."

    // API Login request
    fetch(`${API_BASE_URL}register`, {
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // Serialize JSON body
        body: JSON.stringify({
            "name": name.value,
            "last_name": lastName.value,
            "dni": dni.value,
            "email": email.value,
            "password": password.value,
            "password_repeat": passwordRepeat.value,
            "mobile": mobile.value,
            "role_id": role.value,
        }),
    })
        // Get JSON response
        .then((response) => response.json())
        .then((data) => {
            if (data.status) {
                alert("Usuario creado.");
                window.location.href = `${USER_SHOW_PAGE}?id=${data.user.id}`;
            } else {
                // Show validation messages
                removeAllChildNodes("error-name");
                if (data.message.name) {
                    name.className += " is-invalid";
                    errorName.appendChild(document.createTextNode(data.message.name[0]));
                }
                removeAllChildNodes("error-last-name");
                if (data.message.last_name) {
                    lastName.className += " is-invalid";
                    errorLastName.appendChild(document.createTextNode(data.message.last_name[0]));
                }
                removeAllChildNodes("error-dni");
                if (data.message.dni) {
                    dni.className += " is-invalid";
                    errorDni.appendChild(document.createTextNode(data.message.dni[0]));
                }
                removeAllChildNodes("error-email");
                if (data.message.email) {
                    email.className += " is-invalid";
                    errorEmail.appendChild(document.createTextNode(data.message.email[0]));
                }
                removeAllChildNodes("error-password");
                if (data.message.password) {
                    password.className += " is-invalid";
                    errorPassword.appendChild(document.createTextNode(data.message.password[0]));
                }
                removeAllChildNodes("error-password-repeat");
                if (data.message.password_repeat) {
                    passwordRepeat.className += " is-invalid";
                    errorPasswordRepeat.appendChild(document.createTextNode(data.message.password_repeat[0]));
                }
                removeAllChildNodes("error-mobile");
                if (data.message.mobile) {
                    mobile.className += " is-invalid";
                    errorMobile.appendChild(document.createTextNode(data.message.mobile[0]));
                }
                removeAllChildNodes("error-role");
                if (data.message.role_id) {
                    role.className += " is-invalid";
                    errorRole.appendChild(document.createTextNode(data.message.role_id[0]));
                }
            }
            // Enables the button
            btnCreate.disabled = false;
            btnCreate.textContent = "Crear"
        })
        // Show API request error
        .catch((error) => {
            console.log('Error:', error);
        });
}

// When loading the html, the script will be executed
window.addEventListener("DOMContentLoaded", () => {
    const selectRole = document.getElementById("role");

    // Create select roles
    roles().then((roles) => {
        Array.from(roles).forEach(role => {
            let option = document.createElement('option');
            option.value = role.id;
            option.appendChild(document.createTextNode(role.role));
            selectRole.appendChild(option);
        });
    });

    document.getElementById("form-create").addEventListener("submit", createUser);

    // Finally, removes loading animation
    removeLoading();

});
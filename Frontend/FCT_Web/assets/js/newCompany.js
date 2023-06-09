// If the role_id is not 1, redirect to login
getRole().then((role_id) => {
    if (role_id != 1) {
        window.location.replace(LOGIN_PAGE);
    }
});

/**
 * Send POST Create Comany to the API
 *
 */
function createCompany(event) {
    event.preventDefault();

    // Form elements
    // Form elements
    const name = document.getElementById("name");
    const cif = document.getElementById("cif");
    const email = document.getElementById("email");
    const btnCreate = document.getElementById("btn-create");
    const errorName = document.getElementById("error-name");
    const errorCif = document.getElementById("error-cif");
    const errorEmail = document.getElementById("error-email");

    // Reset form errors
    removeInputError("name");
    removeInputError("cif");
    removeInputError("email");

    // Disables the button while the request is generated
    btnCreate.disabled = true;
    btnCreate.textContent = "Espere..."

    // API Login request
    fetch(`${API_BASE_URL}companies`, {
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // Serialize JSON body
        body: JSON.stringify({
            "name": name.value,
            "cif": cif.value,
            "email": email.value
        }),
    })
        // Get JSON response
        .then((response) => response.json())
        .then((data) => {
            if (data.status) {
                alert("Empresa creada.");
                window.location.href = `${COMPANY_SHOW_PAGE}?id=${data.company.id}`;
            } else {
                // Show validation messages
                removeAllChildNodes("error-name");
                if (data.message.name) {
                    name.className += " is-invalid";
                    errorName.appendChild(document.createTextNode(data.message.name[0]));
                }
                removeAllChildNodes("error-cif");
                if (data.message.cif) {
                    cif.className += " is-invalid";
                    errorCif.appendChild(document.createTextNode(data.message.cif[0]));
                }
                removeAllChildNodes("error-email");
                if (data.message.email) {
                    email.className += " is-invalid";
                    errorEmail.appendChild(document.createTextNode(data.message.email[0]));
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
    document.getElementById("form-create").addEventListener("submit", createCompany);

    // Finally, removes loading animation
    removeLoading();

});
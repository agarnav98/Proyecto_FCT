// If the role_id is not 1, redirect to login
getRole().then((role_id) => {
    if (role_id != 1) {
        window.location.replace(LOGIN_PAGE);
    }
});

/**
 * Get user specified by id
 *
 * @param {Integer} id
 * @return {Promise} user
 */
function getUser(id) {
    // API get user data request
    return new Promise((resolve, reject) =>
        fetch(`${API_BASE_URL}users/${id}`, {
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
 * Send PUT Update Candidacy to the API
 *
 * @param {Integer} id
 * @param {Boolean} status
 */
function updateCandidacy(id, status) {

    // API Login request
    fetch(`${API_BASE_URL}candidacies/${id}`, {
        method: "PUT",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // Serialize JSON body
        body: JSON.stringify({
            "status": status
        }),
    })
        // Get JSON response
        .then((response) => response.json())
        .then((data) => {
            if (data.status) {
                window.location.reload();
            }
            alert(data.message);
        })
        // Show API request error
        .catch((error) => {
            console.log('Error:', error);
        });
}

/**
 * Delete user
 * 
 * @param {Integer} id
 */
function deleteCandidacy(id) {
    if (confirm("¿Está seguro de eliminar la candidatura?")) {
        // API Delete Candidacy request
        fetch(`${API_BASE_URL}candidacies/${id}`, {
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
                if (data.status) {
                    window.location.reload();
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
 * Send POST Create Candidacy to the API
 *
 * @param {int} userId
 */
function createCandidacy(userId) {

    // Form elements
    const company = document.getElementById("select-company");
    const status = document.getElementById("select-status");
    const btnAdd = document.getElementById("btn-add");
    const errorCompany = document.getElementById("error-company");
    const errorStatus = document.getElementById("error-status");

    // Reset form errors
    removeInputError("select-company");
    removeInputError("select-status");

    // Disables the button while the request is generated
    btnAdd.disabled = true;
    btnAdd.textContent = "Espere..."

    // API Login request
    fetch(`${API_BASE_URL}users/${userId}/candidacies`, {
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // Serialize JSON body
        body: JSON.stringify({
            "company_id": company.value,
            "status": status.value
        }),
    })
        // Get JSON response
        .then((response) => response.json())
        .then((data) => {
            if (data.status) {
                alert(data.message);
                window.location.reload();
            } else {
                // Show validation messages
                removeAllChildNodes("error-company");
                if (data.message.company_id) {
                    company.className += " is-invalid";
                    errorCompany.appendChild(document.createTextNode(data.message.company_id[0]));
                }
                else if (data.message.candidacy) {
                    errorCompany.appendChild(document.createTextNode(data.message.candidacy[0]));
                }
                removeAllChildNodes("error-status");
                if (data.message.status && status.value == 3) {
                    status.className += " is-invalid";
                    errorStatus.appendChild(document.createTextNode("Estado requerido."));
                }
                else if (data.message.status) {
                    status.className += " is-invalid";
                    errorStatus.appendChild(document.createTextNode(data.message.status[0]));
                }
            }
            // Enables the button
            btnAdd.disabled = false;
            btnAdd.textContent = "Añadir"
        })
        // Show API request error
        .catch((error) => {
            console.log('Error:', error);
        });
}

/**
 * Send PUT Update User to the API
 *
 * @param {int} id
 */
function updateUser(id) {

    // Form elements
    const name = document.getElementById("name");
    const lastName = document.getElementById("last-name");
    const dni = document.getElementById("dni");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const mobile = document.getElementById("mobile");
    const birth = document.getElementById("birth");
    const role = document.getElementById("role");
    const address = document.getElementById("address");
    const town = document.getElementById("town");
    const preferences = document.getElementById("preferences");
    const btnUpdate = document.getElementById("btn-update");
    const errorName = document.getElementById("error-name");
    const errorLastName = document.getElementById("error-last-name");
    const errorDni = document.getElementById("error-dni");
    const errorEmail = document.getElementById("error-email");
    const errorPassword = document.getElementById("error-password");
    const errorMobile = document.getElementById("error-mobile");
    const errorBirth = document.getElementById("error-birth");
    const errorRole = document.getElementById("error-role");
    const errorAddress = document.getElementById("error-address");
    const errorTown = document.getElementById("error-town");
    const errorPreferences = document.getElementById("error-preferences");

    // Reset form errors
    removeInputError("name");
    removeInputError("last-name");
    removeInputError("dni");
    removeInputError("email");
    removeInputError("password");
    removeInputError("mobile");
    removeInputError("birth");
    removeInputError("role");
    removeInputError("address");
    removeInputError("town");
    removeInputError("preferences");

    // Disables the button while the request is generated
    btnUpdate.disabled = true;
    btnUpdate.textContent = "Espere..."

    // API Login request
    fetch(`${API_BASE_URL}users/${id}`, {
        method: "PUT",
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
            "mobile": mobile.value,
            "birth": birth.value,
            "role_id": role.value,
            "address": address.value,
            "town": town.value,
            "preferences": preferences.value
        }),
    })
        // Get JSON response
        .then((response) => response.json())
        .then((data) => {
            if (data.status) {
                alert("Usuario actualizado.");
                window.location.reload();
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
                removeAllChildNodes("error-mobile");
                if (data.message.mobile) {
                    mobile.className += " is-invalid";
                    errorMobile.appendChild(document.createTextNode(data.message.mobile[0]));
                }
                removeAllChildNodes("error-birth");
                if (data.message.birth) {
                    birth.className += " is-invalid";
                    errorBirth.appendChild(document.createTextNode(data.message.birth[0]));
                }
                removeAllChildNodes("error-role");
                if (data.message.role_id) {
                    role.className += " is-invalid";
                    errorRole.appendChild(document.createTextNode(data.message.role_id[0]));
                }
                removeAllChildNodes("error-address");
                if (data.message.address) {
                    address.className += " is-invalid";
                    errorAddress.appendChild(document.createTextNode(data.message.address[0]));
                }
                removeAllChildNodes("error-town");
                if (data.message.town) {
                    town.className += " is-invalid";
                    errorTown.appendChild(document.createTextNode(data.message.town[0]));
                }
                removeAllChildNodes("error-preferences");
                if (data.message.preferences) {
                    preferences.className += " is-invalid";
                    errorPreferences.appendChild(document.createTextNode(data.message.preferences[0]));
                }
            }
            // Enables the button
            btnUpdate.disabled = false;
            btnUpdate.textContent = "Actualizar"
        })
        // Show API request error
        .catch((error) => {
            console.log('Error:', error);
        });
}

// When loading the html, the script will be executed
window.addEventListener("DOMContentLoaded", () => {
    const id = new URLSearchParams(window.location.search).get("id");
    // Form elements
    const formInputs = document.getElementsByClassName('form-control-plaintext');
    const inputsRequired = document.getElementsByClassName('required');
    const name = document.getElementById("name");
    const lastName = document.getElementById("last-name");
    const dni = document.getElementById("dni");
    const email = document.getElementById("email");
    const divPassword = document.getElementById("div-password");
    const mobile = document.getElementById("mobile");
    const birth = document.getElementById("birth");
    const selectRole = document.getElementById("role");
    const address = document.getElementById("address");
    const town = document.getElementById("town");
    const preferences = document.getElementById("preferences");
    const btnEdit = document.getElementById("btn-edit");
    const btnDelete = document.getElementById("btn-delete");
    const btnUpdate = document.getElementById("btn-update");
    const btnCancel = document.getElementById("btn-cancel");
    const selectCompany = document.getElementById("select-company");
    const btnAdd = document.getElementById("btn-add");

    // Create select roles
    roles().then((roles) => {
        Array.from(roles).forEach(role => {
            let option = document.createElement('option');
            option.value = role.id;
            option.appendChild(document.createTextNode(role.role));
            selectRole.appendChild(option);
        });
    });

    let companiesName = [];
    // Gets all companies
    companies().then((companies) => {
        Array.from(companies).forEach(company => {
            companiesName[company.id] = company.name;
        });
    });

    getUser(id).then((user) => {
        if (user == "User does not exist") {
            alert("No existe el usuario con el ID indicado.")
            window.location.replace(DOCENTE_PAGE);
        }
        else {
            // Sets the user data in the form
            name.value = user.name;
            lastName.value = user.last_name;
            dni.value = user.dni;
            email.value = user.email;
            mobile.value = user.mobile;
            birth.value = user.birth;
            selectRole.value = user.role_id;
            address.value = user.address;
            town.value = user.town;
            preferences.value = user.preferences;

            // Creates user table
            new DataTable("#candidacies", {
                dom: 'Bfrtip',
                // Table buttons
                buttons: [
                    {
                        extend: 'collection',
                        text: 'Filtrar estado',
                        buttons: [
                            {
                                text: ACCEPTED_CANDIDACIES,
                                action: function (e, dt) {
                                    dt.columns(1).search('Aceptado').draw();
                                }
                            },
                            {
                                text: PENDING_CANDIDACIES,
                                action: function (e, dt) {
                                    dt.columns(1).search('En espera').draw();
                                }
                            },
                            {
                                text: DENIED_CANDIDACIES,
                                action: function (e, dt) {
                                    dt.columns(1).search('Denegado').draw();
                                }
                            },
                        ]
                    },
                    {
                        text: 'Limpiar filtros',
                        action: function (e, dt) {
                            dt.columns().search('').draw();
                        },
                    },
                ],
                data: user.candidacies,
                columns: [
                    {
                        title: "Empresa",
                        data: "company_id",
                        render: (data) => {
                            return companiesName[data];
                        }
                    },
                    {
                        title: "Estado actual",
                        data: "status",
                        // Show candidacies status
                        render: (data) => {
                            if (data == 1) {
                                return ACCEPTED_CANDIDACIES;
                            }
                            else if (data == 0) {
                                return DENIED_CANDIDACIES;
                            }
                            else {
                                return PENDING_CANDIDACIES;
                            }
                        }
                    },
                    {
                        title: "Cambiar estado",
                        data: "id",
                        // Show candidacies status
                        render: (data) => {
                            return `<a class="link rounded mx-2" onclick="updateCandidacy(${data}, ${true})">${ACCEPTED_ICON}</a>
                            <a class="link rounded mx-2" onclick="updateCandidacy(${data}, ${null})">${PENDING_ICON}</a>
                            <a class="link rounded mx-2" onclick="updateCandidacy(${data}, ${false})">${DENIED_ICON}</a>`;
                        }
                    },
                    {
                        title: "Eliminar",
                        data: "id",
                        // Show candidacies status
                        render: (data) => {
                            return `<a class="link rounded ms-3" onclick="deleteCandidacy(${data})">${DELETE_ICON}</a>`;
                        }
                    },
                ],
                columnDefs: [
                    {
                        // Columns we don't want to be sorted
                        targets: [1, 2, 3],
                        orderable: false,
                    },
                    {
                        // Columns we don't want to be searchable
                        targets: [2, 3],
                        searchable: false,
                    },
                ],
                // Table language
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json",
                },
                // Row number
                lengthChange: false,
                pageLength: 10,
            });
        }
    });

    // By clicking, can edit the form
    btnEdit.addEventListener("click", () => {
        Array.from(formInputs).forEach(input => {
            input.className = "form-control form-control-lg";
            input.removeAttribute("readonly");
        });
        // Changes select role
        selectRole.className = "form-select form-select-lg";
        selectRole.removeAttribute("readonly");
        selectRole.removeAttribute("tabindex");
        selectRole.removeAttribute("style");

        // Hidden elements
        divPassword.removeAttribute("hidden");
        btnEdit.setAttribute("hidden", "");
        btnDelete.setAttribute("hidden", "");
        btnUpdate.removeAttribute("hidden");
        btnCancel.removeAttribute("hidden");
        Array.from(inputsRequired).forEach(input => {
            input.removeAttribute("hidden");
        });
    });

    // Buttons actions
    btnDelete.addEventListener("click", () => {
        deleteUser(id, false);
    });

    btnUpdate.addEventListener("click", () => {
        updateUser(id);
    });

    btnCancel.addEventListener("click", () => {
        if (confirm("¿Está seguro de cancelar los cambios?")) {
            window.location.reload();
        }
    });

    // Create select companies
    companies().then((companies) => {
        Array.from(companies).forEach(company => {
            let option = document.createElement('option');
            option.value = company.id;
            option.appendChild(document.createTextNode(company.name));
            selectCompany.appendChild(option);
        });
    });

    // Form create candidacy
    btnAdd.addEventListener("click", () => {
        createCandidacy(id);
    });

    // Finally, removes loading animation
    removeLoading();

});
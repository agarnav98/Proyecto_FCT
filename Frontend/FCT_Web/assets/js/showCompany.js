// If the role_id is not 1, redirect to login
getRole().then((role_id) => {
    if (role_id != 1) {
        window.location.replace(LOGIN_PAGE);
    }
});

/**
 * Get headquarter specified by id
 *
 * @param {Integer} id
 * @return {Promise} headquarter
 */
function getHeadquarter(id) {
    // API get headquarter data request
    return new Promise((resolve, reject) =>
        fetch(`${API_BASE_URL}headquarters/${id}`, {
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
                // If status is true, return headquarter information
                if (data.status) {
                    return resolve(data.headquarter);
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
 * Send PUT Update Headquarter to the API
 *
 * @param {Integer} id
 */
function updateHeadquarter(id) {

    // Form elements
    const nameHeadquarter = document.getElementById("name-headquarter");
    const mobile = document.getElementById("mobile");
    const address = document.getElementById("address");
    const town = document.getElementById("town");
    const btnUpdate = document.getElementById("btn-update-headquarter");
    const errorNameHeadquarter = document.getElementById("error-name-headquarter");
    const errorMobile = document.getElementById("error-mobile");
    const errorAddress = document.getElementById("error-address");
    const errorTown = document.getElementById("error-town");

    // Reset form errors
    removeInputError("name-headquarter");
    removeInputError("mobile");
    removeInputError("address");
    removeInputError("town");

    // Disables the button while the request is generated
    btnUpdate.disabled = true;
    btnUpdate.textContent = "Espere..."

    // API Login request
    fetch(`${API_BASE_URL}headquarters/${id}`, {
        method: "PUT",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // Serialize JSON body
        body: JSON.stringify({
            "name": nameHeadquarter.value,
            "mobile": mobile.value,
            "address": address.value,
            "town": town.value
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
                removeAllChildNodes("error-name-headquarter");
                if (data.message.name) {
                    nameHeadquarter.className += " is-invalid";
                    errorNameHeadquarter.appendChild(document.createTextNode(data.message.name[0]));
                }
                removeAllChildNodes("error-mobile");
                if (data.message.mobile) {
                    mobile.className += " is-invalid";
                    errorMobile.appendChild(document.createTextNode(data.message.mobile[0]));
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
            }
            // Enables the button
            btnUpdate.disabled = false;
            btnUpdate.textContent = "Añadir"
        })
        // Show API request error
        .catch((error) => {
            console.log('Error:', error);
        });
}

/**
 * Sets the company data in the form
 *
 * @param {Integer} id
 */
function formHeadquarter(id) {

    // Form elements
    const nameHeadquarter = document.getElementById("name-headquarter");
    const mobile = document.getElementById("mobile");
    const address = document.getElementById("address");
    const town = document.getElementById("town");
    const btnAdd = document.getElementById("btn-add");
    const divUpdate = document.getElementById("div-btn-update");
    const divCancel = document.getElementById("div-btn-cancel");
    const btnUpdate = document.getElementById("btn-update-headquarter");
    const btnCancel = document.getElementById("btn-cancel-headquarter");
    
    getHeadquarter(id).then((headquarter) => {
        if (headquarter == "Headquarter does not exist") {
            alert("No existe la sede con el ID indicado.")
            window.location.reload();
        }
        else {
            // Reset form errors
            removeInputError("name-headquarter");
            removeInputError("mobile");
            removeInputError("address");
            removeInputError("town");
            removeAllChildNodes("error-name-headquarter");
            removeAllChildNodes("error-mobile");
            removeAllChildNodes("error-address");
            removeAllChildNodes("error-town");

            // Sets the headquarter data in the form
            nameHeadquarter.value = headquarter.name;
            mobile.value = headquarter.mobile;
            address.value = headquarter.address;
            town.value = headquarter.town;
        }

        // Hidden elements
        btnAdd.setAttribute("hidden", "");
        divUpdate.removeAttribute("hidden");
        divCancel.removeAttribute("hidden");

        btnUpdate.addEventListener("click", () => {
            updateHeadquarter(id);
        });

        btnCancel.addEventListener("click", () => {
            if (confirm("¿Está seguro de cancelar los cambios?")) {
                window.location.reload();
            }
        });

    });
}

/**
 * Delete headquarter
 * 
 * @param {Integer} id
 */
function deleteHeadquarter(id) {
    if (confirm("¿Está seguro de eliminar la sede?")) {
        // API Delete Headquarter request
        fetch(`${API_BASE_URL}headquarters/${id}`, {
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
 * Send POST Create Headquarter to the API
 *
 * @param {int} companyId
 */
function createHeadquarter(companyId) {

    // Form elements
    const nameHeadquarter = document.getElementById("name-headquarter");
    const mobile = document.getElementById("mobile");
    const address = document.getElementById("address");
    const town = document.getElementById("town");
    const btnAdd = document.getElementById("btn-add");
    const errorNameHeadquarter = document.getElementById("error-name-headquarter");
    const errorMobile = document.getElementById("error-mobile");
    const errorAddress = document.getElementById("error-address");
    const errorTown = document.getElementById("error-town");

    // Reset form errors
    removeInputError("name-headquarter");
    removeInputError("mobile");
    removeInputError("address");
    removeInputError("town");

    // Disables the button while the request is generated
    btnAdd.disabled = true;
    btnAdd.textContent = "Espere..."

    // API Login request
    fetch(`${API_BASE_URL}companies/${companyId}/headquarters`, {
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // Serialize JSON body
        body: JSON.stringify({
            "name": nameHeadquarter.value,
            "mobile": mobile.value,
            "address": address.value,
            "town": town.value
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
                removeAllChildNodes("error-name-headquarter");
                if (data.message.name) {
                    nameHeadquarter.className += " is-invalid";
                    errorNameHeadquarter.appendChild(document.createTextNode(data.message.name[0]));
                }
                removeAllChildNodes("error-mobile");
                if (data.message.mobile) {
                    mobile.className += " is-invalid";
                    errorMobile.appendChild(document.createTextNode(data.message.mobile[0]));
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
 * Send PUT Update Company to the API
 *
 * @param {int} id
 */
function updateCompany(id) {

    // Form elements
    const name = document.getElementById("name");
    const cif = document.getElementById("cif");
    const email = document.getElementById("email");
    const btnUpdate = document.getElementById("btn-update");
    const errorName = document.getElementById("error-name");
    const errorCif = document.getElementById("error-cif");
    const errorEmail = document.getElementById("error-email");

    // Reset form errors
    removeInputError("name");
    removeInputError("cif");
    removeInputError("email");

    // Disables the button while the request is generated
    btnUpdate.disabled = true;
    btnUpdate.textContent = "Espere..."

    // API Login request
    fetch(`${API_BASE_URL}companies/${id}`, {
        method: "PUT",
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
                alert("Empresa actualizada.");
                window.location.reload();
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
    const cif = document.getElementById("cif");
    const email = document.getElementById("email");
    const btnEdit = document.getElementById("btn-edit");
    const btnDelete = document.getElementById("btn-delete");
    const btnUpdate = document.getElementById("btn-update");
    const btnCancel = document.getElementById("btn-cancel");
    const btnAdd = document.getElementById("btn-add");

    getCompany(id).then((company) => {
        if (company == "Company does not exist") {
            alert("No existe la empresa con el ID indicado.")
            window.location.replace(COMPANIES_PAGE);
        }
        else {
            // Sets the company data in the form
            name.value = company.name;
            cif.value = company.cif;
            email.value = company.email;

            // Creates headquarters table
            new DataTable("#headquarters", {
                dom: 'frtip',
                data: company.headquarters,
                columns: [
                    { title: "Sede", data: "name" },
                    { title: "Teléfono", data: "mobile" },
                    { title: "Dirección", data: "address" },
                    { title: "Localidad", data: "town" },
                    {
                        title: "Acciones",
                        data: "id",
                        // Show edit icon and delete icon
                        render: (data) => {
                            return `<a class="link rounded mx-2" onclick="formHeadquarter(${data})">${EDIT_ICON}</a>
                                    <a class="link rounded" onclick="deleteHeadquarter(${data})">${DELETE_ICON}</a>`;
                        }
                    },
                ],
                columnDefs: [
                    {
                        // Columns we don't want to be sorted
                        targets: [1, 2, 3, 4],
                        orderable: false,
                    },
                    {
                        // Columns we don't want to be searchable
                        targets: 4,
                        searchable: false,
                    },
                ],
                // Table language
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json",
                },
                // Row number
                lengthChange: false,
                pageLength: 3,
            });
        }
    });

    // By clicking, can edit the form
    btnEdit.addEventListener("click", () => {
        Array.from(formInputs).forEach(input => {
            input.className = "form-control form-control-lg";
            input.removeAttribute("readonly");
        });

        // Hidden elements
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
        deleteCompany(id, false);
    });

    btnUpdate.addEventListener("click", () => {
        updateCompany(id);
    });

    btnCancel.addEventListener("click", () => {
        if (confirm("¿Está seguro de cancelar los cambios?")) {
            window.location.reload();
        }
    });

    // Button create headquarter
    btnAdd.addEventListener("click", () => {
        createHeadquarter(id);
    });

    // Finally, removes loading animation
    removeLoading();

});
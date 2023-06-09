// If the role_id is not 2, redirect to login
getRole().then((role_id) => {
    if (role_id != 2) {
        window.location.replace(LOGIN_PAGE);
    }
});

/**
 * Get logged user information
 *
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
 * Send PUT Change User to the API
 *
 */
function changeUser() {

    // Form elements
    const password = document.getElementById("password");
    const mobile = document.getElementById("mobile");
    const birth = document.getElementById("birth");
    const address = document.getElementById("address");
    const town = document.getElementById("town");
    const preferences = document.getElementById("preferences");
    const btnUpdate = document.getElementById("btn-update");
    const errorPassword = document.getElementById("error-password");
    const errorMobile = document.getElementById("error-mobile");
    const errorBirth = document.getElementById("error-birth");
    const errorAddress = document.getElementById("error-address");
    const errorTown = document.getElementById("error-town");
    const errorPreferences = document.getElementById("error-preferences");

    // Reset form errors
    removeInputError("password");
    removeInputError("mobile");
    removeInputError("birth");
    removeInputError("address");
    removeInputError("town");
    removeInputError("preferences");

    // Disables the button while the request is generated
    btnUpdate.disabled = true;
    btnUpdate.textContent = "Espere..."

    // API Login request
    fetch(`${API_BASE_URL}user`, {
        method: "PUT",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // Serialize JSON body
        body: JSON.stringify({
            "password": password.value,
            "mobile": mobile.value,
            "birth": birth.value,
            "address": address.value,
            "town": town.value,
            "preferences": preferences.value
        }),
    })
        // Get JSON response
        .then((response) => response.json())
        .then((data) => {
            if (data.status) {
                alert("Datos actualizados.");
                window.location.reload();
            } else {
                // Show validation messages
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

/**
 * Send POST Upload CV to the API
 *
 */
function uploadCV() {

    // Form elements
    const cv = document.getElementById("cv");
    const btnUpload = document.getElementById("btn-upload-cv");
    const errorCv = document.getElementById("error-cv");

    // Reset form errors
    removeInputError("cv");

    // Disables the button while the request is generated
    btnUpload.disabled = true;
    btnUpload.textContent = "Espere..."

    // Create form data file
    let file = new FormData();
    file.append('cv', cv.files[0]);

    // API Login request
    fetch(`${API_BASE_URL}cv`, {
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // Sent cv data
        body: file
    })
        // Get JSON response
        .then((response) => response.json())
        .then((data) => {
            if (data.status) {
                alert(data.message);
                window.location.reload();
            } else {
                // Show validation messages
                removeAllChildNodes("error-cv");
                if (data.message.cv) {
                    cv.className += " is-invalid";
                    errorCv.appendChild(document.createTextNode(data.message.cv[0]));
                }
            }
            // Enables the button
            btnUpload.disabled = false;
            btnUpload.textContent = "Subir cv"
        })
        // Show API request error
        .catch((error) => {
            console.log('Error:', error);
        });
}

/**
 * Delete CV
 * 
 */
function deleteCV() {
    if (confirm("¿Está seguro de eliminar su CV?")) {
      // API Delete CV request
      fetch(`${API_BASE_URL}cv`, {
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

// When loading the html, the script will be executed
window.addEventListener("DOMContentLoaded", () => {

    // Form elements
    const formInputs = document.getElementsByClassName('change');
    const inputsRequired = document.getElementsByClassName('required');
    const name = document.getElementById("name");
    const spanName = document.getElementById("title-name");
    const lastName = document.getElementById("last-name");
    const dni = document.getElementById("dni");
    const email = document.getElementById("email");
    const divPassword = document.getElementById("div-password");
    const mobile = document.getElementById("mobile");
    const birth = document.getElementById("birth");
    const address = document.getElementById("address");
    const town = document.getElementById("town");
    const preferences = document.getElementById("preferences");
    const btnEdit = document.getElementById("btn-edit");
    const btnUpdate = document.getElementById("btn-update");
    const btnCancel = document.getElementById("btn-cancel");
    const btnUploadCv = document.getElementById("btn-upload-cv");
    const btnDeleteCv = document.getElementById("btn-delete-cv");
    const linkCV = document.getElementById("link-cv");

    let companiesName = [];
    // Gets all companies
    companies().then((companies) => {
        Array.from(companies).forEach(company => {
            companiesName[company.id] = company.name;
        });
    });

    thisUser().then((user) => {

        // Sets the user data in the form
        spanName.appendChild(document.createTextNode(user.name));
        name.value = user.name;
        lastName.value = user.last_name;
        dni.value = user.dni;
        email.value = user.email;
        mobile.value = user.mobile;
        birth.value = user.birth;
        address.value = user.address;
        town.value = user.town;
        preferences.value = user.preferences;

        // Set link cv
        if (user.cv == null) {
            linkCV.appendChild(document.createTextNode("Todavía no has subido tu CV."));
        }
        else {
            linkCV.innerHTML = DOWNLOAD_CV;
            linkCV.addEventListener("click", () => {
                downloadCV(user.id, user.name, user.last_name);
            });
        }

        // Creates candidacies table
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
                        return `<a href="${ALUMNO_COMPANY_PAGE}?id=${data}" class="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover mx-2">${companiesName[data]}</a>`;
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
            ],
            columnDefs: [
                {
                    // Columns we don't want to be sorted
                    targets: 1,
                    orderable: false,
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
    });

    // By clicking, can edit the form
    btnEdit.addEventListener("click", () => {
        Array.from(formInputs).forEach(input => {
            input.className = "form-control form-control-lg";
            input.removeAttribute("readonly");
        });
        // Hidden elements
        divPassword.removeAttribute("hidden");
        btnEdit.setAttribute("hidden", "");
        btnUpdate.removeAttribute("hidden");
        btnCancel.removeAttribute("hidden");
        Array.from(inputsRequired).forEach(input => {
            input.removeAttribute("hidden");
        });
    });

    btnUpdate.addEventListener("click", () => {
        changeUser();
    });

    btnCancel.addEventListener("click", () => {
        if (confirm("¿Está seguro de cancelar los cambios?")) {
            window.location.reload();
        }
    });

    btnUploadCv.addEventListener("click", () => {
        uploadCV();
    });

    btnDeleteCv.addEventListener("click", () => {
        deleteCV();
    });

    // Finally, removes loading animation
    removeLoading();

});